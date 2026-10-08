import { Helmet } from 'react-helmet-async';
import { FiClock, FiMail, FiMapPin, FiMessageSquare, FiPhone, FiSend } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import TestimonialForm from '../components/common/TestimonialForm';

const Contact = () => {
  const contactChannels = [
    {
      icon: FiPhone,
      title: 'Phone',
      detail: '+250 788 894 329',
      href: 'tel:+250788894329',
    },
    {
      icon: FiMail,
      title: 'Email',
      detail: 'info@sunlink-power.com',
      href: 'mailto:info@sunlink-power.com',
    },
    {
      icon: FaWhatsapp,
      title: 'WhatsApp',
      detail: 'Discuss products, pricing, and shipment planning',
      href: 'https://wa.me/+250781676857?text=Hi%20Sunlink%2C%20I%20would%20like%20to%20discuss%20a%20solar%20energy%20inquiry',
    },
  ];

  const inquiryTypes = [
    'Product quotation',
    'Distributor partnership',
    'Solar kit configuration',
    'Project-scale system',
    'Shipping and logistics',
    'Technical documentation',
  ];

  return (
    <>
      <Helmet>
        <title>Contact Sunlink Power - Solar Product and Project Inquiries</title>
        <meta
          name="description"
          content="Contact Sunlink Power for solar product quotations, distributor partnerships, solar kits, batteries, inverters, lighting, pumps, and project-scale energy systems."
        />
      </Helmet>

      <div className="min-h-screen bg-white text-gray-900">
        <section className="bg-gray-950 text-white">
          <div className="container-custom py-20 md:py-24">
            <div className="grid gap-10 lg:grid-cols-[1fr_0.75fr] lg:items-end">
              <div className="max-w-4xl">
                <p className="text-sm font-bold uppercase tracking-wide text-primary-300">Contact Sunlink Power</p>
                <h1 className="mt-4 text-4xl font-bold leading-tight md:text-6xl">
                  Speak with our team about solar supply, system design, and project support.
                </h1>
                <p className="mt-7 max-w-3xl text-lg leading-8 text-gray-300">
                  Use the form or direct channels below to discuss product specifications,
                  quotation needs, distributor opportunities, shipping coordination, or a
                  complete solar system requirement.
                </p>
              </div>

              <div className="border border-white/10 bg-white/5 p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-primary-500 text-white">
                    <FiClock className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Business Hours</h2>
                    <p className="mt-2 leading-7 text-gray-300">Monday to Saturday</p>
                    <p className="text-gray-300">9:00 AM - 6:00 PM, China Standard Time</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-gray-200 bg-gray-50 py-12 md:py-16">
          <div className="container-custom">
            <div className="grid gap-5 md:grid-cols-3">
              {contactChannels.map((channel) => (
                <a
                  key={channel.title}
                  href={channel.href}
                  target={channel.title === 'WhatsApp' ? '_blank' : undefined}
                  rel={channel.title === 'WhatsApp' ? 'noopener noreferrer' : undefined}
                  className="group border border-gray-200 bg-white p-6 shadow-sm transition hover:border-primary-200 hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-primary-100 bg-primary-50 text-primary-700 transition group-hover:border-primary-200 group-hover:bg-primary-100">
                      <channel.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-950">{channel.title}</h2>
                      <p className="mt-3 leading-7 text-gray-600">{channel.detail}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container-custom">
            <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-primary-600">Inquiry Details</p>
                <h2 className="mt-4 text-3xl font-bold leading-tight text-gray-950 md:text-5xl">
                  Send a clear request so we can respond with the right technical and commercial information.
                </h2>
                <p className="mt-7 text-lg leading-8 text-gray-600">
                  For faster response, include the product category, estimated quantity, destination
                  country, preferred shipping route, and whether you need product-only supply or a
                  complete configured system.
                </p>

                <div className="mt-10 border border-gray-200 bg-gray-50 p-6">
                  <h3 className="text-lg font-bold text-gray-950">Common Inquiry Types</h3>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {inquiryTypes.map((type) => (
                      <div key={type} className="flex items-center gap-3 text-sm font-semibold text-gray-700">
                        <FiMessageSquare className="h-4 w-4 shrink-0 text-primary-600" />
                        {type}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 border border-gray-200 bg-white p-6">
                  <div className="flex items-start gap-4">
                    <FiMapPin className="mt-1 h-6 w-6 shrink-0 text-primary-600" />
                    <div>
                      <h3 className="text-lg font-bold text-gray-950">Guangzhou Office</h3>
                      <p className="mt-3 leading-7 text-gray-600">
                        The Garden Hotel office 735, 7Floor, Building 5 and 6, No.368
                        Huanshi East Road, Yuexiu District, Guangzhou.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 bg-white p-6 shadow-sm md:p-8">
                <div className="mb-8">
                  <p className="text-sm font-bold uppercase tracking-wide text-primary-600">Message Form</p>
                  <h2 className="mt-3 text-2xl font-bold text-gray-950">Request a quotation or consultation</h2>
                </div>

                <form className="space-y-6">
                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label className="label">First Name *</label>
                      <input type="text" required className="input" placeholder="First name" />
                    </div>
                    <div>
                      <label className="label">Last Name *</label>
                      <input type="text" required className="input" placeholder="Last name" />
                    </div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label className="label">Email *</label>
                      <input type="email" required className="input" placeholder="name@company.com" />
                    </div>
                    <div>
                      <label className="label">Phone / WhatsApp</label>
                      <input type="tel" className="input" placeholder="+234 ..." />
                    </div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label className="label">Country *</label>
                      <select required className="input">
                        <option value="">Select country</option>
                        <option value="Kenya">Kenya</option>
                        <option value="Nigeria">Nigeria</option>
                        <option value="Zimbabwe">Zimbabwe</option>
                        <option value="Rwanda">Rwanda</option>
                        <option value="Tanzania">Tanzania</option>
                        <option value="South Africa">South Africa</option>
                        <option value="Zambia">Zambia</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="label">Inquiry Type</label>
                      <select className="input">
                        <option value="">Select inquiry type</option>
                        {inquiryTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="label">Message *</label>
                    <textarea
                      required
                      rows="6"
                      className="input resize-none"
                      placeholder="Tell us the product, quantity, destination country, and timeline."
                    />
                  </div>

                  <button type="submit" className="btn btn-primary w-full">
                    Send Inquiry
                    <FiSend className="ml-2 h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 border-y border-gray-200 bg-gray-50 pt-14 pb-20 md:mt-14 md:pt-16 md:pb-24">
          <div className="container-custom">
            <div className="grid gap-8 md:grid-cols-[0.7fr_1fr] md:items-center">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-primary-600">Customer Feedback</p>
                <h2 className="mt-4 text-3xl font-bold text-gray-950">Share a completed project experience</h2>
                <p className="mt-5 leading-8 text-gray-600">
                  If you have worked with Sunlink Power, submit your testimonial and project
                  details for review. Approved stories help future partners understand real outcomes.
                </p>
              </div>
              <div className="border border-gray-200 bg-white p-6 shadow-sm">
                <TestimonialForm />
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Contact;
