import { getCaseStudy } from '@/lib/contentful';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import Image from 'next/image';
import { notFound } from 'next/navigation';

export default async function CaseStudy({ params }: { params: { slug: string } }) {
  const study = await getCaseStudy(params.slug);

  if (!study) {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="relative h-[500px] mb-8">
        <Image
          src={`https:${study.fields.featuredImage.fields.file.url}`}
          alt={study.fields.title}
          fill
          className="object-cover rounded-lg"
        />
      </div>

      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-4">{study.fields.title}</h1>
        <div className="flex items-center text-gray-600 mb-4">
          <span className="font-medium">{study.fields.clientName}</span>
          <span className="mx-2">•</span>
          <span>{study.fields.industry}</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600">{study.fields.metrics.metric1}</div>
          <div className="text-sm text-gray-600">Metric 1</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600">{study.fields.metrics.metric2}</div>
          <div className="text-sm text-gray-600">Metric 2</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600">{study.fields.metrics.metric3}</div>
          <div className="text-sm text-gray-600">Metric 3</div>
        </div>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">The Challenge</h2>
        <p className="text-gray-600">{study.fields.challengeDescription}</p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Our Solution</h2>
        <div className="prose prose-lg max-w-none">
          {documentToReactComponents(study.fields.solution)}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Results</h2>
        <div className="prose prose-lg max-w-none">
          {documentToReactComponents(study.fields.results)}
        </div>
      </section>

      {study.fields.testimonial && (
        <section className="bg-gray-50 rounded-lg p-8">
          <blockquote className="text-xl italic text-gray-700">
            "{study.fields.testimonial}"
          </blockquote>
          <div className="mt-4 text-gray-600">
            - {study.fields.clientName}
          </div>
        </section>
      )}
    </article>
  );
} 