import { useState } from 'react';
import { useFormValidation } from '@/hooks/useFormValidation';
import ReCaptcha from './ReCaptcha';
import LoadingSpinner from './LoadingSpinner';

interface FormData {
  [key: string]: string;
  name: string;
  email: string;
  message: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [recaptchaToken, setRecaptchaToken] = useState<string>('');

  const { errors, validate, validateAll } = useFormValidation({
    name: {
      required: true,
      minLength: 2,
      maxLength: 50
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    message: {
      required: true,
      minLength: 10,
      maxLength: 1000
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validate(name, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateAll(formData) || !recaptchaToken) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-recaptcha-token': recaptchaToken
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to send message');
      
      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-300">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md bg-gray-800 border ${
            errors.name ? 'border-red-500' : 'border-gray-600'
          } px-3 py-2 text-gray-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500`}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md bg-gray-800 border ${
            errors.email ? 'border-red-500' : 'border-gray-600'
          } px-3 py-2 text-gray-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500`}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-300">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={4}
          className={`mt-1 block w-full rounded-md bg-gray-800 border ${
            errors.message ? 'border-red-500' : 'border-gray-600'
          } px-3 py-2 text-gray-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500`}
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-500">{errors.message}</p>
        )}
      </div>

      <ReCaptcha
        onVerify={token => setRecaptchaToken(token)}
        onExpire={() => setRecaptchaToken('')}
      />

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
        >
          {isSubmitting ? <LoadingSpinner /> : 'Send Message'}
        </button>
      </div>

      {submitStatus === 'success' && (
        <div className="p-4 rounded-md bg-green-100 text-green-700">
          Thank you for your message! We'll get back to you soon.
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="p-4 rounded-md bg-red-100 text-red-700">
          Failed to send message. Please try again later.
        </div>
      )}
    </form>
  );
} 