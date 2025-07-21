/**
 * Google Tag Manager Configuration for Lumyx Digital Marketing Agency
 * Complete setup guide and trigger configurations
 */

const GTMConfig = {
    // Replace these with your actual IDs
    GTM_ID: 'GTM-XXXXXXX',
    GA4_ID: 'G-YOUR_GA4_ID',
    FB_PIXEL_ID: '1361608738369835',
    LINKEDIN_PARTNER_ID: 'YOUR_LINKEDIN_ID',

    /**
     * GTM Variables Configuration
     * Add these variables in your GTM container
     */
    variables: {
        // Built-in Variables (Enable these in GTM)
        builtIn: [
            'Page URL',
            'Page Path',
            'Page Hostname',
            'Referrer',
            'Click Element',
            'Click Classes',
            'Click ID',
            'Click Target',
            'Click Text',
            'Click URL',
            'Form Element',
            'Form Classes',
            'Form ID',
            'Form Target',
            'Scroll Depth Threshold',
            'Scroll Depth Units',
            'Video Duration',
            'Video Percent',
            'Video Status',
            'Video Title',
            'Video URL'
        ],

        // Custom Variables to create in GTM
        custom: [
            {
                name: 'GA4 Measurement ID',
                type: 'Constant',
                value: 'G-YOUR_GA4_ID'
            },
            {
                name: 'Facebook Pixel ID',
                type: 'Constant',
                value: '1361608738369835'
            },
            {
                name: 'LinkedIn Partner ID',
                type: 'Constant',
                value: 'YOUR_LINKEDIN_ID'
            },
            {
                name: 'Phone Number',
                type: 'Data Layer Variable',
                dataLayerVariable: 'phone_number'
            },
            {
                name: 'Email Address',
                type: 'Data Layer Variable',
                dataLayerVariable: 'email'
            },
            {
                name: 'Form Name',
                type: 'Data Layer Variable',
                dataLayerVariable: 'form_name'
            },
            {
                name: 'Service Type',
                type: 'Data Layer Variable',
                dataLayerVariable: 'service'
            },
            {
                name: 'Conversion Value',
                type: 'Data Layer Variable',
                dataLayerVariable: 'value'
            },
            {
                name: 'Button Text',
                type: 'Data Layer Variable',
                dataLayerVariable: 'button_text'
            },
            {
                name: 'Scroll Depth',
                type: 'Data Layer Variable',
                dataLayerVariable: 'scroll_depth'
            }
        ]
    },

    /**
     * GTM Triggers Configuration
     * Create these triggers in your GTM container
     */
    triggers: [
        {
            name: 'All Pages',
            type: 'Page View',
            conditions: 'Page URL matches RegEx .*'
        },
        {
            name: 'Contact Form Submission',
            type: 'Custom Event',
            eventName: 'form_submit',
            conditions: 'Event equals form_submit'
        },
        {
            name: 'Newsletter Signup',
            type: 'Custom Event', 
            eventName: 'newsletter_signup',
            conditions: 'Event equals newsletter_signup'
        },
        {
            name: 'Calendly Booking',
            type: 'Custom Event',
            eventName: 'calendly_booking',
            conditions: 'Event equals calendly_booking'
        },
        {
            name: 'Phone Click',
            type: 'Custom Event',
            eventName: 'phone_click',
            conditions: 'Event equals phone_click'
        },
        {
            name: 'Email Click',
            type: 'Custom Event',
            eventName: 'email_click',
            conditions: 'Event equals email_click'
        },
        {
            name: 'CTA Button Click',
            type: 'Custom Event',
            eventName: 'cta_click',
            conditions: 'Event equals cta_click'
        },
        {
            name: 'Service Page View',
            type: 'Custom Event',
            eventName: 'service_page_view',
            conditions: 'Event equals service_page_view'
        },
        {
            name: 'Scroll Depth - 25%',
            type: 'Custom Event',
            eventName: 'scroll_depth',
            conditions: 'Event equals scroll_depth AND scroll_depth equals 25'
        },
        {
            name: 'Scroll Depth - 50%',
            type: 'Custom Event',
            eventName: 'scroll_depth',
            conditions: 'Event equals scroll_depth AND scroll_depth equals 50'
        },
        {
            name: 'Scroll Depth - 75%',
            type: 'Custom Event',
            eventName: 'scroll_depth',
            conditions: 'Event equals scroll_depth AND scroll_depth equals 75'
        },
        {
            name: 'Time on Page - 30s',
            type: 'Custom Event',
            eventName: 'time_on_page',
            conditions: 'Event equals time_on_page AND time_threshold equals 30'
        },
        {
            name: 'Time on Page - 60s',
            type: 'Custom Event',
            eventName: 'time_on_page',
            conditions: 'Event equals time_on_page AND time_threshold equals 60'
        },
        {
            name: 'External Link Click',
            type: 'Custom Event',
            eventName: 'external_link_click',
            conditions: 'Event equals external_link_click'
        }
    ],

    /**
     * GTM Tags Configuration
     * Create these tags in your GTM container
     */
    tags: [
        {
            name: 'GA4 Configuration',
            type: 'Google Analytics: GA4 Configuration',
            measurementId: '{{GA4 Measurement ID}}',
            trigger: 'All Pages',
            settings: {
                send_page_view: true,
                custom_parameters: {
                    custom_map: {
                        dimension1: 'user_type',
                        dimension2: 'page_category'
                    }
                }
            }
        },
        {
            name: 'GA4 Event - Form Submit',
            type: 'Google Analytics: GA4 Event',
            measurementId: '{{GA4 Measurement ID}}',
            eventName: 'generate_lead',
            trigger: 'Contact Form Submission',
            parameters: {
                event_category: 'engagement',
                event_label: '{{Form Name}}',
                value: '{{Conversion Value}}',
                currency: 'USD',
                form_name: '{{Form Name}}',
                page_location: '{{Page URL}}'
            }
        },
        {
            name: 'GA4 Event - Newsletter Signup',
            type: 'Google Analytics: GA4 Event',
            measurementId: '{{GA4 Measurement ID}}',
            eventName: 'sign_up',
            trigger: 'Newsletter Signup',
            parameters: {
                event_category: 'engagement',
                method: 'newsletter',
                value: 50,
                currency: 'USD'
            }
        },
        {
            name: 'GA4 Event - Calendly Booking',
            type: 'Google Analytics: GA4 Event',
            measurementId: '{{GA4 Measurement ID}}',
            eventName: 'schedule_consultation',
            trigger: 'Calendly Booking',
            parameters: {
                event_category: 'conversion',
                value: 500,
                currency: 'USD',
                service_type: 'consultation'
            }
        },
        {
            name: 'GA4 Event - Phone Click',
            type: 'Google Analytics: GA4 Event',
            measurementId: '{{GA4 Measurement ID}}',
            eventName: 'phone_call_intent',
            trigger: 'Phone Click',
            parameters: {
                event_category: 'engagement',
                phone_number: '{{Phone Number}}',
                page_location: '{{Page URL}}'
            }
        },
        {
            name: 'Facebook Pixel - Base Code',
            type: 'Custom HTML',
            html: `
                <script>
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '{{Facebook Pixel ID}}');
                fbq('track', 'PageView');
                </script>
            `,
            trigger: 'All Pages'
        },
        {
            name: 'Facebook Pixel - Lead Event',
            type: 'Custom HTML',
            html: `
                <script>
                if (typeof fbq !== 'undefined') {
                    fbq('track', 'Lead', {
                        content_name: '{{Form Name}}',
                        content_category: 'Lead Generation',
                        value: {{Conversion Value}},
                        currency: 'USD'
                    });
                }
                </script>
            `,
            trigger: 'Contact Form Submission'
        },
        {
            name: 'Facebook Pixel - Subscribe Event',
            type: 'Custom HTML',
            html: `
                <script>
                if (typeof fbq !== 'undefined') {
                    fbq('track', 'Subscribe', {
                        content_name: 'Newsletter',
                        value: 50,
                        currency: 'USD'
                    });
                }
                </script>
            `,
            trigger: 'Newsletter Signup'
        },
        {
            name: 'LinkedIn Insight Tag',
            type: 'Custom HTML',
            html: `
                <script type="text/javascript">
                _linkedin_partner_id = "{{LinkedIn Partner ID}}";
                window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
                window._linkedin_data_partner_ids.push(_linkedin_partner_id);
                </script>
                <script type="text/javascript">
                (function(){var s = document.getElementsByTagName("script")[0];
                var b = document.createElement("script");
                b.type = "text/javascript";b.async = true;
                b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
                s.parentNode.insertBefore(b, s);})();
                </script>
            `,
            trigger: 'All Pages'
        },
        {
            name: 'LinkedIn Conversion - Lead',
            type: 'Custom HTML',
            html: `
                <script>
                if (typeof window.lintrk !== 'undefined') {
                    window.lintrk('track', { conversion_id: 'YOUR_LINKEDIN_CONVERSION_ID' });
                }
                </script>
            `,
            trigger: 'Contact Form Submission'
        }
    ],

    /**
     * Setup Instructions
     */
    setupInstructions: {
        step1: 'Create GTM Container',
        step2: 'Add Variables listed above',
        step3: 'Create Triggers with specified conditions',
        step4: 'Configure Tags with correct settings',
        step5: 'Test in Preview mode',
        step6: 'Publish container',
        step7: 'Verify tracking in GA4 and social platforms'
    },

    /**
     * Enhanced Ecommerce Setup (if needed for future)
     */
    ecommerce: {
        // For tracking consultation packages as products
        trackConsultation: {
            item_id: 'consultation',
            item_name: 'Marketing Consultation',
            item_category: 'Service',
            item_variant: '30min',
            price: 500,
            currency: 'USD'
        },
        
        // For tracking different service packages
        servicePackages: [
            {
                item_id: 'ppc_basic',
                item_name: 'PPC Management - Basic',
                item_category: 'PPC',
                price: 2000,
                currency: 'USD'
            },
            {
                item_id: 'seo_premium',
                item_name: 'SEO Services - Premium',
                item_category: 'SEO',
                price: 3000,
                currency: 'USD'
            }
        ]
    },

    /**
     * Custom Dimensions Setup for GA4
     */
    customDimensions: [
        {
            parameter_name: 'user_type',
            display_name: 'User Type',
            description: 'Type of user (new_visitor, returning_visitor, customer)',
            scope: 'USER'
        },
        {
            parameter_name: 'page_category',
            display_name: 'Page Category',
            description: 'Category of page (homepage, service, blog, contact)',
            scope: 'EVENT'
        },
        {
            parameter_name: 'form_type',
            display_name: 'Form Type',
            description: 'Type of form submitted (contact, newsletter, consultation)',
            scope: 'EVENT'
        },
        {
            parameter_name: 'service_interest',
            display_name: 'Service Interest',
            description: 'Service user is interested in',
            scope: 'EVENT'
        },
        {
            parameter_name: 'traffic_source',
            display_name: 'Traffic Source Detail',
            description: 'Detailed traffic source information',
            scope: 'SESSION'
        }
    ],

    /**
     * Conversion Goals Setup
     */
    conversionGoals: [
        {
            name: 'Contact Form Submission',
            eventName: 'generate_lead',
            value: 100,
            category: 'Lead Generation'
        },
        {
            name: 'Consultation Booking',
            eventName: 'schedule_consultation',
            value: 500,
            category: 'High Intent'
        },
        {
            name: 'Newsletter Signup',
            eventName: 'sign_up',
            value: 50,
            category: 'Engagement'
        },
        {
            name: 'Phone Call Intent',
            eventName: 'phone_call_intent',
            value: 200,
            category: 'Direct Contact'
        },
        {
            name: 'Email Click',
            eventName: 'email_click',
            value: 150,
            category: 'Direct Contact'
        }
    ]
};

// Helper functions for GTM implementation
const GTMHelpers = {
    /**
     * Initialize dataLayer if not exists
     */
    initDataLayer() {
        window.dataLayer = window.dataLayer || [];
    },

    /**
     * Push event to dataLayer
     */
    pushEvent(eventName, parameters = {}) {
        this.initDataLayer();
        window.dataLayer.push({
            event: eventName,
            ...parameters
        });
    },

    /**
     * Track enhanced ecommerce event
     */
    trackEcommerce(action, items, transactionId = null, value = 0) {
        const ecommerceData = {
            event: action,
            ecommerce: {
                transaction_id: transactionId,
                value: value,
                currency: 'USD',
                items: items
            }
        };
        
        this.pushEvent(action, ecommerceData);
    },

    /**
     * Generate unique transaction ID
     */
    generateTransactionId() {
        return 'txn_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
};

// Export for use in other scripts
if (typeof window !== 'undefined') {
    window.GTMConfig = GTMConfig;
    window.GTMHelpers = GTMHelpers;
}

export { GTMConfig, GTMHelpers }; 