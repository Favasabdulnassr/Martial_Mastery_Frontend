import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import axiosInstance from '@/services/interceptor';

function CartPage() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch cart items
  const fetchCart = async () => {
    try {
      const response = await axiosInstance.get('cart/carts/');
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Failed to fetch cart items');
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Remove item from cart
  const handleRemoveFromCart = async (cartId, courseId) => {
    try {
      await axiosInstance.post(`cart/carts/${cartId}/remove_from_cart/`, {
        course_id: courseId
      });
      toast.success('Item removed from cart');
      fetchCart(); // Refresh cart after removal
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove item from cart');
    }
  };

  // Handle checkout
  const handleCheckout = async (cartId) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post(`cart/carts/${cartId}/checkout/`);
      
      if (response.data && response.data.checkout_url) {
        window.location.href = response.data.checkout_url;
      } else {
        toast.error('Unable to initiate checkout');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error.response?.data?.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  // Calculate total
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.course.fees, 0);
  };

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <div className="h-20">
        <Header />
      </div>
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Shopping Cart</h1>
        
        {cart.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-zinc-400 mb-4">Your cart is empty</p>
            <button
              onClick={() => navigate('/courses')}
              className="px-6 py-2 bg-cyan-500 text-white rounded-full hover:bg-cyan-600 transition"
            >
              Browse Courses
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="p-6 bg-zinc-900 rounded-lg flex items-center justify-between"
              >
                <div>
                  <h3 className="text-xl font-semibold text-white">{item.course.title}</h3>
                  <p className="text-zinc-400">
                    Tutor: {item.course.tutor.first_name} {item.course.tutor.last_name}
                  </p>
                  <p className="text-cyan-400">${item.course.fees}</p>
                </div>
                <button
                  onClick={() => handleRemoveFromCart(cart.id, item.course.id)}
                  className="p-2 text-zinc-400 hover:text-red-500 transition"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}

            <div className="mt-8 p-6 bg-zinc-900 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl text-white">Total:</span>
                <span className="text-2xl font-bold text-cyan-400">
                  ${calculateTotal()}
                </span>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => handleCheckout(cart[0]?.id)}
                  disabled={loading}
                  className="px-6 py-2 bg-cyan-500 text-white rounded-full hover:bg-cyan-600 transition disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Checkout'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default CartPage;