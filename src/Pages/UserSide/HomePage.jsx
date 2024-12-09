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
  GraduationCap
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

  const navigate = useNavigate()
  const {isAuthenticated,role} = useSelector((state)=>state.login)

  useEffect(()=>{
    if(role === 'admin'){
        navigate('/admin/dashboard')
    }
    else if(role === 'tutor'){
      navigate('/tutor/dashboard')

    }
    
},[isAuthenticated,role])



  return (
    <>
    <div className="h-20">
      <Header />
    </div>
    <div className="min-h-screen flex flex-col bg-black">
      <main className="flex-1 overflow-hidden">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative min-h-[90vh]"
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

          <div className="relative container mx-auto px-4 py-32">
            <motion.div 
              variants={staggerChildren}
              initial="initial"
              animate="animate"
              className="max-w-3xl mx-auto text-center space-y-8"
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
                className="flex justify-center mb-8"
              >
                <Shield className="w-20 h-20 text-cyan-400" />
              </motion.div>

              <motion.h1 
                variants={slideInUp}
                className="text-5xl sm:text-6xl md:text-7xl font-bold space-y-4"
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
                className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed"
              >
                Master self-defense with personalized training that adapts to your schedule.
                Experience growth at your own pace with expert guidance in a supportive environment.
              </motion.p>

              <motion.div
                variants={slideInUp}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/login" className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-cyan-500 via-cyan-400 to-cyan-500 
                  text-black font-semibold rounded-full shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 group">
                  <span className="text-lg">BEGIN YOUR JOURNEY</span>
                  <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform duration-300" />
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
          className="py-24 bg-[#0a0a0a] relative overflow-hidden"
        >
          <div className="container mx-auto px-4">
            <motion.div 
              variants={staggerChildren}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-8"
            >
              {[
                {
                  icon: <Target className="w-12 h-12" />,
                  title: "Expert Training",
                  description: "Learn from certified martial arts instructors with years of experience in multiple disciplines",
                  color: "cyan"
                },
                {
                  icon: <Video className="w-12 h-12" />,
                  title: "Live Sessions",
                  description: "Interactive video training sessions with real-time feedback and personalized guidance",
                  color: "fuchsia"
                },
                {
                  icon: <GraduationCap className="w-12 h-12" />,
                  title: "Structured Learning",
                  description: "Progressive curriculum designed to take you from beginner to master at your own pace",
                  color: "violet"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  variants={slideInUp}
                  whileHover={{ scale: 1.05 }}
                  className={`p-8 bg-black rounded-2xl shadow-xl border border-${feature.color}-900/20
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
                    <h3 className="text-2xl font-bold text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-zinc-400">
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
          className="py-24 bg-black"
        >
          <div className="container mx-auto px-4">
            <motion.div 
              variants={staggerChildren}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="text-center mb-16"
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
                <Sparkles className="w-12 h-12 text-fuchsia-400 mb-4" />
              </motion.div>
              <h2 className="text-4xl font-bold text-white">
                Choose Your Path
              </h2>
            </motion.div>

            <motion.div 
              variants={staggerChildren}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid sm:grid-cols-3 gap-8 max-w-5xl mx-auto"
            >
              {[
                {
                  title: "Monthly Plan",
                  price: "$49",
                  features: ["4 Live Sessions", "Chat Support", "Basic Techniques", "Training Resources"],
                  color: "cyan"
                },
                {
                  title: "Six-month Plan",
                  price: "$239",
                  features: ["24 Live Sessions", "Priority Support", "Advanced Techniques", "Custom Training Plan"],
                  color: "fuchsia"
                },
                {
                  title: "Yearly Plan",
                  price: "$399",
                  features: ["Unlimited Sessions", "24/7 Support", "Master Classes", "Private Coaching"],
                  color: "violet"
                }
              ].map((plan, index) => (
                <motion.div
                  key={index}
                  variants={slideInUp}
                  whileHover={{ scale: 1.05 }}
                  className={`bg-black p-8 rounded-2xl shadow-xl border border-${plan.color}-900/20
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
                    className={`absolute inset-0 bg-gradient-to-br from-${plan.color}-500/10 to-transparent`}
                  />
                  <div className="relative">
                    <Star className={`w-8 h-8 text-${plan.color}-400 mb-4`} />
                    <h3 className={`text-2xl font-bold text-${plan.color}-400 mb-2`}>
                      {plan.title}
                    </h3>
                    <div className="text-3xl font-bold text-white mb-6">
                      {plan.price}
                    </div>
                    <ul className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-zinc-300">
                          <CheckCircle className={`w-5 h-5 text-${plan.color}-400 mr-2`} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Become a Tutor Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative -mt-16 mx-4 mb-16"
        >
          <div className="bg-black rounded-2xl p-12 shadow-2xl overflow-hidden border border-violet-900/20">
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
            
            <div className="max-w-4xl mx-auto text-center space-y-8 relative">
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
                <Award className="w-16 h-16 text-violet-400 mx-auto mb-6" />
              </motion.div>

              <h2 className="text-4xl font-bold text-white">
                Share Your Expertise
              </h2>
              
              <p className="text-xl text-zinc-300">
                Join our community of expert tutors and help others master the art of self-defense.
                Share your knowledge, build your reputation, and earn while making a difference.
              </p>

              <div className="flex justify-center gap-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-semibold rounded-full 
                    shadow-lg shadow-cyan-500/25 transition-all duration-300 group"
                    onClick={()=> navigate('/login')}
                >
                  <span className="flex items-center gap-2 text-lg">
                    Login as Tutor
                    <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                  </span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-full
                    shadow-lg shadow-violet-500/25 transition-all duration-300 group"

                    onClick={()=> navigate('/tutor/tutorRegister')}
                >
                  <span className="flex items-center gap-2 text-lg">
                    Register as Tutor
                    <ArrowRight className="group-hover:translate-x-2 transition-transform" />
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