import Link from 'next/link';

export default function ServicesPage() {
  return (
    <div className="container mx-auto px-4">
      {/* Hero Section */}
      <section className="py-16 text-center">
        <h1 className="text-4xl font-bold mb-8">
          <span className="text-amber-500">Our Services</span>
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Comprehensive digital solutions to help your business thrive in the modern age.
        </p>
      </section>

      {/* Main Services */}
      <section className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Web Development */}
          <div className="bg-gray-800/50 p-8 rounded-lg">
            <div className="text-amber-500 text-4xl mb-6">
              <code>&lt;/&gt;</code>
            </div>
            <h2 className="text-2xl font-bold mb-4">Web Development</h2>
            <p className="text-gray-300 mb-6">
              Custom websites and web applications built with the latest technologies.
            </p>
            <ul className="space-y-3 text-gray-300 mb-8">
              <li>• Custom Website Development</li>
              <li>• E-commerce Solutions</li>
              <li>• Web Application Development</li>
              <li>• CMS Integration</li>
              <li>• Website Maintenance</li>
            </ul>
            <Link 
              href="/contact"
              className="inline-block bg-amber-500 text-black px-6 py-2 rounded-full hover:bg-amber-600 transition-colors"
            >
              Get Started
            </Link>
          </div>

          {/* SEO Optimization */}
          <div className="bg-gray-800/50 p-8 rounded-lg">
            <div className="text-amber-500 text-4xl mb-6">🔍</div>
            <h2 className="text-2xl font-bold mb-4">SEO Optimization</h2>
            <p className="text-gray-300 mb-6">
              Improve your search rankings and drive organic traffic to your website.
            </p>
            <ul className="space-y-3 text-gray-300 mb-8">
              <li>• Keyword Research & Strategy</li>
              <li>• On-Page SEO Optimization</li>
              <li>• Technical SEO Audits</li>
              <li>• Content Strategy</li>
              <li>• Local SEO</li>
            </ul>
            <Link 
              href="/contact"
              className="inline-block bg-amber-500 text-black px-6 py-2 rounded-full hover:bg-amber-600 transition-colors"
            >
              Get Started
            </Link>
          </div>

          {/* Digital Marketing */}
          <div className="bg-gray-800/50 p-8 rounded-lg">
            <div className="text-amber-500 text-4xl mb-6">📢</div>
            <h2 className="text-2xl font-bold mb-4">Digital Marketing</h2>
            <p className="text-gray-300 mb-6">
              Comprehensive digital marketing strategies to grow your online presence.
            </p>
            <ul className="space-y-3 text-gray-300 mb-8">
              <li>• Social Media Marketing</li>
              <li>• Content Marketing</li>
              <li>• Email Marketing</li>
              <li>• PPC Advertising</li>
              <li>• Analytics & Reporting</li>
            </ul>
            <Link 
              href="/contact"
              className="inline-block bg-amber-500 text-black px-6 py-2 rounded-full hover:bg-amber-600 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16">
        <h2 className="text-3xl font-bold mb-12 text-center">Our Process</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-amber-500 mb-4">01</div>
            <h3 className="text-xl font-bold mb-2">Discovery</h3>
            <p className="text-gray-300">Understanding your business goals and requirements</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-amber-500 mb-4">02</div>
            <h3 className="text-xl font-bold mb-2">Strategy</h3>
            <p className="text-gray-300">Developing a tailored plan for your success</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-amber-500 mb-4">03</div>
            <h3 className="text-xl font-bold mb-2">Implementation</h3>
            <p className="text-gray-300">Executing the strategy with precision</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-amber-500 mb-4">04</div>
            <h3 className="text-xl font-bold mb-2">Optimization</h3>
            <p className="text-gray-300">Continuous improvement and refinement</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-800/50 rounded-lg text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          Let's discuss how we can help your business grow with our digital solutions.
        </p>
        <Link 
          href="/contact"
          className="inline-block bg-amber-500 text-black px-8 py-3 rounded-full hover:bg-amber-600 transition-colors"
        >
          Schedule a Consultation
        </Link>
      </section>
    </div>
  );
} 