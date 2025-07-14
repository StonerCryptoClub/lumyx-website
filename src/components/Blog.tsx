'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  featuredImage: {
    url: string;
    title: string;
  };
  category: string;
  publishDate: string;
}

const contentfulClient = {
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN,
};

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          `https://cdn.contentful.com/spaces/${contentfulClient.space}/entries?content_type=blogPost&access_token=${contentfulClient.accessToken}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch blog posts');
        }

        const data = await response.json();
        
        const formattedPosts = data.items.map((item: any) => {
          const featuredImage = data.includes.Asset.find(
            (asset: any) => asset.sys.id === item.fields.featuredImage.sys.id
          );

          return {
            id: item.sys.id,
            title: item.fields.title,
            excerpt: item.fields.excerpt,
            slug: item.fields.slug,
            featuredImage: {
              url: `https:${featuredImage.fields.file.url}`,
              title: featuredImage.fields.title,
            },
            category: item.fields.category,
            publishDate: new Date(item.sys.createdAt).toLocaleDateString(),
          };
        });

        setPosts(formattedPosts);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <article key={post.id} className="bg-gray-800/50 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300">
          <div className="relative h-48">
            <Image
              src={post.featuredImage.url}
              alt={post.featuredImage.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-6">
            <div className="text-sm text-amber-500 mb-2">{post.category}</div>
            <h3 className="text-xl font-bold mb-2">{post.title}</h3>
            <p className="text-gray-300 mb-4">{post.excerpt}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">{post.publishDate}</span>
              <Link 
                href={`/blog/${post.slug}`}
                className="text-blue-500 hover:text-blue-400 transition-colors"
              >
                Read More →
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
} 