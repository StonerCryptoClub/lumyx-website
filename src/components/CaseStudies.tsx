'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CaseStudy, Asset, contentfulClient, ContentfulResponse } from '@/types/contentful';

export default function CaseStudies() {
    const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
    const [assets, setAssets] = useState<Asset[]>([]);

    useEffect(() => {
        async function loadCaseStudies() {
            try {
                const response = await fetch(
                    `https://cdn.contentful.com/spaces/${contentfulClient.spaceId}/entries?content_type=caseStudy&access_token=${contentfulClient.accessToken}`
                );
                const data: ContentfulResponse<CaseStudy> = await response.json();
                
                if (data.items) {
                    setCaseStudies(data.items);
                    setAssets(data.includes?.Asset || []);
                }
            } catch (error) {
                console.error('Error loading case studies:', error);
            }
        }

        loadCaseStudies();
    }, []);

    return (
        <div className="portfolio-grid">
            {caseStudies.map((study) => {
                const imageId = study.fields.featuredImage?.sys?.id;
                const imageUrl = assets.find(asset => asset.sys.id === imageId)?.fields?.file?.url;
                
                return (
                    <div key={study.fields.slug} className="portfolio-item">
                        {imageUrl && (
                            <div className="relative h-48">
                                <Image
                                    src={'https:' + imageUrl}
                                    alt={study.fields.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}
                        <div className="portfolio-content">
                            <span className="category">
                                {study.fields.category || 'Case Study'}
                            </span>
                            <h3 className="text-xl font-bold mt-2 text-[var(--text-light)]">
                                {study.fields.title}
                            </h3>
                            <p className="description mt-4 text-gray-300">
                                {study.fields.excerpt}
                            </p>
                            <Link 
                                href={`/case-studies/${study.fields.slug}`}
                                className="view-project mt-6"
                            >
                                View Case Study 
                                <span className="ml-2">→</span>
                            </Link>
                        </div>
                    </div>
                );
            })}
        </div>
    );
} 