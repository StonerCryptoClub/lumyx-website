// Contentful configuration
const contentfulClient = {
    spaceId: '74kxarv2y1kp',
    accessToken: 'yJszWN6sgnfaKhUmjvl02S-T1UTq9TVBKLUH5xb5H8c'
};

// Function to format date
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date)) return '';
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Function to render rich text content
function renderRichText(content) {
    if (!content || !content.content) return '';
    
    return content.content.map(node => {
        if (node.nodeType === 'paragraph') {
            return `<p>${node.content.map(text => text.value).join('')}</p>`;
        }
        if (node.nodeType === 'heading-1') {
            return `<h1>${node.content.map(text => text.value).join('')}</h1>`;
        }
        if (node.nodeType === 'heading-2') {
            return `<h2>${node.content.map(text => text.value).join('')}</h2>`;
        }
        if (node.nodeType === 'heading-3') {
            return `<h3>${node.content.map(text => text.value).join('')}</h3>`;
        }
        if (node.nodeType === 'unordered-list') {
            return `<ul>${node.content.map(item => `<li>${item.content.map(text => text.value).join('')}</li>`).join('')}</ul>`;
        }
        if (node.nodeType === 'ordered-list') {
            return `<ol>${node.content.map(item => `<li>${item.content.map(text => text.value).join('')}</li>`).join('')}</ol>`;
        }
        if (node.nodeType === 'hyperlink') {
            return `<a href="${node.data.uri}">${node.content.map(text => text.value).join('')}</a>`;
        }
        if (node.nodeType === 'hr') {
            return '<hr>';
        }
        return '';
    }).join('');
}

// Function to create blog post modal
function createBlogModal(post) {
    const modal = document.createElement('div');
    modal.className = 'modal blog-modal active';
    
    const imageId = post.fields.featuredImage?.sys?.id;
    const imageUrl = window.contentfulData.includes?.Asset?.find(asset => asset.sys.id === imageId)?.fields?.file?.url;
    
    modal.innerHTML = `
        <div class="modal-content blog-modal-content">
            <span class="close-modal">&times;</span>
            <div class="blog-modal-header">
                <span class="blog-category">${post.fields.category || 'General'}</span>
                <h2>${post.fields.title}</h2>
                <div class="blog-meta">
                    <span><i class="far fa-calendar"></i> ${formatDate(post.fields.publishdate)}</span>
                    <span><i class="far fa-clock"></i> ${post.fields.readtime} min read</span>
                    <span><i class="far fa-user"></i> Lumyx Team</span>
                </div>
            </div>
            <div class="blog-modal-image-container">
                <img src="${imageUrl ? 'https:' + imageUrl : 'placeholder-image.jpg'}" 
                     alt="${post.fields.title}" class="blog-modal-image">
            </div>
            <div class="blog-modal-body">
                ${renderRichText(post.fields.content)}
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Close modal functionality
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.onclick = () => {
        modal.remove();
        document.body.style.overflow = '';
    };

    // Close on outside click
    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.remove();
            document.body.style.overflow = '';
        }
    };

    // Prevent scrolling when modal is open
    document.body.style.overflow = 'hidden';
}

// Function to load blog posts
async function loadBlogPosts() {
    // Blog posts placeholders in case the API fails
    const placeholderPosts = window.PLACEHOLDER_BLOG_POSTS || [
        {
            fields: {
                title: "10 Proven Strategies to Boost Your Social Media Engagement in 2024",
                slug: "social-media-engagement-strategies",
                category: "Digital Marketing",
                excerpt: "Learn data-driven techniques to increase your social media following, improve engagement rates, and convert followers into customers.",
                publishdate: "2024-03-15",
                readtime: "5",
                featuredImage: { 
                    fields: { 
                        file: { url: "//images.ctfassets.net/74kxarv2y1kp/5JYfE6NbpfG0hQyCIxCcQZ/3d48b312c258d0cd403fb19455f0ad29/social-media-image.jpg" } 
                    } 
                }
            }
        },
        {
            fields: {
                title: "Building a Memorable Brand Identity That Drives Growth in 2024",
                slug: "brand-identity-growth",
                category: "Brand Strategy",
                excerpt: "Discover the essential elements of creating a powerful brand identity that resonates with your target audience and drives business growth.",
                publishdate: "2024-03-10",
                readtime: "7",
                featuredImage: { 
                    fields: { 
                        file: { url: "//images.ctfassets.net/74kxarv2y1kp/2MRfG7YFiP3q3vfbVLZcge/a4e34f0c5f89fa14e4b0f1a2ccc33e45/brand-identity-image.jpg" } 
                    } 
                }
            }
        },
        {
            fields: {
                title: "Advanced SEO Techniques to Dominate Search Rankings in 2024",
                slug: "advanced-seo-techniques",
                category: "SEO",
                excerpt: "Implement these cutting-edge SEO strategies to improve your website visibility, drive organic traffic, and outrank your competitors.",
                publishdate: "2024-03-05",
                readtime: "6",
                featuredImage: { 
                    fields: { 
                        file: { url: "//images.ctfassets.net/74kxarv2y1kp/3V0i8YrZDQ28LCGVmJPRg0/63c5b426b5e8902d12af622928119dc4/seo-image.jpg" } 
                    } 
                }
            }
        }
    ];

    console.log('Loading blog posts...');
    
    // Get blog container
    const blogContainer = document.querySelector('.blog-grid');
    if (!blogContainer) {
        console.error('Blog container not found');
        return;
    }
    
    try {
        // Try to fetch from Contentful
        const response = await fetch(
            `https://cdn.contentful.com/spaces/${contentfulClient.spaceId}/entries?content_type=blogPost&access_token=${contentfulClient.accessToken}`,
            { method: 'GET', timeout: 3000 }
        );
        
        if (!response.ok) {
            throw new Error(`Contentful API responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // If we got posts from Contentful and they have items
        if (data && data.items && data.items.length > 0) {
            console.log('Successfully loaded blog posts from Contentful:', data.items.length);
            
            // Clear blog container
            blogContainer.innerHTML = '';
            
            // Render posts from Contentful
            data.items.forEach((post) => {
                // Get the image URL from the linked assets
                const imageId = post.fields.featuredImage?.sys?.id;
                const imageAsset = data.includes?.Asset?.find(asset => asset.sys.id === imageId);
                const imageUrl = imageAsset?.fields?.file?.url || 
                                '//images.ctfassets.net/74kxarv2y1kp/default-blog-image/default-image.jpg';
                
                const postHTML = createBlogPostHTML(post, imageUrl);
                blogContainer.innerHTML += postHTML;
            });
        } else {
            // No posts from Contentful, use placeholders
            console.log('No blog posts found in Contentful, using placeholders');
            renderPlaceholderPosts(blogContainer, placeholderPosts);
        }
    } catch (error) {
        console.error('Error loading blog posts from Contentful:', error);
        renderPlaceholderPosts(blogContainer, placeholderPosts);
    }
}

// Helper function to create blog post HTML
function createBlogPostHTML(post, imageUrl) {
    return `
        <article class="blog-card" itemscope itemtype="https://schema.org/BlogPosting">
            <img src="${imageUrl ? 'https:' + imageUrl : 'https://images.unsplash.com/photo-1611926653458-09294b3142bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}" 
                 alt="${post.fields.title}" 
                 width="350" height="200" loading="lazy" itemprop="image">
            <div class="blog-content">
                <span class="blog-category">${post.fields.category || 'Digital Marketing'}</span>
                <h2 itemprop="headline">${post.fields.title}</h2>
                <p itemprop="description">${post.fields.excerpt || 'No description available'}</p>
                <div class="blog-meta">
                    <span itemprop="datePublished"><i class="far fa-calendar"></i> ${formatDate(post.fields.publishdate || new Date())}</span>
                    <span><i class="far fa-clock"></i> ${post.fields.readtime || '5'} min read</span>
                </div>
                <a href="./blog-post.html?slug=${post.fields.slug}" class="read-more" itemprop="url">Read More <i class="fas fa-arrow-right"></i></a>
            </div>
        </article>
    `;
}

// Helper function to render placeholder posts
function renderPlaceholderPosts(container, posts) {
    // Clear container first
    container.innerHTML = '';
    
    // If no posts provided or empty array, use default placeholders
    if (!posts || posts.length === 0 || posts.length < 3) {
        posts = [
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
    }
    
    // Default image URLs for each category
    const defaultImages = {
        'Digital Marketing': 'https://images.unsplash.com/photo-1611926653458-09294b3142bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'Brand Strategy': 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'SEO': 'https://images.unsplash.com/photo-1571786256017-aee7a0c009b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'Social Media': 'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'default': 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    };
    
    // Render placeholder posts
    posts.forEach((post) => {
        const category = post.fields.category || 'Digital Marketing';
        const imageUrl = post.fields.featuredImage?.fields?.file?.url || 
                        defaultImages[category] || defaultImages['default'];
        
        // For placeholder posts, we may need to prepend http: or https:
        const fullImageUrl = imageUrl.startsWith('//') ? 'https:' + imageUrl : imageUrl;
        
        const postHTML = `
            <article class="blog-card" itemscope itemtype="https://schema.org/BlogPosting">
                <img src="${fullImageUrl}" 
                     alt="${post.fields.title}" 
                     width="350" height="200" loading="lazy" itemprop="image">
                <div class="blog-content">
                    <span class="blog-category">${category}</span>
                    <h2 itemprop="headline">${post.fields.title}</h2>
                    <p itemprop="description">${post.fields.excerpt || 'No description available'}</p>
                    <div class="blog-meta">
                        <span itemprop="datePublished"><i class="far fa-calendar"></i> ${formatDate(post.fields.publishdate || new Date())}</span>
                        <span><i class="far fa-clock"></i> ${post.fields.readtime || '5'} min read</span>
                    </div>
                    <a href="./blog-post.html?slug=${post.fields.slug}" class="read-more" itemprop="url">Read More <i class="fas fa-arrow-right"></i></a>
                </div>
            </article>
        `;
        container.innerHTML += postHTML;
    });
}

// Load content when page loads
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.blog-grid')) {
        loadBlogPosts();
    }
}); 