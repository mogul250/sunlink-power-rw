import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { applicationSectors } from '../../data/applicationSectors';

const ProductApplications = () => {

  return (
    <section className="bg-white py-14 md:py-20">
      <div className="container-custom">
        <div className="mx-auto mb-9 max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-wide text-primary-600">Product Applications</p>
          <h2 className="mt-3 text-3xl font-bold leading-tight text-gray-950 md:text-4xl">
            Smart solar solutions for every sector.
          </h2>
          <p className="mt-5 leading-8 text-gray-600">
            Based on Sunlink Power catalog lines, our products can be combined into complete
            solutions for homes, businesses, industries, farms, institutions, public spaces, and mobility projects.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {applicationSectors.map((application) => (
            <Link
              key={application.title}
              to={application.path}
              className="group overflow-hidden border border-gray-200 bg-white shadow-sm transition hover:border-primary-200 hover:shadow-md"
            >
              <div className="relative h-40 overflow-hidden bg-gray-100">
                <img
                  src={application.image}
                  alt={application.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-950">{application.title}</h3>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">{application.description}</p>
                <div className="mt-5 flex items-center text-sm font-bold text-primary-600">
                  View Solution
                  <FiArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductApplications;
