import ProjectsSection from './ProjectsSection';
import { Link } from 'react-router-dom';
import {
  FiArrowRight,
  FiCpu,
  FiGlobe,
  FiHeadphones,
  FiShield,
  FiSliders,
  FiTool,
} from 'react-icons/fi';

const TrustSection = () => {
  const strengths = [
    {
      icon: FiCpu,
      title: 'Advanced Technology',
      description: 'High-efficiency solar energy products with intelligent control options.',
    },
    {
      icon: FiShield,
      title: 'Premium Quality',
      description: 'Carefully selected components built for stable long-term use.',
    },
    {
      icon: FiSliders,
      title: 'Custom Solutions',
      description: 'Solar systems matched to project size, site needs, and budgets.',
    },
    {
      icon: FiTool,
      title: 'Expert Engineering',
      description: 'Practical product guidance, installation planning, and technical support.',
    },
    {
      icon: FiGlobe,
      title: 'Global Presence',
      description: 'Serving distributors, project teams, and partners across markets.',
    },
    {
      icon: FiHeadphones,
      title: 'After-Sales Support',
      description: 'Clear assistance for product selection, maintenance, and follow-up.',
    },
  ];

  return (
    <>
      <ProjectsSection />

      <section className="bg-[#094fa4] py-14 text-white md:py-20">
        <div className="container-custom">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-[#ffd166]">Why Choose Sunlink Power</p>
              <h2 className="mt-4 text-3xl font-bold leading-tight md:text-4xl">
                Engineering Excellence. Powering Trust.
              </h2>
              <p className="mt-6 max-w-xl leading-8 text-white/80">
                Sunlink Power combines dependable product lines, practical configuration support,
                and quality-focused sourcing for homes, businesses, farms, and infrastructure projects.
              </p>
              <Link to="/about" className="mt-8 inline-flex items-center bg-white px-5 py-3 text-sm font-bold text-[#094fa4] transition hover:bg-[#ffd166] hover:text-[#072f61]">
                Learn More About Us
                <FiArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-px overflow-hidden border border-white/15 bg-white/15 sm:grid-cols-2 lg:grid-cols-3">
              {strengths.map((item) => (
                <div key={item.title} className="bg-[#073b7a]/70 p-6 backdrop-blur-sm">
                  <item.icon className="h-9 w-9 text-[#ffd166]" />
                  <h3 className="mt-5 text-lg font-bold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/75">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-[#094fa4] via-[#073b7a] to-[#061a33] py-10 text-white">
        <div className="container-custom">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="text-2xl font-bold md:text-3xl">Let&apos;s Build a Greener Future Together</h2>
              <p className="mt-3 max-w-2xl leading-7 text-white/80">
                Talk to our team about the right solar solution for your home, business, farm, or project.
              </p>
            </div>
            <Link to="/contact" className="inline-flex w-fit items-center bg-white px-5 py-3 text-sm font-bold text-[#094fa4] transition hover:bg-[#ffd166] hover:text-[#072f61]">
              Get a Free Consultation
              <FiArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

    </>
  );
};

export default TrustSection;
