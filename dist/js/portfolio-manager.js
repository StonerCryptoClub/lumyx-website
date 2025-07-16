class PortfolioManager {
    constructor() {
        console.log('PortfolioManager: Constructor called');
        this.portfolioGrid = document.querySelector('.modern-portfolio-grid') || document.querySelector('.portfolio-grid');
        console.log('PortfolioManager: Portfolio grid element found:', !!this.portfolioGrid);
        this.filterButtons = document.querySelectorAll('.modern-filter-btn, .filter-btn');
        console.log('PortfolioManager: Filter buttons found:', this.filterButtons.length);
        this.currentFilter = 'all';
        this.studies = [];
        this.initialized = false;
        this.contentfulClient = window.contentfulClient;
        this.contentfulHelpers = window.contentfulHelpers;
        this.currentPage = 0;
        this.itemsPerPage = 3;

        // Mobile Navigation Elements
        this.mobileNavToggle = document.querySelector('.mobile-nav-toggle');
        this.mobileNav = document.querySelector('.mobile-nav');
        this.mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
        this.mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

        this.setupMobileNavigation();
        this.setupMobileSectionNavigation();
        this.init();
    }

    setupMobileNavigation() {
        if (!this.mobileNavToggle) return;

        // Toggle mobile menu
        this.mobileNavToggle.addEventListener('click', () => {
            document.body.classList.toggle('mobile-nav-open');
            this.mobileNav.classList.toggle('active');
            this.mobileNavOverlay.classList.toggle('active');
        });

        // Close menu when clicking overlay
        this.mobileNavOverlay?.addEventListener('click', () => {
            this.closeMobileMenu();
        });

        // Close menu when clicking links
        this.mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMobileMenu();
            }
        });
    }

    closeMobileMenu() {
        document.body.classList.remove('mobile-nav-open');
        this.mobileNav?.classList.remove('active');
        this.mobileNavOverlay?.classList.remove('active');
    }

    setupMobileSectionNavigation() {
        // Values section navigation
        this.setupSectionNavigation('.values-container', '.values-grid', '.values-nav');
        
        // Services section navigation
        this.setupSectionNavigation('.services-container', '.services-grid', '.services-nav');
    }

    setupSectionNavigation(containerSelector, gridSelector, navSelector) {
        const container = document.querySelector(containerSelector);
        if (!container) return;

        const grid = container.querySelector(gridSelector);
        const nav = container.querySelector(navSelector);
        if (!grid || !nav) return;

        const prevBtn = nav.querySelector('.prev');
        const nextBtn = nav.querySelector('.next');
        if (!prevBtn || !nextBtn) return;

        let currentIndex = 0;
        const items = grid.children;
        const itemWidth = 350; // Max width of cards
        const maxIndex = Math.max(0, items.length - 1);

        const updateNavigation = () => {
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex >= maxIndex;
            
            grid.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
        };

        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateNavigation();
            }
        });

        nextBtn.addEventListener('click', () => {
            if (currentIndex < maxIndex) {
                currentIndex++;
                updateNavigation();
            }
        });

        // Initial state
        updateNavigation();

        // Handle touch events for swipe
        let touchStartX = 0;
        let touchEndX = 0;

        container.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, false);

        container.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, false);

        const handleSwipe = () => {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) < swipeThreshold) return;

            if (diff > 0 && currentIndex < maxIndex) {
                // Swipe left
                currentIndex++;
                updateNavigation();
            } else if (diff < 0 && currentIndex > 0) {
                // Swipe right
                currentIndex--;
                updateNavigation();
            }
        };
    }

    async init() {
        if (!this.portfolioGrid) {
            console.error('Portfolio grid element not found');
            return;
        }

        this.showLoadingMessage();

        try {
            // Wait for contentful helpers to be ready
            await this.waitForContentful(10);
            
            // Use placeholder fallback if Contentful API fails
            let studies = [];
            try {
                studies = await this.contentfulHelpers.getCaseStudies();
                console.log('Successfully loaded case studies:', studies.length);
            } catch (error) {
                console.error('Error loading case studies from Contentful:', error);
                // Fall back to placeholders
                studies = window.PLACEHOLDER_CASE_STUDIES || [];
                console.log('Using placeholder case studies instead:', studies.length);
            }
            
            if (!studies || studies.length === 0) {
                // If still no studies, use hardcoded fallback
                studies = [
                    {
                        fields: {
                            title: "Meta Ads Scaling Success",
                            category: "Digital Marketing",
                            excerpt: "Scaled ad campaigns across Meta platforms achieving 350% ROAS and 2.5x customer acquisition rate.",
                            slug: "meta-ads-scaling",
                            clientName: "E-commerce Brand",
                            projectDate: "2024-01-15"
                        }
                    },
                    {
                        fields: {
                            title: "E-commerce Conversion Rate Optimization",
                            category: "CRO & Funnel",
                            excerpt: "Complete funnel optimization resulting in 85% higher conversion rates and 40% lower cart abandonment.",
                            slug: "ecommerce-cro",
                            clientName: "Fashion Retailer",
                            projectDate: "2023-11-10"
                        }
                    },
                    {
                        fields: {
                            title: "SaaS Content Strategy",
                            category: "SEO & Content",
                            excerpt: "Comprehensive SEO and content strategy that grew organic traffic by 200% in 6 months.",
                            slug: "saas-content-strategy",
                            clientName: "B2B SaaS Platform",
                            projectDate: "2023-09-22"
                        }
                    }
                ];
            }
            
            this.renderCaseStudies(studies);
        } catch (error) {
            console.error('Error loading case studies:', error);
            this.showErrorMessage();
        }
    }

    showLoadingMessage() {
        this.portfolioGrid.innerHTML = `
            <div class="loading-message">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading case studies...</p>
            </div>
        `;
    }

    showErrorMessage() {
        this.portfolioGrid.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>Failed to load case studies. Please try again later.</p>
            </div>
        `;
    }

    renderCaseStudies(studies) {
        if (!studies || studies.length === 0) {
            this.portfolioGrid.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-folder-open"></i>
                    <p>No case studies found.</p>
                </div>
            `;
            return;
        }

        const html = studies.map(study => {
            const {
                title = 'Untitled Project',
                category = 'Case Study',
                excerpt = 'No description available',
                slug,
                featuredImage
            } = study.fields || {};

            const imageHtml = featuredImage?.fields?.file?.url
                ? `<img src="${featuredImage.fields.file.url}" alt="${title}" class="portfolio-image">`
                : this.generatePlaceholderSVG(category);

            return `
                <article class="portfolio-item">
                    <div class="portfolio-content">
                        <div class="portfolio-image-wrapper">
                            ${imageHtml}
                        </div>
                        <div class="portfolio-info">
                            <span class="category">${category}</span>
                            <h3 class="title">${title}</h3>
                            <p class="description">${excerpt}</p>
                            <a href="/case-study.html?slug=${slug}" class="view-project">
                                View Project <i class="fas fa-arrow-right"></i>
                            </a>
                        </div>
                    </div>
                </article>
            `;
        }).join('');

        this.portfolioGrid.innerHTML = html;
    }

    generatePlaceholderSVG(category) {
        const colors = {
            'Web Development': ['#FF6B6B', '#4ECDC4'],
            'Digital Marketing': ['#A8E6CF', '#FFD3B6'],
            'Branding': ['#FFD93D', '#FF6B6B'],
            'UI/UX Design': ['#6C5CE7', '#A8E6CF'],
            default: ['#FFA500', '#FF6B6B']
        };

        const [color1, color2] = colors[category] || colors.default;

        return `
            <svg class="portfolio-image placeholder" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="grad-${category}" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
                        <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
                    </linearGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#grad-${category})" />
                <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
                      fill="white" font-family="Arial" font-size="24">
                    ${category}
                </text>
            </svg>
        `;
    }

    async initialize() {
        console.log('PortfolioManager: Initializing...');
        if (this.initialized) {
            console.log('PortfolioManager: Already initialized');
            return;
        }
        
        if (!this.portfolioGrid) {
            console.error('PortfolioManager: No portfolio grid found, cannot initialize');
            return;
        }

        try {
            // Wait for Contentful to be ready
            console.log('PortfolioManager: Waiting for Contentful...');
            await this.waitForContentful();
            
            // Set up event listeners
            console.log('PortfolioManager: Setting up event listeners...');
            this.setupEventListeners();
            
            // Load initial content
            console.log('PortfolioManager: Loading initial content...');
            await this.loadContent();
            
            this.initialized = true;
            console.log('PortfolioManager: Initialization complete');
        } catch (error) {
            console.error('PortfolioManager: Initialization failed:', error);
            // Show error in the grid
            this.showErrorMessage(error);
        }
    }

    async waitForContentful(maxAttempts = 10) {
        for (let i = 0; i < maxAttempts; i++) {
            if (window.contentfulHelpers?.isReady && window.contentfulHelpers.isReady()) {
                return true;
            }
            await new Promise(resolve => setTimeout(resolve, 300));
        }
        console.warn('Contentful client not ready after waiting');
        return false;
    }

    setupEventListeners() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active class from all buttons
                this.filterButtons.forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // Add active class to clicked button
                button.classList.add('active');
                
                // Handle the filter
                this.handleFilter(button.dataset.filter || button.getAttribute('data-filter'));
            });
        });
    }

    async loadContent() {
        if (!this.portfolioGrid) {
            console.error('Portfolio grid not found');
            return;
        }

        try {
            // Show loading state
            this.showLoadingMessage();

            // First try to get real content
            console.log('Fetching case studies...');
            const studies = await window.contentfulHelpers.getCaseStudies();
            
            if (Array.isArray(studies) && studies.length > 0) {
                console.log('Loaded', studies.length, 'case studies');
                this.studies = studies;
            } else {
                console.log('No real case studies found, using placeholders');
                this.studies = window.contentfulHelpers.getPlaceholders();
            }

            // Render the content
            this.renderContent();

        } catch (error) {
            console.error('Error loading content:', error);
            // Fall back to placeholders
            this.studies = window.contentfulHelpers.getPlaceholders();
            this.renderContent();
        }
    }

    renderContent() {
        let filteredStudies = this.currentFilter === 'all'
            ? this.studies
            : this.studies.filter(study => 
                study.fields?.category?.toLowerCase() === this.currentFilter.toLowerCase()
            );

        // If no real studies or filtered results are empty, show placeholders
        if (!filteredStudies || filteredStudies.length === 0) {
            const placeholders = PLACEHOLDER_CASE_STUDIES.filter(study => 
                this.currentFilter === 'all' || study.category.toLowerCase() === this.currentFilter.toLowerCase()
            );

            if (placeholders.length === 0) {
                this.portfolioGrid.innerHTML = this.getEmptyStateHTML();
                return;
            }

            this.renderItems(placeholders, true);
            return;
        }

        this.renderItems(filteredStudies, false);
    }

    renderItems(items, isPlaceholder) {
        // Create container for cards and navigation
        const gridHTML = `
            <div class="portfolio-grid-inner ${items.length > 3 ? 'scrollable' : ''} items-${Math.min(items.length, 3)}">
                ${items.map(study => 
                    isPlaceholder ? this.createPlaceholderCard(study) : this.createCaseStudyCard(study)
                ).join('')}
            </div>
            ${items.length > 3 ? `
                <div class="portfolio-nav">
                    <button class="nav-button prev" aria-label="Previous items">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <button class="nav-button next" aria-label="Next items">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            ` : ''}
        `;

        this.portfolioGrid.innerHTML = gridHTML;

        // Set up navigation if needed
        if (items.length > 3) {
            this.setupNavigation();
        }
    }

    setupNavigation() {
        const gridInner = this.portfolioGrid.querySelector('.portfolio-grid-inner');
        const prevBtn = this.portfolioGrid.querySelector('.nav-button.prev');
        const nextBtn = this.portfolioGrid.querySelector('.nav-button.next');
        
        if (!gridInner || !prevBtn || !nextBtn) return;

        let currentPosition = 0;
        const itemWidth = 380 + 32; // Card width (380px) + gap (32px)
        const maxPosition = Math.max(0, Math.ceil(gridInner.children.length - 3)) * itemWidth;

        // Initial button state
        prevBtn.disabled = true;
        nextBtn.disabled = gridInner.children.length <= 3;

        const updateNavigation = () => {
            prevBtn.disabled = currentPosition === 0;
            nextBtn.disabled = currentPosition >= maxPosition;
            
            // Add transition class for smooth animation
            gridInner.style.transform = `translateX(-${currentPosition}px)`;
        };

        prevBtn.addEventListener('click', () => {
            currentPosition = Math.max(currentPosition - itemWidth, 0);
            updateNavigation();
        });

        nextBtn.addEventListener('click', () => {
            currentPosition = Math.min(currentPosition + itemWidth, maxPosition);
            updateNavigation();
        });
    }

    createCaseStudyCard(study) {
        const fields = study.fields || {};
        const imageUrl = fields.featuredImage?.fields?.file?.url 
            ? 'https:' + fields.featuredImage.fields.file.url
            : null;

        return `
            <article class="portfolio-item" data-category="${fields.category || 'Case Study'}">
                <div class="portfolio-image-wrapper">
                    ${imageUrl 
                        ? `<img src="${imageUrl}" alt="${fields.title}" class="portfolio-image" loading="lazy">` 
                        : this.createPlaceholderImage(fields.category)}
                </div>
                <div class="portfolio-content">
                    <span class="category">${fields.category || 'Case Study'}</span>
                    <h3 class="title">${fields.title || 'Untitled Project'}</h3>
                    <p class="description">${fields.excerpt || 'No description available.'}</p>
                    <a href="/case-study.html?slug=${fields.slug || ''}" class="view-project">
                        View Case Study <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </article>
        `;
    }

    createPlaceholderCard(study) {
        const categoryColors = {
            'Web Development': ['#6366F1', '#2563EB'],
            'Digital Marketing': ['#1877F2', '#45B6FE'],
            'Social Media': ['#FF0050', '#FF6B6B']
        };

        const [color1, color2] = categoryColors[study.category] || ['#ff6b00', '#ff9500'];
        const gradientStyle = `background:linear-gradient(45deg, ${color1}, ${color2})`;

        return `
            <article class="portfolio-item placeholder-card">
                <div class="portfolio-image-wrapper" style="${gradientStyle}">
                    ${study.category === 'Web Development' ? `
                        <img src="images/portfolio/web-dev-placeholder.svg" alt="${study.title}" class="portfolio-image">
                    ` : study.category === 'Digital Marketing' ? `
                        <img src="images/portfolio/marketing-placeholder.svg" alt="${study.title}" class="portfolio-image">
                    ` : `
                        <img src="images/portfolio/social-placeholder.svg" alt="${study.title}" class="portfolio-image">
                    `}
                    <i class="fas fa-${study.icon} placeholder-icon"></i>
                </div>
                <div class="portfolio-content">
                    <span class="category">${study.category}</span>
                    <h3 class="title">${study.title}</h3>
                    <p class="description">${study.excerpt}</p>
                    <span class="view-project">
                        Coming Soon <i class="fas fa-clock"></i>
                    </span>
                </div>
            </article>
        `;
    }

    createPlaceholderImage(category) {
        const icons = {
            'Web Development': 'code',
            'Digital Marketing': 'chart-line',
            'Social Media': 'share-alt',
            'Branding': 'paint-brush',
            'UI/UX Design': 'pencil-ruler'
        };

        const icon = icons[category] || 'star';
        
        return `
            <div class="placeholder-image">
                <i class="fas fa-${icon} placeholder-icon"></i>
            </div>
        `;
    }

    getEmptyStateHTML() {
        return `
            <div class="empty-state">
                <i class="fas fa-folder-open empty-state-icon"></i>
                <p class="empty-state-text">No case studies found in this category.</p>
            </div>
        `;
    }

    getResultIcon(text) {
        const icons = {
            'roas': '📈',
            'roi': '📈',
            '%': '📈',
            'month': '⏱️',
            'day': '⏱️',
            'lead': '👥',
            'customer': '👥',
            'campaign': '🚀',
            'recognition': '⭐',
            'brand': '⭐',
            'view': '👀',
            'follower': '🎯'
        };

        const match = Object.entries(icons).find(([key]) => 
            text.toLowerCase().includes(key.toLowerCase())
        );

        return match ? match[1] : '📊';
    }

    extractRichTextResults(richText) {
        if (!richText?.content) return [];
        
        return richText.content
            .filter(node => node.nodeType === 'ordered-list' || node.nodeType === 'unordered-list')
            .flatMap(list => list.content)
            .filter(item => item.nodeType === 'list-item')
            .map(item => item.content
                .filter(content => content.nodeType === 'paragraph')
                .flatMap(para => para.content)
                .filter(content => content.nodeType === 'text')
                .map(text => text.value)
                .join('')
            );
    }

    handleFilter(filter) {
        this.currentFilter = filter;
        console.log('Filtering by:', filter);
        
        // Update active button state
        this.filterButtons.forEach(button => {
            const buttonFilter = button.dataset.filter || button.getAttribute('data-filter');
            button.classList.toggle('active', buttonFilter === filter);
        });
        
        this.renderContent();
    }
}

class CardManager {
    constructor() {
        this.initializeValues();
        this.initializeServices();
    }

    initializeValues() {
        this.valueCards = Array.from(document.querySelectorAll('.value-card'));
        if (!this.valueCards.length) return;

        this.currentValueIndex = 0;
        this.valueRotationInterval = 4000; // 4 seconds
        
        // Set initial active card
        this.updateValueCards();
        
        // Start auto-rotation
        this.startValueRotation();
    }

    initializeServices() {
        this.serviceCards = Array.from(document.querySelectorAll('.service-card'));
        if (!this.serviceCards.length) return;

        this.currentServiceIndex = 0;
        
        // Remove any existing navigation elements
        const existingNav = document.querySelector('.services-nav');
        if (existingNav) {
            existingNav.remove();
        }
        
        const existingDots = document.querySelector('.progress-dots');
        if (existingDots) {
            existingDots.remove();
        }
        
        // Disable navigation creation
        // this.createServiceNavigation();
        
        // Set initial active card
        this.updateServiceCards();
    }

    createServiceNavigation() {
        // Disable service navigation arrows
        return; // Skip creating navigation arrows
        
        // Original code below is now skipped
        const servicesGrid = document.querySelector('.services-grid');
        if (!servicesGrid) return;

        // Create navigation container
        const nav = document.createElement('div');
        nav.className = 'services-nav';
        
        // Create buttons
        const prevBtn = document.createElement('button');
        prevBtn.className = 'nav-button prev';
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevBtn.addEventListener('click', () => this.previousService());

        const nextBtn = document.createElement('button');
        nextBtn.className = 'nav-button next';
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextBtn.addEventListener('click', () => this.nextService());

        nav.appendChild(prevBtn);
        nav.appendChild(nextBtn);

        // Create progress dots
        const dots = document.createElement('div');
        dots.className = 'progress-dots';
        
        this.serviceCards.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = `dot ${index === 0 ? 'active' : ''}`;
            dots.appendChild(dot);
        });

        // Add navigation to grid
        servicesGrid.appendChild(nav);
        servicesGrid.appendChild(dots);
    }

    startValueRotation() {
        this.valueRotationTimer = setInterval(() => {
            this.nextValue();
        }, this.valueRotationInterval);
    }

    stopValueRotation() {
        if (this.valueRotationTimer) {
            clearInterval(this.valueRotationTimer);
        }
    }

    nextValue() {
        this.currentValueIndex = (this.currentValueIndex + 1) % this.valueCards.length;
        this.updateValueCards();
    }

    updateValueCards() {
        this.valueCards.forEach((card, index) => {
            card.classList.remove('active', 'previous');
            if (index === this.currentValueIndex) {
                card.classList.add('active');
            } else if (index === (this.currentValueIndex - 1 + this.valueCards.length) % this.valueCards.length) {
                card.classList.add('previous');
            }
        });
    }

    previousService() {
        if (this.currentServiceIndex > 0) {
            this.currentServiceIndex--;
            this.updateServiceCards();
        }
    }

    nextService() {
        if (this.currentServiceIndex < this.serviceCards.length - 1) {
            this.currentServiceIndex++;
            this.updateServiceCards();
        }
    }

    updateServiceCards() {
        // Update cards
        this.serviceCards.forEach((card, index) => {
            card.classList.remove('active', 'previous');
            if (index === this.currentServiceIndex) {
                card.classList.add('active');
            } else if (index === this.currentServiceIndex - 1) {
                card.classList.add('previous');
            }
        });

        // Remove navigation updates since the elements don't exist anymore
        // const prevBtn = document.querySelector('.services-nav .prev');
        // const nextBtn = document.querySelector('.services-nav .next');
        // if (prevBtn) prevBtn.disabled = this.currentServiceIndex === 0;
        // if (nextBtn) nextBtn.disabled = this.currentServiceIndex === this.serviceCards.length - 1;

        // Remove dots updates since the elements don't exist anymore
        // const dots = document.querySelectorAll('.progress-dots .dot');
        // dots.forEach((dot, index) => {
        //     dot.classList.toggle('active', index === this.currentServiceIndex);
        // });
    }
}

// Initialize when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const portfolioManager = new PortfolioManager();
    portfolioManager.initialize().catch(error => {
        console.error('Failed to initialize portfolio:', error);
    });

    // Initialize card manager for values and services
    const cardManager = new CardManager();
});

// Add this to your placeholders array at the top of the file
const PLACEHOLDER_CASE_STUDIES = [
    {
        title: "Meta Ads Scaling Success",
        category: "Ad Campaigns",
        excerpt: "Scaled ad campaigns across Meta platforms achieving 350% ROAS and 2.5x customer acquisition rate.",
        slug: "meta-ads-scaling",
        icon: "chart-line"
    },
    {
        title: "E-commerce Conversion Rate Optimization",
        category: "CRO & Funnel",
        excerpt: "Complete funnel optimization resulting in 85% higher conversion rates and 40% lower cart abandonment.",
        slug: "ecommerce-cro",
        icon: "funnel-dollar"
    },
    {
        title: "SaaS Content Strategy",
        category: "SEO & Content Strategy",
        excerpt: "Comprehensive SEO and content strategy that grew organic traffic by 200% in 6 months.",
        slug: "saas-content-strategy",
        icon: "search"
    }
]; 