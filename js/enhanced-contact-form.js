/**
 * Enhanced Contact Form for Digital Marketing Agency
 * Features: Multi-step forms, real-time validation, conversion tracking
 * Optimized for better conversion rates and user experience
 */

class EnhancedContactForm {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 3;
        this.formData = {};
        this.isSubmitting = false;
        this.validationRules = this.setupValidationRules();
        
        this.init();
    }

    init() {
        this.createMultiStepForm();
        this.setupEventListeners();
        this.initializeFormTracking();
    }

    /**
     * Create optimized multi-step contact form
     */
    createMultiStepForm() {
        const contactSection = document.getElementById('contact');
        if (!contactSection) return;

        // Check if enhanced form already exists
        if (contactSection.querySelector('.enhanced-contact-form')) return;

        const enhancedFormHTML = `
            <div class="enhanced-contact-form">
                <div class="form-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 33.33%"></div>
                    </div>
                    <div class="progress-steps">
                        <div class="step active" data-step="1">
                            <i class="fas fa-user"></i>
                            <span>About You</span>
                        </div>
                        <div class="step" data-step="2">
                            <i class="fas fa-building"></i>
                            <span>Your Business</span>
                        </div>
                        <div class="step" data-step="3">
                            <i class="fas fa-bullseye"></i>
                            <span>Your Goals</span>
                        </div>
                    </div>
                </div>

                <form id="enhanced-contact-form" class="multi-step-form">
                    <!-- Step 1: Personal Information -->
                    <div class="form-step active" data-step="1">
                        <h3>Tell us about yourself</h3>
                        <p class="step-description">We'd love to know who we're working with</p>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="firstName">First Name *</label>
                                <input type="text" id="firstName" name="firstName" required 
                                       placeholder="John" autocomplete="given-name">
                                <div class="validation-message"></div>
                            </div>
                            <div class="form-group">
                                <label for="lastName">Last Name *</label>
                                <input type="text" id="lastName" name="lastName" required 
                                       placeholder="Smith" autocomplete="family-name">
                                <div class="validation-message"></div>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="email">Email Address *</label>
                            <input type="email" id="email" name="email" required 
                                   placeholder="john@company.com" autocomplete="email">
                            <div class="validation-message"></div>
                        </div>

                        <div class="form-group">
                            <label for="phone">Phone Number *</label>
                            <input type="tel" id="phone" name="phone" required 
                                   placeholder="(555) 123-4567" autocomplete="tel">
                            <div class="validation-message"></div>
                        </div>
                    </div>

                    <!-- Step 2: Business Information -->
                    <div class="form-step" data-step="2">
                        <h3>About your business</h3>
                        <p class="step-description">Help us understand your company better</p>
                        
                        <div class="form-group">
                            <label for="company">Company Name *</label>
                            <input type="text" id="company" name="company" required 
                                   placeholder="Your Company Inc." autocomplete="organization">
                            <div class="validation-message"></div>
                        </div>

                        <div class="form-group">
                            <label for="website">Website (Optional)</label>
                            <input type="url" id="website" name="website" 
                                   placeholder="https://yourcompany.com" autocomplete="url">
                            <div class="validation-message"></div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="industry">Industry *</label>
                                <select id="industry" name="industry" required>
                                    <option value="">Select Industry</option>
                                    <option value="ecommerce">E-commerce</option>
                                    <option value="saas">SaaS/Technology</option>
                                    <option value="healthcare">Healthcare</option>
                                    <option value="finance">Finance</option>
                                    <option value="realestate">Real Estate</option>
                                    <option value="education">Education</option>
                                    <option value="manufacturing">Manufacturing</option>
                                    <option value="retail">Retail</option>
                                    <option value="professional">Professional Services</option>
                                    <option value="other">Other</option>
                                </select>
                                <div class="validation-message"></div>
                            </div>
                            <div class="form-group">
                                <label for="companySize">Company Size</label>
                                <select id="companySize" name="companySize">
                                    <option value="">Select Size</option>
                                    <option value="1-10">1-10 employees</option>
                                    <option value="11-50">11-50 employees</option>
                                    <option value="51-200">51-200 employees</option>
                                    <option value="201-500">201-500 employees</option>
                                    <option value="500+">500+ employees</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- Step 3: Project Details -->
                    <div class="form-step" data-step="3">
                        <h3>Your marketing goals</h3>
                        <p class="step-description">What would you like to achieve?</p>
                        
                        <div class="form-group">
                            <label>Services you're interested in: *</label>
                            <div class="checkbox-group">
                                <label class="checkbox-item">
                                    <input type="checkbox" name="services" value="ppc">
                                    <span class="checkmark"></span>
                                    PPC Management
                                </label>
                                <label class="checkbox-item">
                                    <input type="checkbox" name="services" value="seo">
                                    <span class="checkmark"></span>
                                    SEO Services
                                </label>
                                <label class="checkbox-item">
                                    <input type="checkbox" name="services" value="social">
                                    <span class="checkmark"></span>
                                    Social Media Marketing
                                </label>
                                <label class="checkbox-item">
                                    <input type="checkbox" name="services" value="web">
                                    <span class="checkmark"></span>
                                    Web Development
                                </label>
                                <label class="checkbox-item">
                                    <input type="checkbox" name="services" value="strategy">
                                    <span class="checkmark"></span>
                                    Digital Strategy
                                </label>
                            </div>
                            <div class="validation-message"></div>
                        </div>

                        <div class="form-group">
                            <label for="budget">Monthly Marketing Budget</label>
                            <select id="budget" name="budget">
                                <option value="">Select Budget Range</option>
                                <option value="under-5k">Under $5,000</option>
                                <option value="5k-10k">$5,000 - $10,000</option>
                                <option value="10k-25k">$10,000 - $25,000</option>
                                <option value="25k-50k">$25,000 - $50,000</option>
                                <option value="50k+">$50,000+</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="timeline">When would you like to start?</label>
                            <select id="timeline" name="timeline">
                                <option value="">Select Timeline</option>
                                <option value="asap">ASAP</option>
                                <option value="1-month">Within 1 month</option>
                                <option value="2-3-months">2-3 months</option>
                                <option value="later">Later this year</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="message">Tell us more about your goals (Optional)</label>
                            <textarea id="message" name="message" rows="4" 
                                      placeholder="What specific results are you looking to achieve? Any challenges you're facing?"></textarea>
                        </div>
                    </div>

                    <!-- Form Navigation -->
                    <div class="form-navigation">
                        <button type="button" class="btn-secondary prev-btn" style="display: none;">
                            <i class="fas fa-arrow-left"></i> Previous
                        </button>
                        <button type="button" class="btn-primary next-btn">
                            Next <i class="fas fa-arrow-right"></i>
                        </button>
                        <button type="submit" class="btn-primary submit-btn" style="display: none;">
                            <i class="fas fa-paper-plane"></i> Send Message
                        </button>
                    </div>

                    <!-- Progress Indicator -->
                    <div class="step-counter">
                        Step <span class="current-step">1</span> of <span class="total-steps">3</span>
                    </div>
                </form>

                <!-- Alternative: Quick Contact Option -->
                <div class="quick-contact-toggle">
                    <button type="button" class="toggle-btn">
                        Prefer a quick form? <span>Click here</span>
                    </button>
                </div>

                <!-- Quick Contact Form (Single Step) -->
                <form id="quick-contact-form" class="quick-form" style="display: none;">
                    <h3>Quick Contact</h3>
                    <div class="form-row">
                        <div class="form-group">
                            <input type="text" name="name" placeholder="Your Name *" required>
                        </div>
                        <div class="form-group">
                            <input type="email" name="email" placeholder="Your Email *" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <textarea name="message" placeholder="How can we help you? *" required rows="3"></textarea>
                    </div>
                    <button type="submit" class="btn-primary">
                        <i class="fas fa-paper-plane"></i> Send Message
                    </button>
                </form>
            </div>
        `;

        // Insert enhanced form into contact section
        const existingForm = contactSection.querySelector('form');
        if (existingForm) {
            existingForm.style.display = 'none';
        }
        
        contactSection.insertAdjacentHTML('beforeend', enhancedFormHTML);
        this.addFormStyles();
    }

    /**
     * Add CSS styles for enhanced form
     */
    addFormStyles() {
        if (document.getElementById('enhanced-form-styles')) return;

        const styles = `
            <style id="enhanced-form-styles">
                .enhanced-contact-form {
                    max-width: 800px;
                    margin: 0 auto;
                    background: rgba(30, 30, 30, 0.95);
                    border-radius: 20px;
                    padding: 40px;
                    border: 1px solid rgba(255, 165, 0, 0.2);
                }

                .form-progress {
                    margin-bottom: 40px;
                }

                .progress-bar {
                    width: 100%;
                    height: 4px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 2px;
                    margin-bottom: 20px;
                }

                .progress-fill {
                    height: 100%;
                    background: linear-gradient(45deg, #FFA500, #FFD700);
                    border-radius: 2px;
                    transition: width 0.3s ease;
                }

                .progress-steps {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .step {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    opacity: 0.5;
                    transition: opacity 0.3s ease;
                }

                .step.active {
                    opacity: 1;
                }

                .step i {
                    font-size: 1.5rem;
                    margin-bottom: 8px;
                    color: #FFA500;
                }

                .step span {
                    font-size: 0.9rem;
                    color: rgba(255, 255, 255, 0.8);
                }

                .form-step {
                    display: none;
                    animation: fadeIn 0.3s ease;
                }

                .form-step.active {
                    display: block;
                }

                .form-step h3 {
                    color: #FFA500;
                    margin-bottom: 10px;
                    font-size: 1.5rem;
                }

                .step-description {
                    color: rgba(255, 255, 255, 0.7);
                    margin-bottom: 30px;
                }

                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                }

                .form-group {
                    margin-bottom: 25px;
                }

                .form-group label {
                    display: block;
                    color: rgba(255, 255, 255, 0.9);
                    margin-bottom: 8px;
                    font-weight: 500;
                }

                .form-group input,
                .form-group select,
                .form-group textarea {
                    width: 100%;
                    padding: 15px;
                    background: rgba(42, 42, 42, 0.8);
                    border: 2px solid rgba(255, 165, 0, 0.2);
                    border-radius: 10px;
                    color: #fff;
                    font-size: 1rem;
                    transition: all 0.3s ease;
                }

                .form-group input:focus,
                .form-group select:focus,
                .form-group textarea:focus {
                    border-color: #FFA500;
                    box-shadow: 0 0 0 3px rgba(255, 165, 0, 0.1);
                    outline: none;
                }

                .checkbox-group {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 15px;
                    margin-top: 10px;
                }

                .checkbox-item {
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    padding: 10px;
                    border-radius: 8px;
                    transition: background 0.3s ease;
                }

                .checkbox-item:hover {
                    background: rgba(255, 165, 0, 0.1);
                }

                .checkbox-item input[type="checkbox"] {
                    margin-right: 10px;
                    width: auto;
                }

                .form-navigation {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 30px;
                    padding-top: 20px;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                }

                .btn-primary, .btn-secondary {
                    padding: 15px 30px;
                    border: none;
                    border-radius: 10px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .btn-primary {
                    background: linear-gradient(45deg, #FFA500, #FFD700);
                    color: #000;
                }

                .btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(255, 165, 0, 0.3);
                }

                .btn-secondary {
                    background: rgba(255, 255, 255, 0.1);
                    color: #fff;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }

                .step-counter {
                    text-align: center;
                    color: rgba(255, 255, 255, 0.6);
                    margin-top: 20px;
                    font-size: 0.9rem;
                }

                .quick-contact-toggle {
                    text-align: center;
                    margin-top: 30px;
                }

                .toggle-btn {
                    background: none;
                    border: none;
                    color: rgba(255, 255, 255, 0.7);
                    cursor: pointer;
                    font-size: 0.9rem;
                    text-decoration: underline;
                }

                .toggle-btn span {
                    color: #FFA500;
                }

                .quick-form {
                    background: rgba(20, 20, 20, 0.8);
                    padding: 30px;
                    border-radius: 15px;
                    margin-top: 20px;
                }

                .validation-message {
                    color: #ff6b6b;
                    font-size: 0.85rem;
                    margin-top: 5px;
                    display: none;
                }

                .validation-message.show {
                    display: block;
                }

                .form-group.error input,
                .form-group.error select,
                .form-group.error textarea {
                    border-color: #ff6b6b;
                }

                .form-group.success input,
                .form-group.success select,
                .form-group.success textarea {
                    border-color: #4CAF50;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateX(20px); }
                    to { opacity: 1; transform: translateX(0); }
                }

                /* Mobile Responsiveness */
                @media (max-width: 768px) {
                    .enhanced-contact-form {
                        padding: 25px;
                        margin: 0 15px;
                    }

                    .form-row {
                        grid-template-columns: 1fr;
                    }

                    .progress-steps {
                        flex-direction: column;
                        gap: 15px;
                    }

                    .step {
                        flex-direction: row;
                        gap: 10px;
                    }

                    .checkbox-group {
                        grid-template-columns: 1fr;
                    }
                }
            </style>
        `;

        document.head.insertAdjacentHTML('beforeend', styles);
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('next-btn')) {
                this.nextStep();
            }
            if (e.target.classList.contains('prev-btn')) {
                this.prevStep();
            }
            if (e.target.classList.contains('toggle-btn')) {
                this.toggleFormType();
            }
        });

        // Form submission listeners
        const enhancedForm = document.getElementById('enhanced-contact-form');
        const quickForm = document.getElementById('quick-contact-form');

        if (enhancedForm) {
            enhancedForm.addEventListener('submit', (e) => this.handleFormSubmit(e, 'multi-step'));
        }
        if (quickForm) {
            quickForm.addEventListener('submit', (e) => this.handleFormSubmit(e, 'quick'));
        }

        // Real-time validation
        this.setupRealTimeValidation();
    }

    /**
     * Setup real-time form validation
     */
    setupRealTimeValidation() {
        const inputs = document.querySelectorAll('#enhanced-contact-form input, #enhanced-contact-form select, #enhanced-contact-form textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', (e) => this.validateField(e.target));
            input.addEventListener('input', (e) => {
                // Clear error state on input
                const formGroup = e.target.closest('.form-group');
                formGroup?.classList.remove('error');
            });
        });
    }

    /**
     * Validate individual field
     */
    validateField(field) {
        const formGroup = field.closest('.form-group');
        const messageEl = formGroup?.querySelector('.validation-message');
        const fieldName = field.name;
        const value = field.value.trim();

        if (!this.validationRules[fieldName]) return true;

        const rule = this.validationRules[fieldName];
        let isValid = true;
        let message = '';

        // Required validation
        if (rule.required && !value) {
            isValid = false;
            message = `${this.getFieldLabel(field)} is required`;
        }
        // Email validation
        else if (fieldName === 'email' && value && !rule.pattern.test(value)) {
            isValid = false;
            message = 'Please enter a valid email address';
        }
        // Phone validation
        else if (fieldName === 'phone' && value && !rule.pattern.test(value)) {
            isValid = false;
            message = 'Please enter a valid phone number';
        }
        // Minimum length
        else if (rule.minLength && value.length < rule.minLength) {
            isValid = false;
            message = `Minimum ${rule.minLength} characters required`;
        }

        // Special validation for services checkboxes
        if (fieldName === 'services') {
            const checkedServices = document.querySelectorAll('input[name="services"]:checked');
            if (checkedServices.length === 0) {
                isValid = false;
                message = 'Please select at least one service';
            }
        }

        this.updateFieldValidation(formGroup, messageEl, isValid, message);
        return isValid;
    }

    /**
     * Update field validation UI
     */
    updateFieldValidation(formGroup, messageEl, isValid, message) {
        if (isValid) {
            formGroup?.classList.remove('error');
            formGroup?.classList.add('success');
            messageEl?.classList.remove('show');
        } else {
            formGroup?.classList.remove('success');
            formGroup?.classList.add('error');
            if (messageEl) {
                messageEl.textContent = message;
                messageEl.classList.add('show');
            }
        }
    }

    /**
     * Get field label text
     */
    getFieldLabel(field) {
        const label = field.closest('.form-group')?.querySelector('label');
        return label?.textContent.replace('*', '').trim() || field.name;
    }

    /**
     * Move to next step
     */
    nextStep() {
        if (!this.validateCurrentStep()) return;

        this.currentStep++;
        this.updateFormStep();
        this.updateProgress();

        // Track step completion
        if (window.conversionTracker) {
            window.conversionTracker.trackEvent('form_step_complete', {
                step: this.currentStep - 1,
                form_type: 'multi-step'
            });
        }
    }

    /**
     * Move to previous step
     */
    prevStep() {
        this.currentStep--;
        this.updateFormStep();
        this.updateProgress();
    }

    /**
     * Validate current step
     */
    validateCurrentStep() {
        const currentStepEl = document.querySelector(`.form-step[data-step="${this.currentStep}"]`);
        const requiredFields = currentStepEl?.querySelectorAll('input[required], select[required]');
        let isValid = true;

        requiredFields?.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        // Special validation for services checkboxes in step 3
        if (this.currentStep === 3) {
            const servicesChecked = document.querySelectorAll('input[name="services"]:checked');
            if (servicesChecked.length === 0) {
                const servicesGroup = document.querySelector('.checkbox-group').closest('.form-group');
                const messageEl = servicesGroup?.querySelector('.validation-message');
                this.updateFieldValidation(servicesGroup, messageEl, false, 'Please select at least one service');
                isValid = false;
            }
        }

        return isValid;
    }

    /**
     * Update form step visibility
     */
    updateFormStep() {
        document.querySelectorAll('.form-step').forEach(step => {
            step.classList.remove('active');
        });
        document.querySelector(`.form-step[data-step="${this.currentStep}"]`)?.classList.add('active');

        document.querySelectorAll('.step').forEach(step => {
            step.classList.remove('active');
        });
        document.querySelector(`.step[data-step="${this.currentStep}"]`)?.classList.add('active');

        // Update navigation buttons
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        const submitBtn = document.querySelector('.submit-btn');

        prevBtn.style.display = this.currentStep > 1 ? 'flex' : 'none';
        nextBtn.style.display = this.currentStep < this.totalSteps ? 'flex' : 'none';
        submitBtn.style.display = this.currentStep === this.totalSteps ? 'flex' : 'none';

        // Update step counter
        document.querySelector('.current-step').textContent = this.currentStep;
    }

    /**
     * Update progress bar
     */
    updateProgress() {
        const progressFill = document.querySelector('.progress-fill');
        const progressPercentage = (this.currentStep / this.totalSteps) * 100;
        progressFill.style.width = `${progressPercentage}%`;
    }

    /**
     * Toggle between multi-step and quick form
     */
    toggleFormType() {
        const multiStepForm = document.querySelector('.multi-step-form').parentElement;
        const quickForm = document.getElementById('quick-contact-form');
        const toggleBtn = document.querySelector('.toggle-btn span');

        if (quickForm.style.display === 'none') {
            multiStepForm.style.display = 'none';
            quickForm.style.display = 'block';
            toggleBtn.textContent = 'Use detailed form instead';

            // Track form type switch
            if (window.conversionTracker) {
                window.conversionTracker.trackEvent('form_type_switch', {
                    from: 'multi-step',
                    to: 'quick'
                });
            }
        } else {
            multiStepForm.style.display = 'block';
            quickForm.style.display = 'none';
            toggleBtn.textContent = 'Click here';

            // Track form type switch
            if (window.conversionTracker) {
                window.conversionTracker.trackEvent('form_type_switch', {
                    from: 'quick',
                    to: 'multi-step'
                });
            }
        }
    }

    /**
     * Handle form submission
     */
    async handleFormSubmit(e, formType) {
        e.preventDefault();
        
        if (this.isSubmitting) return;
        this.isSubmitting = true;

        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        // Update button state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        try {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            // Handle multiple services selection
            if (formType === 'multi-step') {
                const services = Array.from(form.querySelectorAll('input[name="services"]:checked'))
                    .map(cb => cb.value);
                data.services = services;
            }

            // Track form submission
            if (window.conversionTracker) {
                window.conversionTracker.trackEvent('form_submit', {
                    form_type: formType,
                    services: data.services || [],
                    industry: data.industry || '',
                    budget: data.budget || '',
                    value: formType === 'multi-step' ? 200 : 100
                });
            }

            // Send to your backend (replace with actual endpoint)
            const response = await this.submitToBackend(data);

            if (response.success) {
                this.showSuccessMessage(form, formType);
                form.reset();
                
                // Reset multi-step form to step 1
                if (formType === 'multi-step') {
                    this.currentStep = 1;
                    this.updateFormStep();
                    this.updateProgress();
                }
            } else {
                throw new Error(response.message || 'Submission failed');
            }

        } catch (error) {
            this.showErrorMessage(form, error.message);
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            this.isSubmitting = false;
        }
    }

    /**
     * Submit form data to backend
     */
    async submitToBackend(data) {
        // Replace this with your actual form submission logic
        // This could be EmailJS, Netlify Forms, or your own API

        // For demonstration, simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true });
            }, 1000);
        });

        // Example with EmailJS:
        /*
        try {
            const result = await emailjs.send(
                'YOUR_SERVICE_ID',
                'YOUR_TEMPLATE_ID',
                data,
                'YOUR_PUBLIC_KEY'
            );
            return { success: true };
        } catch (error) {
            return { success: false, message: error.text };
        }
        */
    }

    /**
     * Show success message
     */
    showSuccessMessage(form, formType) {
        const message = `
            <div class="success-message">
                <i class="fas fa-check-circle"></i>
                <h3>Message sent successfully!</h3>
                <p>Thank you for contacting us. We'll get back to you within 24 hours.</p>
            </div>
        `;

        form.innerHTML = message;

        // Redirect to thank you page after delay
        setTimeout(() => {
            // You can redirect to a thank you page here
            // window.location.href = '/thank-you.html';
        }, 3000);
    }

    /**
     * Show error message
     */
    showErrorMessage(form, message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <p>Error: ${message}. Please try again.</p>
        `;

        form.insertBefore(errorDiv, form.firstChild);

        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    /**
     * Setup validation rules
     */
    setupValidationRules() {
        return {
            firstName: { required: true, minLength: 2 },
            lastName: { required: true, minLength: 2 },
            email: { 
                required: true, 
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ 
            },
            phone: { 
                required: true, 
                pattern: /^[\+]?[1-9][\d]{0,15}$/ 
            },
            company: { required: true, minLength: 2 },
            industry: { required: true },
            services: { required: true },
            name: { required: true, minLength: 2 },
            message: { required: true, minLength: 10 }
        };
    }

    /**
     * Initialize form tracking integration
     */
    initializeFormTracking() {
        // Track form view
        if (window.conversionTracker) {
            window.conversionTracker.trackEvent('enhanced_form_view', {
                page: window.location.pathname
            });
        }

        // Track form abandonment
        let formInteracted = false;
        document.addEventListener('input', () => {
            if (!formInteracted) {
                formInteracted = true;
                // Track form start
                if (window.conversionTracker) {
                    window.conversionTracker.trackEvent('form_interaction_start', {
                        form_type: 'enhanced'
                    });
                }
            }
        });

        // Track form abandonment on page unload
        window.addEventListener('beforeunload', () => {
            if (formInteracted && !this.isSubmitting) {
                if (window.conversionTracker) {
                    window.conversionTracker.trackEvent('form_abandonment', {
                        step: this.currentStep,
                        form_type: 'enhanced'
                    });
                }
            }
        });
    }
}

// Initialize enhanced contact form when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.enhancedContactForm = new EnhancedContactForm();
});

export default EnhancedContactForm; 