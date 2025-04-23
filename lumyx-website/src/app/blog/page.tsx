import { getBlogPosts } from '@/lib/contentful';
import Image from 'next/image';
import Link from 'next/link';

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post: any) => (
          <article key={post.sys.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative h-48">
              <Image
                src={`https:${post.fields.featuredImage.fields.file.url}`}
                alt={post.fields.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">{post.fields.title}</h2>
              <div className="flex items-center text-sm text-gray-600 mb-4">
                <span>{post.fields.author}</span>
                <span className="mx-2">•</span>
                <time>{new Date(post.fields.publishDate).toLocaleDateString()}</time>
              </div>
              <p className="text-gray-600 mb-4">{post.fields.excerpt}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {post.fields.tags?.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Link
                href={`/blog/${post.fields.slug}`}
                className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
              >
                Read More
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