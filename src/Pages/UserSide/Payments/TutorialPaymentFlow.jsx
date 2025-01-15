import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axiosInstance from '@/services/interceptor';
import { Medal, ChevronRight } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function TutorialPaymentFlow({ tutorial, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [hasAccess, setHasAccess] = useState(true);
    const [bool,setBool]  =useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const handleInitialLoad = async () => {
            const query = new URLSearchParams(window.location.search);
            const success = query.get('success');
            const tutorialId = query.get('tutorial_id');
            const paymentIntentId = query.get('payment_intent_id');

            if (success === 'true' && tutorialId && paymentIntentId) {
                try {
                    await handlePaymentSuccess(tutorialId, paymentIntentId);
                    setHasAccess(true);
                    onSuccess?.();
                    toast.success('Payment successfully completed');
                    navigate('/courses')
                    
                } catch (error) {
                    console.error('Error processing payment:', error);
                    toast.error('Failed to process payment. Please contact support.');
                }
            }
        };

        handleInitialLoad();
    }, [onSuccess,bool]);

    useEffect(() => {
        if (tutorial.id) {
            checkAccess();
        }
    }, [tutorial.id]);

    const handlePaymentSuccess = async (tutorialId, paymentIntentId) => {
        const response = await axiosInstance.post('payments/paymentSuccess/', {
            tutorial_id: tutorialId,
            payment_intent_id: paymentIntentId,
        });

        if (response.data.status !== 'success') {
            throw new Error('Payment verification failed');
        }

        return response.data;
    };

    const checkAccess = async () => {
        try {
            const response = await axiosInstance.get(`payments/check_access/?tutorial_id=${tutorial.id}`);
            setHasAccess(response.data.has_access);
            setBool((prev)=>!prev)
        } catch (error) {
            console.error('Error checking access:', error);
            toast.error('Failed to check access status');
        }
    };

    const handlePayment = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.post('payments/create-payment-session/', {
                tutorial_id: tutorial.id
            });

            // Redirect to Stripe Checkout
            window.location.href = response.data.url;
        } catch (error) {
            console.error('Error initiating payment:', error);
            toast.error('Failed to initiate payment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const slideInUp = {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8 }
    };

    return (
        <motion.div
            variants={slideInUp}
            whileHover={{ scale: 1.05 }}
            className="p-8 bg-black rounded-2xl shadow-xl border border-cyan-900/20 group relative overflow-hidden"
        >
            <div className="flex justify-between items-center mb-4">
                <div className="text-cyan-400">
                    <Medal className="w-12 h-12" />
                </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
                {tutorial.title}
            </h3>
            <div className="text-zinc-400 mb-4">
                <p>{tutorial.description}</p>
            </div>
            <div className="flex justify-between items-center">
                <div className="text-2xl font-bold text-cyan-400">
                    ${12}/session
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-400 
                    text-black font-semibold rounded-full shadow-lg transition-all duration-300 group"
                    onClick={() => {
                        if (hasAccess) {
                            onSuccess?.();
                        } else {
                            handlePayment();
                        }
                    }}
                    disabled={loading}
                >
                    <span className="flex items-center gap-2">
                        {loading ? 'Processing...' : hasAccess ? 'Watch Tutorial' : 'Purchase Access'}
                        <ChevronRight className="group-hover:translate-x-2 transition-transform" />
                    </span>
                </motion.button>
            </div>
        </motion.div>
    );
}

export default TutorialPaymentFlow;