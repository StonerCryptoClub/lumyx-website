import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Blog from '@/components/Blog';
import CaseStudies from '@/components/CaseStudies';
import CalendlyIntegration from '@/components/CalendlyIntegration';
import SEO from '@/components/SEO';

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Lumyx Agency',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    logo: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
    description: 'Lumyx Agency provides cutting-edge digital solutions, web development, and digital marketing services.',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'US'
    },
    sameAs: [
      'https://twitter.com/lumyxagency',
      'https://www.linkedin.com/company/lumyx-agency',
      'https://www.instagram.com/lumyxagency'
    ]
  };

  return (
    <>
      <SEO
        title="Digital Marketing & Web Development Agency"
        description="Lumyx Agency provides cutting-edge digital solutions, web development, and digital marketing services to help businesses grow online."
        type="website"
        jsonLd={jsonLd}
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {/* Hero Section */}
        <section className="container mx-auto px-4 pt-20 pb-32 text-center">
          <h1 className="text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-amber-500 to-blue-500 bg-clip-text text-transparent">
              Transform Your Digital Presence
            </span>
          </h1>
          <p className="text-gray-300 text-xl mb-12 max-w-3xl mx-auto">
            Expert web development and digital marketing solutions to help your business grow online.
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              href="/contact"
              className="bg-amber-500 hover:bg-amber-600 text-black px-8 py-3 rounded-full font-semibold transition-colors"
            >
              Get Started
            </Link>
            <Link 
              href="#services"
              className="border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white px-8 py-3 rounded-full font-semibold transition-colors"
            >
              Our Services
            </Link>
          </div>
        </section>

        {/* About Us Section */}
        <section className="py-20 bg-gray-900/50">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-8">
              <span className="text-amber-500">About Us</span>
            </h2>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h3 className="text-2xl font-bold mb-6">Our Story</h3>
              <p className="text-gray-300">
                Founded in 2020, Lumyx Agency emerged from a vision to revolutionize digital marketing. 
                We combine data-driven insights with creative excellence to help brands achieve unprecedented growth.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-800/50 p-8 rounded-lg text-center">
                <div className="text-4xl font-bold text-amber-500 mb-2">100+</div>
                <div className="text-gray-300">Happy Clients</div>
              </div>
              <div className="bg-gray-800/50 p-8 rounded-lg text-center">
                <div className="text-4xl font-bold text-amber-500 mb-2">15+</div>
                <div className="text-gray-300">Countries Served</div>
              </div>
              <div className="bg-gray-800/50 p-8 rounded-lg text-center">
                <div className="text-4xl font-bold text-amber-500 mb-2">25+</div>
                <div className="text-gray-300">Industry Awards</div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16">
              <span className="text-amber-500">Our Values</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-gray-800/50 p-8 rounded-lg hover:bg-gray-700/50 transition-colors">
                <div className="text-amber-500 text-4xl mb-4">💡</div>
                <h3 className="text-xl font-bold mb-4">Innovation</h3>
                <p className="text-gray-300">
                  Constantly pushing boundaries with cutting-edge strategies and creative solutions.
                </p>
              </div>
              <div className="bg-gray-800/50 p-8 rounded-lg hover:bg-gray-700/50 transition-colors">
                <div className="text-amber-500 text-4xl mb-4">📈</div>
                <h3 className="text-xl font-bold mb-4">Results-Driven</h3>
                <p className="text-gray-300">
                  Focused on delivering measurable outcomes and sustainable growth.
                </p>
              </div>
              <div className="bg-gray-800/50 p-8 rounded-lg hover:bg-gray-700/50 transition-colors">
                <div className="text-amber-500 text-4xl mb-4">🤝</div>
                <h3 className="text-xl font-bold mb-4">Partnership</h3>
                <p className="text-gray-300">
                  Building lasting relationships through transparency and collaboration.
                </p>
              </div>
              <div className="bg-gray-800/50 p-8 rounded-lg hover:bg-gray-700/50 transition-colors">
                <div className="text-amber-500 text-4xl mb-4">🛡️</div>
                <h3 className="text-xl font-bold mb-4">Excellence</h3>
                <p className="text-gray-300">
                  Maintaining the highest standards in every aspect of our work.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-20 bg-gray-900/50">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16">
              <span className="text-amber-500">Our Services</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-800/50 p-8 rounded-lg hover:bg-gray-700/50 transition-colors">
                <div className="text-amber-500 text-4xl mb-4">
                  <code>&lt;/&gt;</code>
                </div>
                <h3 className="text-2xl font-bold mb-4">Web Development</h3>
                <p className="text-gray-300">
                  Custom websites and web applications built with the latest technologies.
                </p>
              </div>

              <div className="bg-gray-800/50 p-8 rounded-lg hover:bg-gray-700/50 transition-colors">
                <div className="text-amber-500 text-4xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold mb-4">SEO Optimization</h3>
                <p className="text-gray-300">
                  Improve your search rankings and drive organic traffic to your website.
                </p>
              </div>

              <div className="bg-gray-800/50 p-8 rounded-lg hover:bg-gray-700/50 transition-colors">
                <div className="text-amber-500 text-4xl mb-4">📢</div>
                <h3 className="text-2xl font-bold mb-4">Digital Marketing</h3>
                <p className="text-gray-300">
                  Comprehensive digital marketing strategies to grow your online presence.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Case Studies Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16">
              <span className="text-amber-500">Our Case Studies</span>
            </h2>
            <CaseStudies />
          </div>
        </section>

        {/* Blog Section */}
        <section className="py-20 bg-gray-900/50">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16">
              <span className="text-amber-500">Latest Blog Posts</span>
            </h2>
            <Blog />
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16">
              <span className="text-amber-500">Schedule a Strategy Call</span>
            </h2>
            <CalendlyIntegration />
          </div>
        </section>
      </div>
    </>
  );
} 