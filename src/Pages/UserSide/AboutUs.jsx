import React, { useEffect } from 'react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  Users, 
  FileText, 
  VideoIcon,
  BookOpen,
  MessageSquare, 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8 }
};

function AboutUs() {
  const navigate = useNavigate()
  const {isAuthenticated, role} = useSelector((state) => state.login)

  useEffect(() => {
    if(role === 'admin'){
      navigate('/admin/dashboard')
    }
    else if(role === 'tutor'){
      navigate('/tutor/dashboard')
    }
  },[isAuthenticated, role])

  return (
    <div className="bg-black min-h-screen text-zinc-300">
      <Header />

      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative pt-20"
      >
        <div className="container mx-auto px-4 py-20 text-center">
          <motion.h1 
            variants={fadeInUp}
            className="text-5xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-violet-400 bg-clip-text text-transparent"
          >
            Connecting Learners with Expert Tutors
          </motion.h1>

          <motion.p 
            variants={fadeInUp}
            className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed"
          >
            A dynamic online learning platform where tutors create courses and students gain direct access to expert knowledge, interactive learning, and personalized educational experiences.
          </motion.p>
        </div>
      </motion.div>

      {/* Platform Overview Section */}
      <motion.section 
        variants={fadeInUp}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="py-20 bg-[#0a0a0a]"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-12">How Our Platform Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <BookOpen className="w-10 h-10" />,
                title: "Diverse Course Catalog",
                description: "Tutors create and offer a wide range of courses across multiple disciplines"
              },
              {
                icon: <Users className="w-10 h-10" />,
                title: "Course Purchase",
                description: "Students browse and purchase courses directly from their preferred tutors"
              },
              {
                icon: <MessageCircle className="w-10 h-10" />,
                title: "Direct Interaction",
                description: "Seamless communication between students and tutors after course purchase"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="p-6 bg-black rounded-xl border border-zinc-800 hover:border-cyan-900/40 transition-colors"
              >
                <div className="text-cyan-400 mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-zinc-400">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Key Features Section */}
      <motion.section 
        variants={fadeInUp}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="py-20"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Platform Features</h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: <VideoIcon className="w-6 h-6 text-cyan-400 mr-3" />,
                text: "Video-based courses created by expert tutors"
              },
              {
                icon: <MessageSquare className="w-6 h-6 text-cyan-400 mr-3" />,
                text: "Direct chat functionality with course tutors"
              },
              {
                icon: <MessageCircle className="w-6 h-6 text-cyan-400 mr-3" />,
                text: "Comment sections for each video to interact with students and tutors"
              },
              {
                icon: <FileText className="w-6 h-6 text-cyan-400 mr-3" />,
                text: "Comprehensive reporting system for course-related issues"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="flex items-center"
              >
                {feature.icon}
                <span className="text-zinc-300">{feature.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Final CTA Section */}
      <motion.section 
        variants={fadeInUp}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="py-20 bg-[#0a0a0a]"
      >
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl font-bold text-white">Ready to Explore Learning?</h2>
            <p className="text-zinc-400">
              Discover courses from expert tutors, engage directly with instructors, 
              and enhance your skills through our interactive learning platform.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-semibold rounded-full 
                shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300"
            >
              Browse Courses
            </motion.button>
          </div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
}

export default AboutUs;