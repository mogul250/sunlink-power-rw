# Projects

Admins can create, edit and delete projects at `/admin/projects`. Saved projects appear in the home page's �Real Projects. Real Impact.� section. Each project opens at `/project/:id` with its gallery, Google map and optional product/kit links.

A project requires a title, category, application sector, description, location name, valid latitude/longitude, one main image and 1�10 gallery images. Images accept JPG, PNG, WebP or GIF, up to 10MB per file. Existing images can be retained when editing.

## Setup

The backend creates the four project tables on startup, after the existing resource tables. The database user needs CREATE permission. For deployments where migrations are applied separately, run `database/migration_add_projects.sql` before restarting the backend. Existing Products and Kits tables must already exist.

Set `VITE_GOOGLE_MAPS_API_KEY` in `frontend/.env.local`, enable Maps JavaScript API for the key's Google Cloud project and restrict the key to your website's HTTP referrers. Restart Vite after adding it, or rebuild the production frontend. See https://developers.google.com/maps/documentation/javascript/get-api-key . Never use an unrestricted server API key here: Vite values are visible in the browser.

The admin map lets you pan/zoom and click a location to save coordinates. Without a configured key, the form shows a setup message and allows manual coordinates. Public project maps use an embedded Google Maps location, with an external map link.

The home page overview uses Leaflet with OpenStreetMap tiles and does not require a Google API key. Pins show project previews with links to the detail pages, and the map automatically fits all valid project coordinates. Attribution remains visible on the map. No sample projects are inserted.

## Validation

Run `node --test tests/projects.test.js` from `backend` for API checks using a simulated database and temporary upload directory, and `npm run build` from `frontend` for the production build. These tests do not connect to or modify your configured database.
