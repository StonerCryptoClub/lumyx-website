import React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { CaseStudy, Asset, contentfulClient } from '@/types/contentful';

async function getCaseStudy(slug: string) {
    try {
        const response = await fetch(
            `https://cdn.contentful.com/spaces/${contentfulClient.spaceId}/entries?content_type=caseStudy&fields.slug=${slug}&access_token=${contentfulClient.accessToken}`,
            { next: { revalidate: 3600 } } // Revalidate every hour
        );
        const data = await response.json();
        
        if (!data.items?.length) {
            return null;
        }

        return {
            study: data.items[0] as CaseStudy,
            assets: data.includes?.Asset as Asset[] || []
        };
    } catch (error) {
        console.error('Error fetching case study:', error);
        return null;
    }
}

export default async function CaseStudyPage({ params }: { params: { slug: string } }) {
    const data = await getCaseStudy(params.slug);

    if (!data) {
        notFound();
    }

    const { study, assets } = data;
    const imageId = study.fields.featuredImage?.sys?.id;
    const imageUrl = assets.find(asset => asset.sys.id === imageId)?.fields?.file?.url;

    return (
        <article className="max-w-4xl mx-auto px-4 py-12">
            <header className="mb-8">
                <span className="category block mb-4">
                    {study.fields.category}
                </span>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[var(--text-light)]">
                    {study.fields.title}
                </h1>
                <p className="text-xl text-gray-300">
                    {study.fields.excerpt}
                </p>
            </header>

            {imageUrl && (
                <div className="relative h-[400px] mb-8">
                    <Image
                        src={'https:' + imageUrl}
                        alt={study.fields.title}
                        fill
                        className="object-cover rounded-lg"
                        priority
                    />
                </div>
            )}

            <div className="prose prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: study.fields.content }} />
            </div>
        </article>
    );
} 