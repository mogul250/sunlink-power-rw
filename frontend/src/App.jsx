import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';

// Layout Components
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

// Pages
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import ProjectList from './pages/admin/ProjectList';
import ProjectForm from './pages/admin/ProjectForm';
import Home from './pages/Home';
import Browse from './pages/Browse';
import CategoryDetail from './pages/CategoryDetail';
import ProductDetail from './pages/ProductDetail';
import KitDetail from './pages/KitDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import Kits from './pages/Kits';
import Downloads from './pages/Downloads';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import ProductForm from './pages/admin/ProductForm';
import ProductList from './pages/admin/ProductList';
import CategoryList from './pages/admin/CategoryList';
import CategoryForm from './pages/admin/CategoryForm';
import KitList from './pages/admin/KitList';
import KitForm from './pages/admin/KitForm';
import TestimonialQueue from './pages/admin/TestimonialQueue';
import Dashboard from './pages/admin/Dashboard';
import ResourceManager from './pages/admin/ResourceManager';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <Helmet>
          <title>Sunlink Power - Premium Solar Solutions for Africa</title>
          <meta name="description" content="Leading supplier of high-quality solar panels, inverters, batteries, and complete solar systems. Powering homes and businesses across Africa with reliable renewable energy." />
          
          {/* Open Graph / Facebook / WhatsApp */}
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://www.sunlink-power.com/" />
          <meta property="og:title" content="Sunlink Power - Premium Solar Solutions for Africa" />
          <meta property="og:description" content="Leading supplier of high-quality solar panels, inverters, batteries, and complete solar systems. Powering homes and businesses across Africa with reliable renewable energy." />
          
          {/* THE CULPRIT: The Image Link */}
          {/* Use a direct link to a high-quality PNG/JPG on your server */}
          <meta property="og:image" content="https://sunlink-power.com/logo.png" />
          <meta property="og:image:type" content="image/png" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />

          {/* Twitter */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Sunlink Power" />
          <meta name="twitter:image" content="https://sunlink-power.com/logo.png" />
        </Helmet>
        <Routes>
          {/* Admin Login - Standing alone */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* Protected Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<ProductList />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/edit/:id" element={<ProductForm />} />
            <Route path="categories" element={<CategoryList />} />
            <Route path="categories/new" element={<CategoryForm />} />
            <Route path="categories/edit/:id" element={<CategoryForm />} />
            <Route path="kits" element={<KitList />} />
            <Route path="kits/new" element={<KitForm />} />
            <Route path="kits/edit/:id" element={<KitForm />} />
            <Route path="testimonials" element={<TestimonialQueue />} />
            <Route path="resources" element={<ResourceManager />} />
            <Route path="projects" element={<ProjectList />} />
            <Route path="projects/new" element={<ProjectForm />} />
            <Route path="projects/edit/:id" element={<ProjectForm />} />
          </Route>

          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/project/:id" element={<ProjectDetail />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/category/:slug" element={<CategoryDetail />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/kits" element={<Kits />} />
            <Route path="/kit/:slug" element={<KitDetail />} />
            <Route path="/resources" element={<Downloads />} />
            <Route path="/downloads" element={<Downloads />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          {/* Global Catch-all for 404s */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;
