import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search,  } from 'lucide-react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import axiosInstance from '@/services/interceptor';
import { useLocation, useNavigate  } from 'react-router-dom';
import { toast } from 'react-toastify';
// import { useDispatch, useSelector } from 'react-redux';

function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate()


  const [loading,setLoading] = useState(false)
  // const dispatch = useDispatch();
  // const cartItems = useSelector((state) => state.cart );

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const success = queryParams.get('success');
  const cancel = queryParams.get('cancel');





  useEffect(() => {
    if (success === 'true') {
      toast.success('Payment successful! You have access to the course.');
      navigate('/courses', { replace: true });
    }

    if (cancel === 'true') {
      toast.error('Payment failed or was canceled. Please try again.');
      navigate('/courses', { replace: true });

    }

    const fetchCourses = async () => {
      try {
        const response = await axiosInstance.get('user/completed-courses/');
        setCourses(response.data);  // Assuming response.data is an array of courses
      } catch (error) {
        console.log('Error fetching courses:', error);
      }
    };

    fetchCourses();

  }, [success, cancel]);  // Re-run effect if success or cancel changes




  const handlePayment = async(courseId) =>{
    try {
      setLoading(true)
      const response = await axiosInstance.post(`payment/purchase/${courseId}/`)

      console.log('paymenttttttttttttttttttttt',response.data);
      if (response.data &&  response.data.checkout_url){
        window.location.href = response.data.checkout_url;
      }else{
        console.log('ssssssssssssss');
        
        toast.error('Unable to initiate payment')

      }
      
      
    } catch (error) {
      console.log('Payment errror',error);
      toast.error(error.response?.data?.message || 'Payment initiation failed');

      

      
    }finally{
      setLoading(false);

    }


  }







  // Filter courses based on search query
  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );




  return (
    <div className="min-h-screen flex flex-col bg-black">
      <div className="h-20">
        <Header />
      </div>
      <main className="flex-1 overflow-hidden">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative min-h-[30vh] bg-[#0a0a0a]"
        >
          <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="text-5xl font-bold mb-6">
              <span className="block font-light text-zinc-300">Choose Your</span>
              <span className="block bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-violet-400 bg-clip-text text-transparent">
                Martial Arts Journey
              </span>
            </h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Explore our diverse range of martial arts courses and find the perfect tutor to guide your path.
            </p>
          </div>
        </motion.div>

        {/* Courses Section */}
        {/* Courses Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="py-16 bg-[#0a0a0a]"
        >
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-white">Available Courses</h2>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-zinc-900 text-white rounded-full border border-zinc-700 focus:ring-2 focus:ring-cyan-400"
                  />
                  <Search className="absolute left-3 top-3 text-zinc-400" />
                </div>
                
              </div>
            </div>

            {/* Display filtered courses */}
            <div className="grid md:grid-cols-3 gap-8">
              {filteredCourses.map((course) => (
                <motion.div
                  key={course.id}
                  whileHover={{ scale: 1.05 }}
                  className="p-8 bg-black rounded-2xl shadow-xl border border-cyan-900/20"
                >
                  <div className="relative">
                    <h3 className="text-2xl font-bold text-white mb-3">{course.title}</h3>
                    <p className="text-zinc-400 mb-4">{course.description}</p>
                    <p className="text-zinc-400 mb-4">
                      <strong>Fees:</strong> {course.fees} USD
                    </p>
                    <p className="text-zinc-400 mb-4">
                      <strong>Duration:</strong> {course.duration_weeks} weeks
                    </p>
                    <div className="text-violet-400 flex items-center font-semibold mb-4">
                      <span className="mr-2">Tutor: {course.tutor.first_name} {course.tutor.last_name || ''}</span>
                    </div>

                    <div className="flex space-x-4">
                      
                      {course.tutorials && (
                        <button
                          onClick={() => handlePayment(course.id)}
                          disabled={loading}
                          className="px-6 py-2 bg-violet-500 text-white rounded-full hover:bg-violet-600 transition disabled:opacity-50"
                        >
                          {loading ? 'Processing...' : 'Purchase Now'}
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}

export default CoursesPage;