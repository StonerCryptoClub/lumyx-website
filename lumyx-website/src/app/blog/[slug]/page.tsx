import { getBlogPost } from '@/lib/contentful';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import Image from 'next/image';
import { notFound } from 'next/navigation';

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="relative h-[400px] mb-8">
        <Image
          src={`https:${post.fields.featuredImage.fields.file.url}`}
          alt={post.fields.title}
          fill
          className="object-cover rounded-lg"
        />
      </div>
      
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.fields.title}</h1>
        <div className="flex items-center text-gray-600 mb-4">
          <span>{post.fields.author}</span>
          <span className="mx-2">•</span>
          <time>{new Date(post.fields.publishDate).toLocaleDateString()}</time>
        </div>
        <div className="flex flex-wrap gap-2">
          {post.fields.tags?.map((tag: string) => (
            <span
              key={tag}
              className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>

      <div className="prose prose-lg max-w-none">
        {documentToReactComponents(post.fields.content)}
      </div>
    </article>
  );
} 