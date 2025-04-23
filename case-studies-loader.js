// Contentful configuration
const contentfulClient = {
    spaceId: '74kxarv2y1kp',
    accessToken: 'yJszWN6sgnfaKhUmjvl02S-T1UTq9TVBKLUH5xb5H8c'
};

// Function to load case studies
async function loadCaseStudies() {
    try {
        const response = await fetch(
            `https://cdn.contentful.com/spaces/${contentfulClient.spaceId}/entries?content_type=caseStudy&access_token=${contentfulClient.accessToken}`
        );
        const data = await response.json();
        
        const caseStudiesContainer = document.querySelector('.portfolio-grid');
        if (!caseStudiesContainer) return;
        
        // Only replace content if we successfully got case studies from Contentful
        if (data.items && data.items.length > 0) {
            let newContent = '';
            
            data.items.forEach(study => {
                // Get the image URL from the linked assets
                const imageId = study.fields.featuredImage?.sys?.id;
                const imageUrl = data.includes?.Asset?.find(asset => asset.sys.id === imageId)?.fields?.file?.url;
                
                const studyHTML = `
                    <div class="portfolio-item">
                        <img src="${imageUrl ? 'https:' + imageUrl : 'placeholder-image.jpg'}" 
                             alt="${study.fields.title}" 
                             width="800" height="450" loading="lazy">
                        <div class="portfolio-content">
                            <span class="category">${study.fields.category || 'Case Study'}</span>
                            <h3>${study.fields.title}</h3>
                            <p class="description">${study.fields.excerpt}</p>
                            <a href="/case-studies/${study.fields.slug}" class="view-project">
                                View Case Study <i class="fas fa-arrow-right"></i>
                            </a>
                        </div>
                    </div>
                `;
                newContent += studyHTML;
            });
            
            // Only update the content if we have new content
            if (newContent) {
                caseStudiesContainer.innerHTML = newContent;
            }
        }
    } catch (error) {
        console.error('Error loading case studies:', error);
        // On error, keep the existing content visible
    }
}

// Load content when page loads
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.portfolio-grid')) {
        loadCaseStudies();
    }
}); 