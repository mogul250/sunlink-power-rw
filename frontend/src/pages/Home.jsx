import { Helmet } from 'react-helmet-async';
import FeaturedVideosSection from '../components/home/FeaturedVideosSection';
import Hero from '../components/home/Hero';
import CategoryGrid from '../components/home/CategoryGrid';
import ProductApplications from '../components/home/ProductApplications';
import TrustSection from '../components/home/TrustSection';

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Sunlink Power - Premium Solar Solutions for Africa</title>
        <meta
          name="description"
          content="Leading supplier of high-quality solar panels, inverters, batteries, and complete solar systems across Africa. Reliable, affordable renewable energy solutions."
        />
        <meta
          name="keywords"
          content="solar panels, solar power, inverters, batteries, solar kits, renewable energy, Africa, Kenya, Nigeria, Zimbabwe, Rwanda"
        />
      </Helmet>

      <div className="min-h-screen">
        <Hero />
        <FeaturedVideosSection />
        <CategoryGrid />
        <ProductApplications />
        <TrustSection />
      </div>
    </>
  );
};

export default Home;
