/**
 * Generate Placeholders Script
 * 
 * This script generates placeholder content for blog posts and case studies
 * when the Contentful API is not available or returns no content.
 */

// Placeholder case studies
const PLACEHOLDER_CASE_STUDIES = [
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
            title: "Meta Ads Scaling Success",
            category: "Ad Campaigns",
            excerpt: "Scaled ad campaigns across Meta platforms achieving 350% ROAS and 2.5x customer acquisition rate.",
            slug: "meta-ads-scaling",
            clientName: "E-commerce Brand",
            projectDate: "2024-01-15",
            results: "350% ROAS improvement<br>2.5x customer acquisition rate<br>40% reduction in CPA<br>12-month ongoing campaign"
        }
    },
    {
        fields: {
            title: "E-commerce Conversion Rate Optimization",
            category: "CRO & Funnel",
            excerpt: "Complete funnel optimization resulting in 85% higher conversion rates and 40% lower cart abandonment.",
            slug: "ecommerce-cro",
            clientName: "Fashion Retailer",
            projectDate: "2023-11-10",
            results: "85% higher conversion rate<br>40% lower cart abandonment<br>125% increase in AOV<br>3-month intensive project"
        }
    },
    {
        fields: {
            title: "SaaS Content Strategy",
            category: "SEO & Content Strategy",
            excerpt: "Comprehensive SEO and content strategy that grew organic traffic by 200% in 6 months.",
            slug: "saas-content-strategy",
            clientName: "B2B SaaS Platform",
            projectDate: "2023-09-22",
            results: "200% organic traffic increase<br>150% more demo signups<br>Page 1 rankings for 35+ keywords<br>6-month ongoing contract"
        }
    }
];

// Placeholder blog posts
const PLACEHOLDER_BLOG_POSTS = [
    {
        fields: {
            title: "10 Proven Strategies to Boost Your Social Media Engagement in 2024",
            slug: "social-media-engagement-strategies",
            category: "Digital Marketing",
            excerpt: "Learn data-driven techniques to increase your social media following, improve engagement rates, and convert followers into customers.",
            publishdate: "2024-03-15",
            readtime: "5"
        }
    },
    {
        fields: {
            title: "Building a Memorable Brand Identity That Drives Growth in 2024",
            slug: "brand-identity-growth",
            category: "Brand Strategy",
            excerpt: "Discover the essential elements of creating a powerful brand identity that resonates with your target audience and drives business growth.",
            publishdate: "2024-03-10",
            readtime: "7"
        }
    },
    {
        fields: {
            title: "Advanced SEO Techniques to Dominate Search Rankings in 2024",
            slug: "advanced-seo-techniques",
            category: "SEO",
            excerpt: "Implement these cutting-edge SEO strategies to improve your website visibility, drive organic traffic, and outrank your competitors.",
            publishdate: "2024-03-05",
            readtime: "6"
        }
    }
];

// Make placeholders available globally
window.PLACEHOLDER_CASE_STUDIES = PLACEHOLDER_CASE_STUDIES;
window.PLACEHOLDER_BLOG_POSTS = PLACEHOLDER_BLOG_POSTS;

// Extend contentful helpers with placeholder functionality
if (window.contentfulHelpers) {
    // Add placeholders to contentful helpers
    window.contentfulHelpers.getPlaceholderCaseStudies = () => PLACEHOLDER_CASE_STUDIES;
    window.contentfulHelpers.getPlaceholderBlogPosts = () => PLACEHOLDER_BLOG_POSTS;
    
    // Override getCaseStudies if it fails
    const originalGetCaseStudies = window.contentfulHelpers.getCaseStudies;
    window.contentfulHelpers.getCaseStudies = async () => {
        try {
            const studies = await originalGetCaseStudies();
            if (studies && studies.length > 0) {
                return studies;
            }
            console.log('No case studies returned from API, using placeholders');
            return PLACEHOLDER_CASE_STUDIES;
        } catch (error) {
            console.error('Error fetching case studies, using placeholders:', error);
            return PLACEHOLDER_CASE_STUDIES;
        }
    };
    
    console.log('Placeholders registered with contentfulHelpers');
} else {
    console.warn('contentfulHelpers not found, placeholders will be globally available but not integrated');
}

// Generate a placeholder image for blog posts and case studies
function generatePlaceholderImage(category) {
    const colors = {
        'Digital Marketing': ['#1877F2', '#45B6FE'],
        'SEO': ['#00A661', '#6DE49C'],
        'Brand Strategy': ['#FFA500', '#FFD700'],
        'CRO & Funnel': ['#FF4B4B', '#FF8F8F'],
        'Ad Campaigns': ['#4737FF', '#9747FF'],
        'Web Development': ['#3A0CA3', '#7209B7'],
        'default': ['#FFA500', '#FF6B6B']
    };
    
    const [color1, color2] = colors[category] || colors.default;
    
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400">
        <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
                <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
            </linearGradient>
        </defs>
        <rect width="800" height="400" fill="url(#grad)" />
        <text x="400" y="200" fill="white" font-family="Arial" font-size="32" text-anchor="middle" dominant-baseline="middle">${category}</text>
    </svg>`;
    
    return 'data:image/svg+xml;base64,' + btoa(svg);
}

// Make the helper available globally
window.generatePlaceholderImage = generatePlaceholderImage; 