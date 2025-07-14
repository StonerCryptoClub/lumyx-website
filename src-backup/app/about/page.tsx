export default function AboutPage() {
  return (
    <div className="container mx-auto px-4">
      {/* Hero Section */}
      <section className="py-16 text-center">
        <h1 className="text-4xl font-bold mb-8">
          <span className="text-amber-500">About Lumyx Agency</span>
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          We're a team of digital innovators passionate about helping businesses thrive in the digital age.
        </p>
      </section>

      {/* Our Story Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Story</h2>
          <div className="prose prose-invert mx-auto">
            <p className="text-gray-300">
              Founded in 2020, Lumyx Agency emerged from a vision to revolutionize digital marketing. 
              We combine data-driven insights with creative excellence to help brands achieve unprecedented growth.
              Our journey began with a simple mission: to provide businesses with the tools and strategies 
              they need to succeed in an increasingly digital world.
            </p>
            <p className="text-gray-300 mt-4">
              Today, we're proud to have helped hundreds of businesses transform their digital presence 
              and achieve remarkable growth. Our team of experts brings together diverse skills and 
              experiences, united by a common goal of delivering excellence in everything we do.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-800/50 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-4xl font-bold text-amber-500 mb-2">100+</div>
            <div className="text-gray-300">Happy Clients</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-amber-500 mb-2">15+</div>
            <div className="text-gray-300">Countries Served</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-amber-500 mb-2">25+</div>
            <div className="text-gray-300">Industry Awards</div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <h2 className="text-3xl font-bold mb-12 text-center">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-gray-800/50 p-8 rounded-lg">
            <div className="text-amber-500 text-4xl mb-4">💡</div>
            <h3 className="text-xl font-bold mb-4">Innovation</h3>
            <p className="text-gray-300">
              Constantly pushing boundaries with cutting-edge strategies and creative solutions.
            </p>
          </div>
          <div className="bg-gray-800/50 p-8 rounded-lg">
            <div className="text-amber-500 text-4xl mb-4">📈</div>
            <h3 className="text-xl font-bold mb-4">Results-Driven</h3>
            <p className="text-gray-300">
              Focused on delivering measurable outcomes and sustainable growth.
            </p>
          </div>
          <div className="bg-gray-800/50 p-8 rounded-lg">
            <div className="text-amber-500 text-4xl mb-4">🤝</div>
            <h3 className="text-xl font-bold mb-4">Partnership</h3>
            <p className="text-gray-300">
              Building lasting relationships through transparency and collaboration.
            </p>
          </div>
          <div className="bg-gray-800/50 p-8 rounded-lg">
            <div className="text-amber-500 text-4xl mb-4">🛡️</div>
            <h3 className="text-xl font-bold mb-4">Excellence</h3>
            <p className="text-gray-300">
              Maintaining the highest standards in every aspect of our work.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <h2 className="text-3xl font-bold mb-12 text-center">Our Leadership</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-32 h-32 bg-gray-700 rounded-full mx-auto mb-4"></div>
            <h3 className="text-xl font-bold mb-2">John Smith</h3>
            <p className="text-gray-300">CEO & Founder</p>
          </div>
          <div className="text-center">
            <div className="w-32 h-32 bg-gray-700 rounded-full mx-auto mb-4"></div>
            <h3 className="text-xl font-bold mb-2">Sarah Johnson</h3>
            <p className="text-gray-300">Creative Director</p>
          </div>
          <div className="text-center">
            <div className="w-32 h-32 bg-gray-700 rounded-full mx-auto mb-4"></div>
            <h3 className="text-xl font-bold mb-2">Michael Chen</h3>
            <p className="text-gray-300">Technical Lead</p>
          </div>
        </div>
      </section>
    </div>
  );
} 