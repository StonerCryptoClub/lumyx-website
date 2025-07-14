import { useState } from 'react';
import { useFormValidation } from '@/hooks/useFormValidation';
import LoadingSpinner from './LoadingSpinner';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'success' | 'error' | null>(null);

  const { errors, validate } = useFormValidation({
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate('email', email)) {
      return;
    }

    setIsSubmitting(true);
    setStatus(null);

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      if (!response.ok) throw new Error('Subscription failed');
      
      setStatus('success');
      setEmail('');
    } catch (error) {
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-800/50 p-8 rounded-lg">
      <h3 className="text-2xl font-bold text-amber-500 mb-4">
        Subscribe to Our Newsletter
      </h3>
      <p className="text-gray-300 mb-6">
        Get the latest digital marketing insights and trends delivered to your inbox.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              validate('email', e.target.value);
            }}
            placeholder="Enter your email"
            className={`w-full px-4 py-3 rounded-md bg-gray-700 border ${
              errors.email ? 'border-red-500' : 'border-gray-600'
            } text-gray-100 placeholder-gray-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
        >
          {isSubmitting ? <LoadingSpinner /> : 'Subscribe'}
        </button>

        {status === 'success' && (
          <div className="p-4 rounded-md bg-green-100 text-green-700">
            Thank you for subscribing! Please check your email to confirm.
          </div>
        )}

        {status === 'error' && (
          <div className="p-4 rounded-md bg-red-100 text-red-700">
            Failed to subscribe. Please try again later.
          </div>
        )}
      </form>
    </div>
  );
} 