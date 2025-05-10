import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import { 
  ArrowRight, 
  Star, 
  MessageCircle, 
  Video, 
  Shield,
  Target,
  Award,
  CheckCircle,
  Sparkles,
  GraduationCap,
  MessageSquare
} from 'lucide-react';
import { useSelector } from 'react-redux';

const slideInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8 }
};

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated, role } = useSelector((state) => state.login);

  useEffect(() => {
    if (role === 'admin') {
      navigate('/admin/dashboard');
    } else if (role === 'tutor') {
      navigate('/tutor/Profile');
    }
  }, [isAuthenticated, role, navigate]);

  return (
    <>
      <div className="h-auto sm:h-20">
        <Header />
      </div>
      <div className="min-h-screen flex flex-col bg-black">
        <main className="flex-1 overflow-hidden">
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="relative min-h-[80vh] sm:min-h-[90vh]"
          >
            <div className="absolute inset-0 bg-[#0a0a0a]">
              <motion.div
                animate={{
                  opacity: [0.3, 0.6]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="absolute inset-0 bg-[linear-gradient(45deg,#0a0a0a_25%,#141414_50%,#0a0a0a_75%)]"
              />
            </div>

            <div className="relative container mx-auto px-4 py-16 sm:py-24 md:py-32">
              <motion.div 
                variants={staggerChildren}
                initial="initial"
                animate="animate"
                className="max-w-3xl mx-auto text-center space-y-6 sm:space-y-8"
              >
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    filter: ['brightness(1)', 'brightness(1.3)', 'brightness(1)']
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                  className="flex justify-center mb-4 sm:mb-8"
                >
                  <Shield className="w-14 h-14 sm:w-20 sm:h-20 text-cyan-400" />
                </motion.div>

                <motion.h1 
                  variants={slideInUp}
                  className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold space-y-2 sm:space-y-4"
                >
                  <span className="block font-light text-zinc-300">
                    Mastery begins with
                  </span>
                  <span className="block bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-violet-400 bg-clip-text text-transparent">
                    the right guidance
                  </span>
                </motion.h1>

                <motion.p 
                  variants={slideInUp}
                  className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed px-2"
                >
                  Master self-defense with personalized training that adapts to your schedule.
                  Experience growth at your own pace with expert guidance in a supportive environment.
                </motion.p>

                <motion.div
                  variants={slideInUp}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="pt-2 sm:pt-4"
                >
                  <Link to="/login" className="inline-flex items-center px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-5 bg-gradient-to-r from-cyan-500 via-cyan-400 to-cyan-500 
                    text-black font-semibold rounded-full shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 group">
                    <span className="text-base sm:text-lg">BEGIN YOUR JOURNEY</span>
                    <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-2 transition-transform duration-300" />
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* Features Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="py-16 sm:py-20 md:py-24 bg-[#0a0a0a] relative overflow-hidden"
          >
            <div className="container mx-auto px-4">
              <motion.div 
                variants={staggerChildren}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8"
              >
                {[
                  {
                    icon: <Target className="w-10 h-10 sm:w-12 sm:h-12" />,
                    title: "Expert Training",
                    description: "Learn from certified martial arts instructors with years of experience in multiple disciplines",
                    color: "cyan"
                  },
                  {
                    icon: <MessageSquare className="w-10 h-10 sm:w-12 sm:h-12" />,
                    title: "Chat Sessions",
                    description: "Interactive Chat sessions with real-time feedback and personalized guidance",
                    color: "fuchsia"
                  },
                  {
                    icon: <GraduationCap className="w-10 h-10 sm:w-12 sm:h-12" />,
                    title: "Structured Learning",
                    description: "Progressive curriculum designed to take you from beginner to master at your own pace",
                    color: "violet"
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    variants={slideInUp}
                    whileHover={{ scale: 1.03 }}
                    className={`p-6 sm:p-8 bg-black rounded-2xl shadow-xl border border-${feature.color}-900/20
                      group relative overflow-hidden`}
                  >
                    <motion.div
                      animate={{
                        opacity: [0.1, 0.2],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                      className={`absolute inset-0 bg-gradient-to-br from-${feature.color}-500/10 to-transparent`}
                    />
                    <div className="relative">
                      <div className={`text-${feature.color}-400 mb-4`}>
                        {feature.icon}
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-sm sm:text-base text-zinc-400">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Pricing Plans */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="py-16 sm:py-20 md:py-24 bg-black"
          >
            <div className="container mx-auto px-4">
              <motion.div 
                variants={staggerChildren}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="text-center mb-10 sm:mb-16"
              >
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    filter: ['brightness(1)', 'brightness(1.3)', 'brightness(1)']
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                  className="inline-block"
                >
                  <MessageCircle className="w-10 h-10 sm:w-12 sm:h-12 text-fuchsia-400 mb-4" />
                </motion.div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white px-2">
                  Personalized Learning Experience
                </h2>
              </motion.div>

              <motion.div 
                variants={staggerChildren}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto"
              >
                {[
                  {
                    icon: <Star className="w-7 h-7 sm:w-8 sm:h-8" />,
                    title: "Expert Tutors",
                    description: "Choose from a diverse range of experienced tutors specializing in different martial arts disciplines and teaching styles.",
                    color: "cyan"
                  },
                  {
                    icon: <Video className="w-7 h-7 sm:w-8 sm:h-8" />,
                    title: "Interactive Learning",
                    description: "Engage directly with tutors through in-video comments and a dedicated chat system. Get personalized feedback and guidance.",
                    color: "fuchsia"
                  },
                  {
                    icon: <Target className="w-7 h-7 sm:w-8 sm:h-8" />,
                    title: "Flexible Learning",
                    description: "Purchase individual courses based on your interests, skill level, and preferred tutor. Learn at your own pace and schedule.",
                    color: "violet"
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    variants={slideInUp}
                    whileHover={{ scale: 1.03 }}
                    className={`bg-black p-6 sm:p-8 rounded-2xl shadow-xl border border-${feature.color}-900/20
                      group relative overflow-hidden`}
                  >
                    <motion.div
                      animate={{
                        opacity: [0.1, 0.2],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                      className={`absolute inset-0 bg-gradient-to-br from-${feature.color}-500/10 to-transparent`}
                    />
                    <div className="relative">
                      <div className={`text-${feature.color}-400 mb-4`}>
                        {feature.icon}
                      </div>
                      <h3 className={`text-xl sm:text-2xl font-bold text-${feature.color}-400 mb-2 sm:mb-3`}>
                        {feature.title}
                      </h3>
                      <p className="text-sm sm:text-base text-zinc-400">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div 
                variants={slideInUp}
                className="text-center mt-10 sm:mt-16"
              >
                <p className="text-base sm:text-lg md:text-xl text-zinc-300 max-w-3xl mx-auto mb-6 sm:mb-8 px-2">
                  Our platform offers a unique learning experience where you can explore courses from various tutors, 
                  interact directly through video comments, and use our chat system for personalized guidance.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-4 bg-gradient-to-r from-cyan-500 via-cyan-400 to-cyan-500 
                    text-black font-semibold rounded-full shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 
                    transition-all duration-300 group"
                  onClick={() => navigate('/courses')}
                >
                  <span className="flex items-center gap-2 text-base sm:text-lg">
                    Explore Courses
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-2 transition-transform duration-300" />
                  </span>
                </motion.button>
              </motion.div>
            </div>
          </motion.div>

          {/* Become a Tutor Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative -mt-8 sm:-mt-12 md:-mt-16 mx-4 mb-16"
          >
            <div className="bg-black rounded-2xl p-6 sm:p-8 md:p-12 shadow-2xl overflow-hidden border border-violet-900/20">
              <motion.div
                animate={{
                  opacity: [0.1, 0.2],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-fuchsia-500/10 to-violet-500/10"
              />
              
              <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8 relative">
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    filter: ['brightness(1)', 'brightness(1.3)', 'brightness(1)']
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <Award className="w-12 h-12 sm:w-16 sm:h-16 text-violet-400 mx-auto mb-4 sm:mb-6" />
                </motion.div>

                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                  Share Your Expertise
                </h2>
                
                <p className="text-base sm:text-lg md:text-xl text-zinc-300 px-2">
                  Join our community of expert tutors and help others master the art of self-defense.
                  Share your knowledge, build your reputation, and earn while making a difference.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 px-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-semibold rounded-full 
                      shadow-lg shadow-cyan-500/25 transition-all duration-300 group w-full sm:w-auto"
                    onClick={() => navigate('/login')}
                  >
                    <span className="flex items-center justify-center gap-2 text-base sm:text-lg">
                      Login as Tutor
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-2 transition-transform" />
                    </span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-full
                      shadow-lg shadow-violet-500/25 transition-all duration-300 group w-full sm:w-auto mt-2 sm:mt-0"
                    onClick={() => navigate('/tutor/tutorRegister')}
                  >
                    <span className="flex items-center justify-center gap-2 text-base sm:text-lg">
                      Register as Tutor
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-2 transition-transform" />
                    </span>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </main>
        <Footer />
      </div>
    </>
  );
}

export default HomePage;