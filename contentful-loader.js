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
    try {
        const response = await fetch(
            `https://cdn.contentful.com/spaces/${contentfulClient.spaceId}/entries?content_type=blogPost&access_token=${contentfulClient.accessToken}`
        );
        const data = await response.json();
        
        const blogContainer = document.querySelector('.blog-grid');
        if (!blogContainer) return;
        
        // Store existing placeholder cards
        const existingCards = blogContainer.querySelectorAll('.blog-card');
        
        // Only proceed if we got posts from Contentful
        if (data.items && data.items.length > 0) {
            data.items.forEach((post, index) => {
                if (index < existingCards.length) { // Only replace existing cards
                    // Get the image URL from the linked assets
                    const imageId = post.fields.featuredImage?.sys?.id;
                    const imageUrl = data.includes?.Asset?.find(asset => asset.sys.id === imageId)?.fields?.file?.url;
                    
                    const postHTML = `
                        <article class="blog-card" itemscope itemtype="https://schema.org/BlogPosting">
                            <div class="blog-image">
                                <img src="${imageUrl ? 'https:' + imageUrl : 'placeholder-image.jpg'}" 
                                     alt="${post.fields.title}" 
                                     width="800" height="450" loading="lazy" itemprop="image">
                            </div>
                            <div class="blog-content">
                                <span class="blog-category">${post.fields.category || 'General'}</span>
                                <h2 itemprop="headline">${post.fields.title}</h2>
                                <p itemprop="description">${post.fields.excerpt}</p>
                                <div class="blog-meta">
                                    <span itemprop="datePublished"><i class="far fa-calendar"></i> ${formatDate(post.fields.publishdate)}</span>
                                    <span><i class="far fa-clock"></i> ${post.fields.readtime} min read</span>
                                    <span itemprop="author" itemscope itemtype="https://schema.org/Organization">
                                        <i class="far fa-user"></i> <span itemprop="name">Lumyx Team</span>
                                    </span>
                                </div>
                                <a href="blog-post.html?slug=${post.fields.slug}" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
                            </div>
                        </article>
                    `;
                    existingCards[index].outerHTML = postHTML;
                }
            });
        }
    } catch (error) {
        console.error('Error loading blog posts:', error);
        // On error, keep the existing content visible
    }
}

// Load content when page loads
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.blog-grid')) {
        loadBlogPosts();
    }
}); 