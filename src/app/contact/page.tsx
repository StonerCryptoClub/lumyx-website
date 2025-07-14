import CalendlyIntegration from '@/components/CalendlyIntegration';

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4">
      {/* Hero Section */}
      <section className="py-16 text-center">
        <h1 className="text-4xl font-bold mb-8">
          <span className="text-amber-500">Contact Us</span>
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Schedule a consultation or reach out to discuss your project.
        </p>
      </section>

      {/* Contact Information */}
      <section className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
          <div className="text-center">
            <div className="text-amber-500 text-4xl mb-4">📍</div>
            <h3 className="text-xl font-bold mb-2">Location</h3>
            <p className="text-gray-300">San Francisco, CA</p>
          </div>
          <div className="text-center">
            <div className="text-amber-500 text-4xl mb-4">📧</div>
            <h3 className="text-xl font-bold mb-2">Email</h3>
            <p className="text-gray-300">contact@lumyxagency.com</p>
          </div>
          <div className="text-center">
            <div className="text-amber-500 text-4xl mb-4">📱</div>
            <h3 className="text-xl font-bold mb-2">Phone</h3>
            <p className="text-gray-300">(555) 123-4567</p>
          </div>
        </div>
      </section>

      {/* Calendly Section */}
      <section className="py-16 bg-gray-800/50 rounded-lg">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Schedule a Consultation</h2>
          <CalendlyIntegration />
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Send Us a Message</h2>
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-gray-300 mb-2">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-amber-500 text-gray-300"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-300 mb-2">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-amber-500 text-gray-300"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-gray-300 mb-2">Message</label>
              <textarea
                id="message"
                name="message"
                rows={6}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-amber-500 text-gray-300"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-amber-500 text-black px-8 py-3 rounded-full hover:bg-amber-600 transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>
    </div>
  );
} 