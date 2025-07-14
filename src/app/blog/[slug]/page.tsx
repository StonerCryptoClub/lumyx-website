import React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { BlogPost, Asset, contentfulClient } from '@/types/contentful';

async function getBlogPost(slug: string) {
    try {
        const response = await fetch(
            `https://cdn.contentful.com/spaces/${contentfulClient.spaceId}/entries?content_type=blogPost&fields.slug=${slug}&access_token=${contentfulClient.accessToken}`,
            { next: { revalidate: 3600 } } // Revalidate every hour
        );
        const data = await response.json();
        
        if (!data.items?.length) {
            return null;
        }

        return {
            post: data.items[0] as BlogPost,
            assets: data.includes?.Asset as Asset[] || []
        };
    } catch (error) {
        console.error('Error fetching blog post:', error);
        return null;
    }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
    const data = await getBlogPost(params.slug);

    if (!data) {
        notFound();
    }

    const { post, assets } = data;
    const imageId = post.fields.featuredImage?.sys?.id;
    const imageUrl = assets.find(asset => asset.sys.id === imageId)?.fields?.file?.url;
    const authorAvatarId = post.fields.author?.fields?.avatar?.sys?.id;
    const authorAvatarUrl = assets.find(asset => asset.sys.id === authorAvatarId)?.fields?.file?.url;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <article className="max-w-4xl mx-auto px-4 py-12">
            <header className="mb-8">
                <div className="flex items-center mb-4">
                    {authorAvatarUrl && (
                        <div className="relative w-12 h-12 mr-4">
                            <Image
                                src={'https:' + authorAvatarUrl}
                                alt={post.fields.author.fields.name}
                                fill
                                className="rounded-full object-cover"
                            />
                        </div>
                    )}
                    <div>
                        <p className="text-lg font-medium text-[var(--text-light)]">
                            {post.fields.author.fields.name}
                        </p>
                        <p className="text-sm text-gray-400">
                            {formatDate(post.fields.publishDate)}
                            {post.fields.readTime && ` · ${post.fields.readTime} min read`}
                        </p>
                    </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[var(--text-light)]">
                    {post.fields.title}
                </h1>
                {post.fields.category && (
                    <span className="category">
                        {post.fields.category}
                    </span>
                )}
            </header>

            {imageUrl && (
                <div className="relative h-[400px] mb-8">
                    <Image
                        src={'https:' + imageUrl}
                        alt={post.fields.title}
                        fill
                        className="object-cover rounded-lg"
                        priority
                    />
                </div>
            )}

            <div className="prose prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: post.fields.content }} />
            </div>
        </article>
    );
} 