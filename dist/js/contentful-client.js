// Initialize Contentful Client
const client = contentful.createClient({
    space: '74kxarv2y1kp',
    accessToken: 'yJszWN6sgnfaKhUmjvl02S-T1UTq9TVBKLUH5xb5H8c'
});

// Define placeholder case studies
const placeholders = [
    {
        fields: {
            title: "Website Redesign & Development",
            category: "Web Development",
            description: "A complete website overhaul that improved user experience and conversion rates by 150%. This is a test case study to verify our integration.",
            clientName: "Test Client Inc.",
            results: {
                mainMetric: {
                    value: "150%",
                    label: "increase in conversions"
                },
                supportingMetrics: [
                    "40% faster load times",
                    "95% user satisfaction rate"
                ]
            },
            slug: "website-redesign"
        }
    },
    {
        fields: {
            title: "Meta Ads Performance Scaling",
            category: "Digital Marketing",
            description: "Strategic scaling of Meta ad campaigns resulting in 3x ROAS improvement and 150% increase in qualified leads for an e-commerce brand.",
            clientName: "E-commerce Brand",
            results: {
                mainMetric: {
                    value: "3x",
                    label: "ROAS improvement"
                },
                supportingMetrics: [
                    "150% increase in qualified leads",
                    "60% lower cost per acquisition"
                ]
            },
            slug: "meta-ads-scaling"
        }
    },
    {
        fields: {
            title: "TikTok Growth Strategy",
            category: "Social Media",
            description: "Innovative TikTok content strategy that grew account from 0 to 100K followers in 60 days with 2.5M organic views.",
            clientName: "Lifestyle Brand",
            results: {
                mainMetric: {
                    value: "100K",
                    label: "followers in 60 days"
                },
                supportingMetrics: [
                    "2.5M organic views",
                    "45% engagement rate"
                ]
            },
            slug: "tiktok-growth"
        }
    }
];

// Create global contentful helpers
window.contentfulHelpers = {
    // Get case studies from Contentful
    getCaseStudies: async () => {
        try {
            const response = await client.getEntries({
                content_type: 'caseStudy',
                order: '-sys.createdAt'
            });
            
            // Check if we got any actual entries back
            if (response && response.items && response.items.length > 0) {
                console.log('Successfully loaded case studies from Contentful:', response.items.length);
            return response.items;
            } else {
                console.log('No case studies found in Contentful, using placeholders');
                return placeholders; // Use placeholders if no entries
            }
        } catch (error) {
            console.error('Error fetching case studies from Contentful:', error);
            console.log('Falling back to placeholder case studies');
            return placeholders; // Use placeholders on error
        }
    },

    // Get a specific case study by slug
    getCaseStudyBySlug: async (slug) => {
        try {
            // First try to get from Contentful
            const response = await client.getEntries({
                content_type: 'caseStudy',
                'fields.slug': slug,
                include: 2
            });

            console.log('Contentful response:', response);

            if (response.items.length) {
                const study = response.items[0];
                console.log('Found study in Contentful:', study);
                return study;
            }

            // If not found in Contentful, check placeholders
            console.log('Looking for placeholder with slug:', slug);
            const placeholder = placeholders.find(p => p.fields.slug === slug);
            if (placeholder) {
                console.log('Found placeholder:', placeholder);
                return placeholder;
            }

            // If not found anywhere, return null
            console.error('No case study found with slug:', slug);
            return null;
        } catch (error) {
            console.error('Error fetching case study:', error);
            
            // On error, try placeholders as fallback
            const placeholder = placeholders.find(p => p.fields.slug === slug);
            return placeholder || null;
        }
    },

    // Get placeholder case studies
    getPlaceholders: () => placeholders,

    // Check if Contentful is ready
    isReady: () => !!client
};

// Error handler for Contentful requests
function handleContentfulError(error) {
    console.error('Contentful Error:', error);
    
    if (error.sys) {
        switch (error.sys.id) {
            case 'NotFound':
                return { notFound: true, message: 'Resource not found' };
            case 'AccessDenied':
                return { error: { statusCode: 403, message: 'Access denied - check your credentials' } };
            case 'RateLimitExceeded':
                return { error: { statusCode: 429, message: 'Rate limit exceeded - please try again later' } };
        }
    }
    
    return {
        error: {
            statusCode: error.status || 500,
            message: error.message || 'An unexpected error occurred'
        }
    };
}

// Function to get blog posts
async function getBlogPosts(options = {}) {
    try {
        const query = {
            content_type: 'blogPost',
            include: 2,
            order: options.order || '-sys.createdAt',
            limit: options.limit || 100,
            ...options.filters
        };

        const response = await client.getEntries(query);
        return validateResponse(response, 'blog posts');
    } catch (error) {
        return handleContentfulError(error);
    }
}

// Function to get a single blog post by slug
async function getBlogPostBySlug(slug) {
    if (!slug) {
        return handleContentfulError(new Error('Slug is required'));
    }

    try {
        const response = await client.getEntries({
            content_type: 'blogPost',
            'fields.slug': slug,
            include: 2
        });
        
        if (!response.items.length) {
            return handleContentfulError({ sys: { id: 'NotFound' } });
        }
        
        return response.items[0];
    } catch (error) {
        return handleContentfulError(error);
    }
}

// Initialize all helpers
Object.assign(window.contentfulHelpers, {
    getBlogPosts,
    getBlogPostBySlug,
    // Add placeholder HTML function
    getPlaceholderHTML: () => {
        return `
            <div class="portfolio-item" data-category="Digital Marketing">
                <img src="images/portfolio/digital-marketing.jpg" 
                     alt="Meta Ads Scaling Success" loading="lazy">
                <div class="portfolio-content">
                    <span class="category">Digital Marketing</span>
                    <h3>Meta Ads Scaling Success</h3>
                    <p class="client">Client: E-commerce Brand</p>
                    <p class="description">Strategic scaling of Meta ad campaigns resulting in 3x ROAS improvement and 150% increase in qualified leads.</p>
                    <div class="result-tags">
                        <span class="result-tag">📈 3x ROAS Improvement</span>
                        <span class="result-tag">👥 150% Lead Increase</span>
                        <span class="result-tag">⏱️ 6 Month Campaign</span>
                    </div>
                    <a href="./case-study.html?slug=meta-ads-scaling" class="view-project">
                        View Case Study <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        `;
    }
});

// Log initialization status
console.log('Contentful client initialized:', window.contentfulHelpers.isReady());
console.log('Contentful helpers initialized:', Object.keys(window.contentfulHelpers)); 