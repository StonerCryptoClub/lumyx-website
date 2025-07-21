// Helper function to format dates
function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const options = { year: 'numeric', month: 'long' };
    return date.toLocaleDateString('en-US', options);
}

// Helper function to render rich text content
function renderRichText(content) {
    if (!content) return '';
    
    return content.content.map(node => {
        switch (node.nodeType) {
            case 'paragraph':
                return `<p>${node.content.map(content => renderTextContent(content)).join('')}</p>`;
            case 'heading-2':
                return `<h2>${node.content.map(content => renderTextContent(content)).join('')}</h2>`;
            case 'heading-3':
                return `<h3>${node.content.map(content => renderTextContent(content)).join('')}</h3>`;
            case 'unordered-list':
                return `<ul>${node.content.map(item => `<li>${item.content.map(content => renderTextContent(content)).join('')}</li>`).join('')}</ul>`;
            case 'ordered-list':
                return `<ol>${node.content.map(item => `<li>${item.content.map(content => renderTextContent(content)).join('')}</li>`).join('')}</ol>`;
            default:
                return '';
        }
    }).join('');
}

function renderTextContent(content) {
    if (content.nodeType === 'text') {
        let text = content.value;
        if (content.marks) {
            content.marks.forEach(mark => {
                switch (mark.type) {
                    case 'bold':
                        text = `<strong>${text}</strong>`;
                        break;
                    case 'italic':
                        text = `<em>${text}</em>`;
                        break;
                    case 'underline':
                        text = `<u>${text}</u>`;
                        break;
                }
            });
        }
        return text;
    }
    if (content.nodeType === 'hyperlink') {
        return `<a href="${content.data.uri}" target="_blank" rel="noopener noreferrer">${content.content.map(c => renderTextContent(c)).join('')}</a>`;
    }
    return '';
}

function renderResults(results) {
    if (!results) return '';
    
    // Handle results as a string with line breaks
    const resultItems = results.split('\n').map(result => {
        const text = result.trim();
        if (!text) return '';
        
        const icon = getResultIcon(text);
        
        return `
            <div class="result-item">
                <i class="${icon}"></i>
                <p>${text}</p>
            </div>
        `;
    }).filter(item => item).join('');

    return resultItems || '<p>No results available</p>';
}

function getResultIcon(text) {
    if (text.toLowerCase().includes('conversion')) return 'fas fa-chart-line';
    if (text.toLowerCase().includes('load') || text.toLowerCase().includes('faster')) return 'fas fa-tachometer-alt';
    if (text.toLowerCase().includes('satisfaction') || text.toLowerCase().includes('user')) return 'fas fa-users';
    return 'fas fa-star';
}

async function loadCaseStudy() {
    const urlParams = new URLSearchParams(window.location.search);
    let slug = urlParams.get('slug');
    
    // Extract slug from URL path if not in query parameters (for npm serve)
    if (!slug) {
        const pathParts = window.location.pathname.split('/');
        if (pathParts.length > 2 && pathParts[1] === 'case-studies') {
            slug = pathParts[2];
        }
    }
    
    if (!slug) {
        console.error('No slug provided');
        showDefaultCaseStudy();
        return;
    }
    
    const contentContainer = document.querySelector('.case-study-content');
    if (!contentContainer) {
        console.error('Content container not found');
        return;
    }
    
    try {
        contentContainer.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading case study...</div>';
        
        console.log('Loading case study with slug:', slug);
        
        // Wait for Contentful to be ready (up to 5 seconds)
        const contentfulReady = await waitForContentful(10);
        console.log('Contentful ready status:', contentfulReady);
        
        // Try to get case study from Contentful
        let study = null;
        
        if (contentfulReady && window.contentfulHelpers) {
            try {
        // Try both the provided slug and without hyphens (to match Contentful)
                study = await window.contentfulHelpers.getCaseStudyBySlug(slug);
                console.log('Case study from Contentful:', study);
                
        if (!study && slug.includes('-')) {
            study = await window.contentfulHelpers.getCaseStudyBySlug(slug.replace(/-/g, ''));
                    console.log('Case study from Contentful (without hyphens):', study);
                }
            } catch (contentfulError) {
                console.error('Error fetching from Contentful:', contentfulError);
            }
        }
        
        // If no study from Contentful, try to use a placeholder
        if (!study) {
            console.log('No case study found in Contentful, trying placeholders');
            
            // Try global placeholders first
            if (window.PLACEHOLDER_CASE_STUDIES) {
                study = window.PLACEHOLDER_CASE_STUDIES.find(p => p.fields.slug === slug);
                console.log('Found in global placeholders:', !!study);
            }
            
            // Try contentful helpers placeholders
            if (!study && window.contentfulHelpers?.getPlaceholders) {
                const placeholders = window.contentfulHelpers.getPlaceholders();
                study = placeholders.find(p => p.fields.slug === slug);
                console.log('Found in contentfulHelpers placeholders:', !!study);
        }
        
            // If still no study, use hardcoded default
            if (!study) {
                console.log('Using default hardcoded case study');
                study = {
                    fields: {
                        title: "Meta Ads Scaling Success",
                        category: "Digital Marketing",
                        excerpt: "Strategic scaling of Meta ad campaigns resulting in 3x ROAS improvement and 150% increase in qualified leads for an e-commerce brand.",
                        clientName: "E-commerce Brand",
                        projectDate: "2024-01-15",
                        results: "350% ROAS improvement<br>150% increase in qualified leads<br>60% lower cost per acquisition<br>6-month campaign"
                    }
                };
            }
        }
        
        console.log('Final case study to render:', study);
        
        if (!study || !study.fields) {
            throw new Error('No valid case study data found');
        }
        
        const { title, category, excerpt, clientName, projectDate, featuredImage, content, results } = study.fields;
        
        const formattedDate = formatDate(projectDate || new Date().toISOString());
        
        // Get the image URL from Contentful's asset
        const imageUrl = featuredImage?.fields?.file?.url
            ? 'https:' + featuredImage.fields.file.url
            : null;
        
        // Split results by <br> tags and clean up
        const resultsList = results ? results.split('<br>').map(r => r.trim()).filter(r => r) : [
            "Increased conversion rate by 150%",
            "Reduced bounce rate by 60%",
            "Improved page load times by 40%"
        ];
        
        const html = `
            <nav class="breadcrumb">
                <a href="/">Home</a> /
                <a href="/#portfolio">Case Studies</a> /
                <span>${title || 'Case Study'}</span>
            </nav>
            
            <div class="case-study-header">
                <h1>${title || 'Case Study Example'}</h1>
                <div class="case-study-meta">
                    <span class="category">${category || 'Digital Marketing'}</span>
                    <span class="client">Client: ${clientName || 'Sample Client'}</span>
                    <span class="date">Completed: ${formattedDate}</span>
                </div>
                <p class="excerpt">${excerpt || 'This is an example case study showcasing our work.'}</p>
            </div>
            
            ${imageUrl ? `
                <div class="case-study-image">
                    <img src="${imageUrl}" alt="${title}" />
                </div>
            ` : `
                <div class="case-study-image">
                    <div class="placeholder-image" style="background: linear-gradient(45deg, #FFA500, #FFD700); height: 400px; display: flex; align-items: center; justify-content: center;">
                        <i class="fas fa-image" style="font-size: 5rem; color: rgba(255,255,255,0.3);"></i>
                    </div>
                </div>
            `}
            
            <div class="case-study-body">
                ${content ? renderRichText(content) : `
                    <h2>The Challenge</h2>
                    <p>Our client faced significant challenges in their digital marketing efforts, with low conversion rates and poor customer engagement.</p>
                    
                    <h2>Our Approach</h2>
                    <p>We implemented a comprehensive strategy that included:</p>
                    <ul>
                        <li>In-depth audience analysis</li>
                        <li>Competitive research</li>
                        <li>Custom content strategy</li>
                        <li>Optimization of all digital assets</li>
                    </ul>
                    
                    <h2>The Solution</h2>
                    <p>Based on our research, we developed a tailored solution that addressed all key pain points and leveraged industry best practices.</p>
                `}
                <div class="results-section">
                    <h2>Key Results</h2>
                    <div class="results-grid">
                        ${resultsList.map(result => {
                            const icon = getResultIcon(result);
                            return `
                                <div class="result-item">
                                    <i class="${icon}"></i>
                                    <p>${result}</p>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
        `;
        
        contentContainer.innerHTML = html;
        
    } catch (error) {
        console.error('Error loading case study:', error);
        showDefaultCaseStudy();
    }
}

// Helper function to wait for Contentful to initialize
async function waitForContentful(maxAttempts = 10) {
    console.log('Waiting for Contentful to be ready...');
    
    // First check if it's already ready
    if (window.contentfulHelpers?.isReady && window.contentfulHelpers.isReady()) {
        console.log('Contentful is already ready');
        return true;
    }
    
    for (let i = 0; i < maxAttempts; i++) {
        console.log(`Waiting for Contentful attempt ${i+1}/${maxAttempts}`);
        
        if (window.contentfulHelpers?.isReady && window.contentfulHelpers.isReady()) {
            console.log('Contentful is now ready');
            return true;
        }
        
        // Wait 500ms between attempts
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.warn('Contentful client not ready after maximum attempts');
    return false;
}

// Show a default case study when no slug is provided or on error
function showDefaultCaseStudy() {
    const contentContainer = document.querySelector('.case-study-content');
    if (!contentContainer) return;
    
        contentContainer.innerHTML = `
        <nav class="breadcrumb">
            <a href="/">Home</a> /
            <a href="/#portfolio">Case Studies</a> /
            <span>Sample Case Study</span>
        </nav>
        
        <div class="case-study-header">
            <h1>Digital Marketing Campaign</h1>
            <div class="case-study-meta">
                <span class="category">Digital Marketing</span>
                <span class="client">Client: E-commerce Brand</span>
                <span class="date">Completed: January 2024</span>
            </div>
            <p class="excerpt">A comprehensive digital marketing strategy that increased conversions by 150% and improved ROI by 3x.</p>
        </div>
        
        <div class="case-study-image">
            <div class="placeholder-image" style="background: linear-gradient(45deg, #1E90FF, #00CED1); height: 400px; display: flex; align-items: center; justify-content: center;">
                <i class="fas fa-chart-line" style="font-size: 5rem; color: rgba(255,255,255,0.3);"></i>
            </div>
        </div>
        
        <div class="case-study-body">
            <h2>The Challenge</h2>
            <p>Our client, a growing e-commerce brand, was struggling to cut through the noise in a competitive market. Their existing digital marketing efforts were yielding subpar results with high customer acquisition costs and low conversion rates.</p>
            
            <h2>Our Approach</h2>
            <p>We implemented a comprehensive strategy that included:</p>
            <ul>
                <li>In-depth audience analysis and segmentation</li>
                <li>Competitive research and positioning strategy</li>
                <li>Custom content strategy aligned with customer journey</li>
                <li>Optimization of ad creative and landing pages</li>
                <li>Advanced tracking and attribution setup</li>
            </ul>
            
            <h2>The Solution</h2>
            <p>Based on our research, we developed a multi-channel approach focusing on high-intent audiences. We created personalized messaging for each segment and implemented a sophisticated testing framework to continuously optimize performance.</p>
            
            <div class="results-section">
                <h2>Key Results</h2>
                <div class="results-grid">
                    <div class="result-item">
                        <i class="fas fa-chart-line"></i>
                        <p>150% increase in conversion rate</p>
                    </div>
                    <div class="result-item">
                        <i class="fas fa-dollar-sign"></i>
                        <p>3x improvement in ROAS</p>
                    </div>
                    <div class="result-item">
                        <i class="fas fa-users"></i>
                        <p>40% reduction in customer acquisition cost</p>
                    </div>
                    <div class="result-item">
                        <i class="fas fa-shopping-cart"></i>
                        <p>65% increase in average order value</p>
                    </div>
                </div>
            </div>
            </div>
        `;
}

// Load case study when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(loadCaseStudy, 100); // Small delay to ensure Contentful client is ready
}); 