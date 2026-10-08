import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  FiArrowRight,
  FiAward,
  FiBatteryCharging,
  FiCheckCircle,
  FiCpu,
  FiGlobe,
  FiLayers,
  FiMapPin,
  FiShield,
  FiSun,
  FiTool,
  FiTruck,
  FiZap,
} from 'react-icons/fi';
import aboutHeroBg from '../assets/about/bg.jpg';

const About = () => {
  const stats = [
    { value: '2010', label: 'Established' },
    { value: '2025', label: 'Reorganized for global growth' },
    { value: '2kWh-100MW+', label: 'System engineering range' },
    { value: '20 yrs', label: 'Project warranty focus' },
  ];

  const productLines = [
    'Solar panels',
    'Solar batteries',
    'Charge controllers',
    'Solar inverters',
    'Solar fans',
    'Solar light and fan packages',
    'Power systems',
    'Solar street lights',
    'Solar flood lights',
    'Solar water pumps',
    'Complete solar kits',
    'Green energy innovations',
  ];

  const applications = [
    {
      icon: FiMapPin,
      title: 'Remote and off-grid power',
      description:
        'Solar panels, batteries, inverters, controllers, and complete kits for communities, farms, clinics, mining sites, and field operations disconnected from regional utility grids.',
    },
    {
      icon: FiZap,
      title: 'Public and private solar lighting',
      description:
        'Solar street lights, flood lights, and area lighting for roads, estates, compounds, warehouses, parking sites, and public safety environments.',
    },
    {
      icon: FiShield,
      title: 'Solar light and fan packages',
      description:
        'Integrated solar lighting and fan product lines for homes, shops, classrooms, clinics, remote rooms, and small businesses that need practical comfort with low operating cost.',
    },
    {
      icon: FiBatteryCharging,
      title: 'Generator replacement and backup',
      description:
        'Modern solar and storage systems engineered to reduce fuel dependency, unstable output, and heavy generator operating costs.',
    },
    {
      icon: FiTool,
      title: 'Agriculture and water pumping',
      description:
        'Solar pumping and agri-solar systems for irrigation, boreholes, livestock support, water storage, and remote farm productivity.',
    },
    {
      icon: FiCpu,
      title: 'Commercial charging and project sites',
      description:
        'Solar EV station concepts, commercial backup platforms, and project-scale systems for sites where uptime and operating control matter.',
    },
  ];

  const qualityPillars = [
    {
      icon: FiAward,
      title: 'Certified enterprise standards',
      description:
        'Positioned as a National High-Tech Enterprise with production, sales, and R&D capabilities across core solar categories.',
    },
    {
      icon: FiCpu,
      title: 'Engineering-led configuration',
      description:
        'Systems can be tailored from compact residential setups through large commercial and utility-grade generation platforms.',
    },
    {
      icon: FiCheckCircle,
      title: 'Specification discipline',
      description:
        'Product selection is built around practical performance, clear component matching, and dependable long-term operation.',
    },
  ];

  const operations = [
    {
      title: 'High-volume finished stock warehouse',
      description: 'Private-mould inventory prepared for global deployment.',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=900',
    },
    {
      title: 'Technical briefings and R&D center',
      description: 'Seasonal product optimization and engineering sessions.',
      image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=900',
    },
    {
      title: 'Solar generation and storage testing',
      description: 'High-efficiency cell diagnostics and validation.',
      image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=900',
    },
  ];

  return (
    <>
      <Helmet>
        <title>About Sunlink Power - Corporate Profile</title>
        <meta
          name="description"
          content="Sunlink Power is a certified solar energy company established in 2010, delivering solar panels, batteries, inverters, lighting, pumps, and complete clean energy systems."
        />
      </Helmet>

      <div className="min-h-screen bg-white text-gray-900">
        <section className="relative overflow-hidden bg-gray-950 text-white">
          <div className="absolute inset-0">
            <img
              src={aboutHeroBg}
              alt=""
              className="h-full w-full object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-950/75 via-gray-950/55 to-gray-950/20" />
          </div>

          <div className="relative container-custom py-24 md:py-32">
            <div className="max-w-4xl">
              <div className="mb-6 inline-flex items-center gap-2 border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-wide backdrop-blur">
                <FiSun className="h-4 w-4 text-primary-300" />
                Corporate Company Profile
              </div>
              <h1 className="max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
                Green energy systems built for demanding real-world markets.
              </h1>
              <p className="mt-7 max-w-3xl text-lg leading-8 text-gray-200 md:text-xl">
                Sunlink Power develops and supplies solar batteries, panels, inverters,
                charge controllers, solar lights, solar fans, light-and-fan packages, water pumps, complete kits, and
                integrated energy systems for communities, businesses, and industries worldwide.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link to="/browse" className="btn btn-primary">
                  Explore Products
                  <FiArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  to="/contact"
                  className="btn border border-white/25 bg-white/10 text-white hover:bg-white hover:text-gray-950"
                >
                  Talk to Our Team
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-gray-200 bg-white">
          <div className="container-custom">
            <div className="grid grid-cols-2 gap-px overflow-hidden bg-gray-200 md:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-white px-5 py-8 text-center">
                  <div className="text-3xl font-bold text-primary-600 md:text-4xl">{stat.value}</div>
                  <div className="mt-2 text-sm font-medium text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container-custom">
            <div className="grid gap-12 lg:grid-cols-[1fr_0.85fr] lg:items-start">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-primary-600">Corporate Overview</p>
                <h2 className="mt-4 max-w-3xl text-3xl font-bold leading-tight text-gray-950 md:text-5xl">
                  From specialized manufacturing to scalable clean-energy deployment.
                </h2>
                <div className="mt-8 space-y-6 text-lg leading-8 text-gray-600">
                  <p>
                    Established in 2010 and newly reorganized in 2025, Sunlink Power is
                    positioned as a certified National High-Tech Enterprise focused on
                    production, sales, research, and development across the solar energy sector.
                  </p>
                  <p>
                    The company supports project needs ranging from small 2kWh residential
                    energy setups to utility-grade generation exceeding 100 megawatts. Our
                    operating philosophy is practical: professional engineering, complete product
                    matching, and reliable customer service from planning through deployment.
                  </p>
                </div>
              </div>

              <div className="border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-950">Core Product Portfolio</h3>
                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  {productLines.map((line) => (
                    <div key={line} className="flex items-center gap-3 border border-gray-100 bg-gray-50 px-4 py-3">
                      <FiCheckCircle className="h-5 w-5 shrink-0 text-primary-500" />
                      <span className="text-sm font-semibold text-gray-700">{line}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-white">
          <div className="container-custom">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-wide text-primary-600">Practical Solutions</p>
              <h2 className="mt-4 text-3xl font-bold leading-tight text-gray-950 md:text-5xl">
                Designed for markets where power reliability directly affects progress.
              </h2>
              <p className="mt-7 text-lg leading-8 text-gray-600">
                Sunlink Power systems are configured to replace fragile or costly traditional
                infrastructure and provide direct relief in the conditions our customers face every day.
                The catalog range supports lighting, fans, cooling, pumping, charging, storage, and
                full power backup use cases.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {applications.map((item) => (
                <div key={item.title} className="border border-gray-200 bg-white p-6 shadow-sm transition hover:border-primary-200 hover:shadow-md">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center bg-primary-50 text-primary-600">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-950">{item.title}</h3>
                  <p className="mt-3 leading-7 text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-gray-950 text-white">
          <div className="container-custom">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1fr] lg:items-center">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-primary-300">Mission and Vision</p>
                <h2 className="mt-4 text-3xl font-bold leading-tight md:text-5xl">
                  Power your dreams with accessible, efficient, and reliable renewable energy.
                </h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="border border-white/10 bg-white/5 p-6">
                  <FiGlobe className="mb-6 h-8 w-8 text-primary-300" />
                  <h3 className="text-xl font-bold">Our Mission</h3>
                  <p className="mt-5 leading-7 text-gray-300">
                    Make clean renewable energy accessible, efficient, and dependable for
                    communities, businesses, and industries across global markets.
                  </p>
                </div>
                <div className="border border-white/10 bg-white/5 p-6">
                  <FiLayers className="mb-6 h-8 w-8 text-secondary-300" />
                  <h3 className="text-xl font-bold">Our Vision</h3>
                  <p className="mt-5 leading-7 text-gray-300">
                    Become a trusted engineering and supply partner for scalable solar generation,
                    storage, lighting, pumping, and backup power systems.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container-custom">
            <div className="grid gap-12 lg:grid-cols-[0.85fr_1fr]">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-primary-600">Quality Assurance</p>
                <h2 className="mt-4 text-3xl font-bold leading-tight text-gray-950 md:text-5xl">
                  Built around long-term system confidence.
                </h2>
                <p className="mt-7 text-lg leading-8 text-gray-600">
                  The company profile emphasizes quality assurance and a 20-year project warranty
                  approach. For customers, that means component choices, system design, and support
                  practices are aligned around durable field performance.
                </p>
              </div>

              <div className="grid gap-5">
                {qualityPillars.map((pillar) => (
                  <div key={pillar.title} className="flex gap-5 border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-primary-50 text-primary-600">
                      <pillar.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-950">{pillar.title}</h3>
                      <p className="mt-4 leading-7 text-gray-600">{pillar.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* <section className="py-16 md:py-24 bg-white">
          <div className="container-custom">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div className="max-w-3xl">
                <p className="text-sm font-bold uppercase tracking-wide text-primary-600">Operations</p>
                <h2 className="mt-4 text-3xl font-bold leading-tight text-gray-950 md:text-5xl">
                  Manufacturing, stock readiness, and technical validation in one operating system.
                </h2>
              </div>
              <div className="flex items-center gap-3 text-sm font-semibold text-gray-500">
                <FiTruck className="h-5 w-5 text-primary-500" />
                Prepared for global deployment
              </div>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {operations.map((item) => (
                <div key={item.title} className="group overflow-hidden border border-gray-200 bg-white shadow-sm">
                  <div className="h-56 overflow-hidden bg-gray-100">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-950">{item.title}</h3>
                    <p className="mt-5 leading-7 text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section> */}

        <section className="bg-primary-600 py-16 md:py-20 text-white">
          <div className="container-custom">
            <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-white/80">Partner with Sunlink Power</p>
                <h2 className="mt-4 text-3xl font-bold md:text-4xl">
                  Need a product supplier or engineered solar system for your market?
                </h2>
                <p className="mt-6 max-w-3xl text-lg leading-8 text-white/90">
                  Speak with our team about solar kits, batteries, inverters, lighting,
                  water pumps, and project-scale energy platforms.
                </p>
              </div>
              <Link to="/contact" className="btn bg-white text-primary-700 hover:bg-gray-100">
                Start a Conversation
                <FiTool className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default About;
