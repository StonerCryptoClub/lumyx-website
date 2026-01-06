// Initialize Contentful Client
const client = contentful.createClient({
    space: window.config.contentful.spaceId,
    accessToken: window.config.contentful.accessToken
});

// Define placeholder case studies
const placeholders = [
    {
        fields: {
            title: "Test Project - Website Redesign",
            category: "Web Development",
            excerpt: "A complete website overhaul that improved user experience and conversion rates by 150%. This is a test case study to verify our integration.",
            slug: "test-project-website-redesign",
            clientName: "Test Client Inc.",
            projectDate: "2024-01-15",
            results: "150% increase in conversions<br>40% faster load times<br>95% user satisfaction rate<br>6-month project"
        }
    },
    {
        fields: {
            title: "Meta Ads Performance Scaling",
            category: "Digital Marketing",
            excerpt: "Strategic scaling of Meta ad campaigns resulting in 3x ROAS improvement and 150% increase in qualified leads for an e-commerce brand.",
            slug: "meta-ads-scaling",
            clientName: "E-commerce Brand",
            projectDate: "2024-01-15",
            results: "350% ROAS improvement<br>150% increase in qualified leads<br>60% lower cost per acquisition<br>6-month campaign"
        }
    },
    {
        fields: {
            title: "TikTok Growth Strategy",
            category: "Social Media",
            excerpt: "Innovative TikTok content strategy that grew account from 0 to 100K followers in 60 days with 2.5M organic views.",
            slug: "tiktok-growth",
            clientName: "Lifestyle Brand",
            projectDate: "2024-01-15",
            results: "100K followers in 60 days<br>2.5M organic views<br>45% engagement rate<br>3-month campaign"
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
                include: 10 // Increase to ensure all linked assets are included
            });

            console.log('📊 Contentful response:', response);
            console.log('📸 Includes:', response.includes);

            if (response.items.length) {
                const study = response.items[0];
                console.log('✅ Found study in Contentful:', study);
                console.log('📸 Study fields:', study.fields);
                
                // If image is a reference, try to resolve it from includes
                const fields = study.fields;
                if (fields.featuredImage?.sys?.id && response.includes?.Asset) {
                    const imageAsset = response.includes.Asset.find(
                        asset => asset.sys.id === fields.featuredImage.sys.id
                    );
                    if (imageAsset) {
                        console.log('📸 Resolved featuredImage from includes:', imageAsset);
                        fields.featuredImage = imageAsset;
                    }
                }
                if (fields.thumbnail?.sys?.id && response.includes?.Asset) {
                    const imageAsset = response.includes.Asset.find(
                        asset => asset.sys.id === fields.thumbnail.sys.id
                    );
                    if (imageAsset) {
                        console.log('📸 Resolved thumbnail from includes:', imageAsset);
                        fields.thumbnail = imageAsset;
                    }
                }
                if (fields.heroImage?.sys?.id && response.includes?.Asset) {
                    const imageAsset = response.includes.Asset.find(
                        asset => asset.sys.id === fields.heroImage.sys.id
                    );
                    if (imageAsset) {
                        console.log('📸 Resolved heroImage from includes:', imageAsset);
                        fields.heroImage = imageAsset;
                    }
                }
                
                return study;
            }

            // If not found in Contentful, check placeholders
            console.log('⚠️ Not in Contentful, looking for placeholder with slug:', slug);
            const placeholder = placeholders.find(p => p.fields.slug === slug);
            if (placeholder) {
                console.log('📝 Found placeholder:', placeholder);
                return placeholder;
            }

            // If not found anywhere, return null
            console.error('❌ No case study found with slug:', slug);
            return null;
        } catch (error) {
            console.error('❌ Error fetching case study:', error);
            
            // On error, try placeholders as fallback
            const placeholder = placeholders.find(p => p.fields.slug === slug);
            return placeholder || null;
        }
    },

    // Get blog posts from Contentful
    getBlogPosts: async () => {
        console.log('🔍 Loading blog posts from Contentful...');
        try {
            const response = await client.getEntries({
                content_type: 'blogPost',
                order: '-sys.createdAt'
            });
            
            console.log('📊 Blog posts response:', response);
            
            if (response && response.items && response.items.length > 0) {
                console.log('✅ Found', response.items.length, 'blog posts');
                return response.items;
            } else {
                console.log('⚠️ No blog posts found in Contentful, using placeholders');
                return window.PLACEHOLDER_BLOG_POSTS || [];
            }
            
        } catch (error) {
            console.error('❌ Error fetching blog posts:', error);
            return window.PLACEHOLDER_BLOG_POSTS || [];
        }
    },

    // Get a specific blog post by slug
    getBlogPostBySlug: async (slug) => {
        console.log('🔍 Fetching blog post by slug:', slug);
        try {
            // First try to get from Contentful
            const response = await client.getEntries({
                content_type: 'blogPost',
                'fields.slug': slug,
                include: 2
            });

            console.log('Blog post response:', response);

            if (response.items.length) {
                const post = response.items[0];
                console.log('Found blog post in Contentful:', post);
                return post;
            }

            // If not found in Contentful, check placeholders
            console.log('Looking for placeholder blog post with slug:', slug);
            const placeholderPosts = window.PLACEHOLDER_BLOG_POSTS || [];
            const placeholder = placeholderPosts.find(p => p.fields.slug === slug);
            if (placeholder) {
                console.log('Found placeholder blog post:', placeholder);
                return placeholder;
            }

            // If not found anywhere, return null
            console.error('No blog post found with slug:', slug);
            return null;
        } catch (error) {
            console.error('Error fetching blog post:', error);
            
            // On error, try placeholders as fallback
            const placeholderPosts = window.PLACEHOLDER_BLOG_POSTS || [];
            const placeholder = placeholderPosts.find(p => p.fields.slug === slug);
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