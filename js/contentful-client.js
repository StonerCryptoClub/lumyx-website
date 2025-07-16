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
        console.log('🔍 Loading case studies from Contentful...');
        try {
            const response = await client.getEntries({
                content_type: 'caseStudies',
                order: '-sys.createdAt'
            });
            
            console.log('📊 Contentful response:', response);
            console.log('📈 Total items found:', response.total);
            
            // Start with empty array
            let finalStudies = [];
            
            // Add real case studies first
            if (response && response.items && response.items.length > 0) {
                console.log('✅ Found', response.items.length, 'real case studies');
                finalStudies = [...response.items];
            }
            
            // Fill remaining slots with placeholders (up to 3 total)
            const neededPlaceholders = Math.max(0, 3 - finalStudies.length);
            if (neededPlaceholders > 0) {
                console.log('📝 Adding', neededPlaceholders, 'placeholders');
                finalStudies = [...finalStudies, ...placeholders.slice(0, neededPlaceholders)];
            }
            
            console.log('🎯 Final studies to display:', finalStudies.length);
            console.log('🔄 Studies:', finalStudies.map(s => s.fields?.title || 'No title'));
            
            return finalStudies;
            
        } catch (error) {
            console.error('❌ Error fetching case studies:', error);
            console.log('🔄 Falling back to placeholders only');
            return placeholders;
        }
    },

    // Get a specific case study by slug
    getCaseStudyBySlug: async (slug) => {
        console.log('🔍 Fetching case study by slug:', slug);
        try {
            // First try to get from Contentful
            const response = await client.getEntries({
                content_type: 'caseStudies',
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

// Log initialization status
console.log('🚀 Contentful client initialized:', window.contentfulHelpers.isReady());
console.log('📋 Contentful helpers available:', Object.keys(window.contentfulHelpers)); 