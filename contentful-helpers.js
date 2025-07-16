// Contentful API Helpers
window.contentfulHelpers = {
    // Initialize with configuration
    init(config) {
        if (!config?.spaceId || !config?.accessToken) {
            console.error('Contentful configuration is missing required fields');
            return;
        }
        this.spaceId = config.spaceId;
        this.accessToken = config.accessToken;
        this.initialized = true;
        console.log('Contentful helpers initialized successfully');
    },

    // Check if ready
    isReady() {
        return this.initialized === true;
    },

    // Base fetch method with error handling
    async fetchContentful(query) {
        if (!this.initialized) {
            throw new Error('Contentful helpers not initialized');
        }

        try {
            const response = await fetch(
                `https://cdn.contentful.com/spaces/${this.spaceId}/entries${query}&access_token=${this.accessToken}&include=2`
            );

            if (!response.ok) {
                throw new Error(`Contentful API error: ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching from Contentful:', error);
            throw error;
        }
    },

    // Get all case studies
    async getCaseStudies() {
        try {
            const data = await this.fetchContentful('?content_type=caseStudy');
            
            if (!data?.items || !Array.isArray(data.items)) {
                console.warn('No case studies found or invalid response format');
                return [];
            }

            return data.items.map(study => {
                if (!study?.fields) {
                    console.warn('Invalid case study data structure:', study);
                    return null;
                }

                const { fields } = study;
                const imageId = fields.thumbnail?.sys?.id;
                const imageUrl = data.includes?.Asset?.find(asset => 
                    asset?.sys?.id === imageId
                )?.fields?.file?.url;

                // Return in the format expected by portfolio-manager.js
                return {
                    fields: {
                        title: fields.title || 'Untitled Case Study',
                        category: fields.category || 'Case Study',
                        excerpt: fields.description || '',
                        slug: fields.slug || '',
                        clientName: fields.clientName || '',
                        results: Array.isArray(fields.results) ? fields.results : [],
                        projectDate: fields.projectDate || null,
                        content: fields.content || null,
                        featuredImage: imageUrl ? {
                            fields: {
                                file: {
                                    url: imageUrl
                                }
                            }
                        } : null
                    }
                };
            }).filter(study => study !== null);
        } catch (error) {
            console.error('Error getting case studies:', error);
            return [];
        }
    },

    // Get a single case study by slug
    async getCaseStudyBySlug(slug) {
        try {
            const data = await this.fetchContentful(`?content_type=caseStudy&fields.slug=${slug}`);
            
            if (!data?.items?.[0]?.fields) {
                console.warn('Case study not found or invalid response format');
                return null;
            }

            const study = data.items[0];
            const imageId = study.fields.thumbnail?.sys?.id;
            const imageUrl = data.includes?.Asset?.find(asset => 
                asset?.sys?.id === imageId
            )?.fields?.file?.url;

            return {
                fields: {
                    title: study.fields.title || 'Untitled Case Study',
                    category: study.fields.category || 'Case Study',
                    excerpt: study.fields.description || '',
                    slug: study.fields.slug || '',
                    clientName: study.fields.clientName || '',
                    results: Array.isArray(study.fields.results) ? study.fields.results : [],
                    projectDate: study.fields.projectDate || null,
                    content: study.fields.content || null,
                    featuredImage: imageUrl ? {
                        fields: {
                            file: {
                                url: imageUrl
                            }
                        }
                    } : null
                }
            };
        } catch (error) {
            console.error('Error getting case study:', error);
            return null;
        }
    },

    // Get placeholder case studies for fallback
    getPlaceholders() {
        return [
            {
                fields: {
                    title: "Meta Ads Scaling Success",
                    category: "Digital Marketing",
                    excerpt: "Scaled ad campaigns across Meta platforms achieving 350% ROAS and 2.5x customer acquisition rate.",
                    slug: "meta-ads-scaling",
                    clientName: "E-commerce Brand"
                }
            },
            {
                fields: {
                    title: "E-commerce Conversion Rate Optimization",
                    category: "CRO & Funnel",
                    excerpt: "Complete funnel optimization resulting in 85% higher conversion rates and 40% lower cart abandonment.",
                    slug: "ecommerce-cro",
                    clientName: "Fashion Retailer"
                }
            },
            {
                fields: {
                    title: "SaaS Content Strategy",
                    category: "SEO & Content",
                    excerpt: "Comprehensive SEO and content strategy that grew organic traffic by 200% in 6 months.",
                    slug: "saas-content-strategy",
                    clientName: "B2B SaaS Platform"
                }
            }
        ];
    }
}; 