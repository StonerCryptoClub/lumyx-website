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

                return {
                    title: fields.title || 'Untitled Case Study',
                    category: fields.category || 'Case Study',
                    clientName: fields.clientName || '',
                    description: fields.description || '',
                    results: Array.isArray(fields.results) ? fields.results : [],
                    slug: fields.slug || '',
                    thumbnail: imageUrl ? `https:${imageUrl}` : null,
                    projectDate: fields.projectDate || null,
                    content: fields.content || null
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
                title: study.fields.title || 'Untitled Case Study',
                category: study.fields.category || 'Case Study',
                clientName: study.fields.clientName || '',
                description: study.fields.description || '',
                results: Array.isArray(study.fields.results) ? study.fields.results : [],
                slug: study.fields.slug || '',
                thumbnail: imageUrl ? `https:${imageUrl}` : null,
                projectDate: study.fields.projectDate || null,
                content: study.fields.content || null
            };
        } catch (error) {
            console.error('Error getting case study:', error);
            return null;
        }
    }
}; 