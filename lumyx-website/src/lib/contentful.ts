import { createClient } from 'contentful';

export const contentfulClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
});

export interface BlogPost {
  title: string;
  slug: string;
  author: string;
  publishDate: string;
  featuredImage: {
    fields: {
      file: {
        url: string;
      };
    };
  };
  excerpt: string;
  content: any;
  tags: string[];
}

export interface CaseStudy {
  title: string;
  slug: string;
  clientName: string;
  industry: string;
  challengeDescription: string;
  solution: any;
  results: any;
  testimonial: string;
  featuredImage: {
    fields: {
      file: {
        url: string;
      };
    };
  };
  metrics: {
    metric1: string;
    metric2: string;
    metric3: string;
  };
}

export async function getBlogPosts() {
  const response = await contentfulClient.getEntries<BlogPost>({
    content_type: 'blogPost',
    order: '-fields.publishDate',
  });

  return response.items;
}

export async function getCaseStudies() {
  const response = await contentfulClient.getEntries<CaseStudy>({
    content_type: 'caseStudy',
    order: '-sys.createdAt',
  });

  return response.items;
}

export async function getBlogPost(slug: string) {
  const response = await contentfulClient.getEntries<BlogPost>({
    content_type: 'blogPost',
    'fields.slug': slug,
  });

  return response.items[0];
}

export async function getCaseStudy(slug: string) {
  const response = await contentfulClient.getEntries<CaseStudy>({
    content_type: 'caseStudy',
    'fields.slug': slug,
  });

  return response.items[0];
} 