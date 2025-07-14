import { getCaseStudies } from '@/lib/contentful';
import Image from 'next/image';
import Link from 'next/link';

export default async function CaseStudiesPage() {
  const caseStudies = await getCaseStudies();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">Case Studies</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {caseStudies.map((study: any) => (
          <article key={study.sys.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative h-64">
              <Image
                src={`https:${study.fields.featuredImage.fields.file.url}`}
                alt={study.fields.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-2">{study.fields.title}</h2>
              <div className="flex items-center text-gray-600 mb-4">
                <span className="font-medium">{study.fields.clientName}</span>
                <span className="mx-2">•</span>
                <span>{study.fields.industry}</span>
              </div>
              <p className="text-gray-600 mb-4">{study.fields.challengeDescription}</p>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{study.fields.metrics.metric1}</div>
                  <div className="text-sm text-gray-600">Metric 1</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{study.fields.metrics.metric2}</div>
                  <div className="text-sm text-gray-600">Metric 2</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{study.fields.metrics.metric3}</div>
                  <div className="text-sm text-gray-600">Metric 3</div>
                </div>
              </div>
              <Link
                href={`/case-studies/${study.fields.slug}`}
                className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
              >
                View Case Study
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
} 