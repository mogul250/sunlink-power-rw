import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import express from 'express';
import jwt from 'jsonwebtoken';
let server, pool, originalQuery, originalGetConnection, directory, base, token;
let calls = [], failure = false;
const db = {
 beginTransaction: async () => calls.push('begin'),
 commit: async () => calls.push('commit'),
 rollback: async () => calls.push('rollback'),
 release: () => calls.push('release'),
 query: async (sql) => {
  calls.push(sql);
  if (sql.startsWith('SELECT * FROM Projects')) return [[{ id: 7, image_url: '/uploads/projects/old.png' }]];
  if (sql.startsWith('SELECT id FROM ProjectImages')) return [[{ id: 9 }]];
  if (sql.startsWith('SELECT id FROM Products') || sql.startsWith('SELECT id FROM Kits')) return [[]];
  if (failure && sql.startsWith('INSERT INTO ProjectImages')) throw new Error('simulated write failure');
  return [{ insertId: 7, affectedRows: 1 }];
 }
};
before(async () => {
 directory = await mkdtemp(path.join(tmpdir(), 'sunlink-project-tests-'));
 process.env.UPLOAD_PATH = directory;
 const { promisePool } = await import('../config/db.js'); pool = promisePool;
 originalQuery = pool.query; originalGetConnection = pool.getConnection;
 pool.getConnection = async () => db;
 pool.query = async sql => sql.startsWith('SELECT * FROM Projects') ? [[]] : [{ affectedRows: 0 }];
 process.env.JWT_SECRET = 'project-tests-only';
 token = jwt.sign({ id: 1, role: 'admin' }, process.env.JWT_SECRET);
 const { default: routes } = await import('../routes/projects.js');
 const app = express(); app.use(express.json()); app.use('/api/projects', routes);
 app.use((e,req,res,next) => res.status(e.statusCode || 500).json({message:e.message}));
 server = app.listen(0, '127.0.0.1'); await new Promise(resolve => server.once('listening',resolve));
 base = `http://127.0.0.1:${server.address().port}/api/projects`;
});
after(async () => {
 if (server) await new Promise(resolve => server.close(resolve));
 if (pool) { pool.query=originalQuery; pool.getConnection=originalGetConnection; await pool.end(); }
 if (directory) await rm(directory,{recursive:true,force:true});
});
function payload(overrides={}, images=true) {
 const data = new FormData();
 for (const [key,value] of Object.entries({title:'School Solar',category:'Solar installation',application_sector:'Education',description:'Reliable power for classrooms',location_name:'Juba',latitude:'4.85',longitude:'31.6',...overrides})) data.append(key,value);
 if(images) {
  const png = new Blob([Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jY9kAAAAASUVORK5CYII=','base64')],{type:'image/png'});
  data.append('image',png,'main.png'); data.append('gallery_images',png,'gallery.png');
 }
 return data;
}
function write(data, method='POST', suffix='') { return fetch(base+suffix,{method,headers:{Authorization:`Bearer ${token}`},body:data}); }
test('public empty list and missing project are handled',async()=>{
 assert.deepEqual((await (await fetch(base)).json()).data,[]);
 assert.equal((await fetch(base+'/999')).status,404);
});
test('writes require authentication',async()=>{
 for(const method of ['POST','PUT','DELETE']) assert.equal((await fetch(base+(method==='POST'?'':'/7'),{method})).status,401);
});
test('invalid coordinates and malformed links are rejected',async()=>{
 assert.equal((await write(payload({latitude:'91'}))).status,400);
 assert.equal((await write(payload({longitude:''}))).status,400);
 assert.equal((await write(payload({product_ids:'["invalid"]'}))).status,400);
 assert.deepEqual(await readdir(path.join(directory,'projects')),[]);
});
test('main and gallery images are required',async()=>{
 assert.equal((await write(payload({},false))).status,400);
 const data=payload(); data.delete('gallery_images');
 assert.equal((await write(data)).status,400);
});
test('successful creation commits project and gallery together',async()=>{
 calls=[];
 const response=await write(payload());
 assert.equal(response.status,201); assert.equal((await response.json()).data.id,7);
 assert.ok(calls.some(s=>s.startsWith('INSERT INTO Projects')));
 assert.ok(calls.some(s=>s.startsWith('INSERT INTO ProjectImages')));
 assert.ok(calls.includes('commit')); assert.ok(!calls.includes('rollback'));
});
test('editing can retain existing main and gallery images',async()=>{
 calls=[];
 const response=await write(payload({retained_image_ids:'[9]'},false),'PUT','/7');
 assert.equal(response.status,200); assert.ok(calls.includes('commit'));
 const invalid=await write(payload({retained_image_ids:'[999]'},false),'PUT','/7');
 assert.equal(invalid.status,400);
});
test('nonexistent product links roll back',async()=>{
 calls=[];
 assert.equal((await write(payload({product_ids:'[999]'}))).status,400);
 assert.ok(calls.includes('rollback'));
});
test('a gallery write failure rolls back and removes new uploads',async()=>{
 const beforeFiles=await readdir(path.join(directory,'projects')); calls=[]; failure=true;
 try { assert.equal((await write(payload())).status,500); } finally { failure=false; }
 assert.ok(calls.includes('rollback')); assert.ok(!calls.includes('commit'));
 assert.deepEqual(await readdir(path.join(directory,'projects')),beforeFiles);
});

test('only predefined home page sectors can be saved', async () => {
 const { applicationSectors } = await import('../config/applicationSectors.js');
 for (const sector of applicationSectors) {
  assert.equal((await write(payload({ application_sector: sector }))).status, 201, sector);
 }
 for (const method of ['POST', 'PUT']) {
  assert.equal((await write(payload({ application_sector: 'Custom sector' }), method, method === 'PUT' ? '/7' : '')).status, 400);
 }
});
