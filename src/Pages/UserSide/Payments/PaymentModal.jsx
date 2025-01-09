import React, { useState, useEffect } from 'react';
import { useElements, useStripe, CardElement } from '@stripe/react-stripe-js';
import { LockIcon, CreditCard, CheckCircle } from 'lucide-react';
import axiosInstance from '@/services/interceptor';

const PaymentModal = ({ tutorial, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    }
  };

  const handlePayment = async () => {
    if (!stripe || !elements) return;

    try {
      setLoading(true);
      const response = await axiosInstance.post('payments/process_payment/', {
        tutorial_id: tutorial.id
      });

      const result = await stripe.confirmCardPayment(response.data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: { name: 'User Name' }
        }
      });

      if (result.error) {
        throw new Error(result.error.message);
      } 

      await axiosInstance.post('payments/payment_success/', {
        payment_intent_id: result.paymentIntent.id,
        tutorial_id: tutorial.id
      });

      setHasAccess(true);
      onSuccess?.();
      onClose();

    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-8 max-w-md w-full mx-auto">
      <div className="text-center mb-6">
        <div className="bg-cyan-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
          <CreditCard className="w-6 h-6 text-cyan-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Complete Purchase</h2>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Tutorial Access</span>
          <span className="font-medium">{tutorial.title}</span>
        </div>
        <div className="flex justify-between border-t pt-2">
          <span className="font-medium">Total</span>
          <span className="text-lg font-bold text-cyan-600">$12.00</span>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Information
        </label>
        <div className="border rounded-md p-4 bg-white">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
      </div>

      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full bg-cyan-600 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-cyan-700 transition-colors"
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
            Processing...
          </div>
        ) : (
          <>
            <LockIcon className="w-4 h-4" />
            Pay $12.00
          </>
        )}
      </button>

      <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
        <LockIcon className="w-4 h-4" />
        Secured by Stripe
      </div>
    </div>
  );
};

export default PaymentModal;