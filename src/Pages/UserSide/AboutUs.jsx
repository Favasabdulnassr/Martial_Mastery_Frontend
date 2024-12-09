import React, { useEffect } from 'react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Video, 
  CheckCircle, 
  Lock, 
  MessageCircle, 
  Upload,
  Award
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
    <div className="bg-black min-h-screen text-zinc-300">
      <Header />

      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative pt-20"
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

        <div className="relative container mx-auto px-4 py-20">
          <motion.div className="text-center space-y-6 max-w-4xl mx-auto">
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
              <Shield className="w-16 h-16 text-cyan-400" />
            </motion.div>

            <motion.h1 
              variants={fadeInUp}
              className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-violet-400 bg-clip-text text-transparent"
            >
              Your Journey to Self-Defense Mastery
            </motion.h1>

            <motion.p 
              variants={fadeInUp}
              className="text-xl text-zinc-400 leading-relaxed"
            >
              Welcome to Martial Mastery, where we believe everyone deserves access to quality self-defense training 
              that fits their schedule and learning pace.
            </motion.p>
          </motion.div>
        </div>
      </motion.div>

      {/* Mission Section */}
      <motion.section 
        variants={fadeInUp}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="py-20 relative"
      >
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <motion.div
              className="w-full h-[400px] rounded-2xl overflow-hidden shadow-lg shadow-cyan-500/20 border border-cyan-900/20"
            >
              <img
                src="/api/placeholder/800/600"
                alt="Martial Arts Training"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            </motion.div>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Our Mission</h2>
            <p className="text-zinc-400">
              We're dedicated to making martial arts training accessible to everyone, 
              regardless of their schedule or prior experience. Our platform focuses on 
              practical self-defense skills that can be learned at your own pace, without 
              the pressure of formal certifications or belt systems.
            </p>
            <p className="text-zinc-400">
              What sets us apart is our commitment to personalized learning through direct 
              interaction with experienced tutors, structured task-based progression, and 
              real-time feedback on your technique development.
            </p>
          </div>
        </div>
      </motion.section>

      {/* How It Works Section */}
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
                icon: <Video className="w-10 h-10" />,
                title: "Watch & Learn",
                description: "Access structured video tutorials from experienced martial arts instructors"
              },
              {
                icon: <Upload className="w-10 h-10" />,
                title: "Practice & Submit",
                description: "Complete practical tasks and submit recordings for personalized feedback"
              },
              {
                icon: <Lock className="w-10 h-10" />,
                title: "Progress & Unlock",
                description: "Unlock new lessons as you master each technique through task completion"
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

      {/* Features Section */}
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
              "Flexible subscription plans to fit your budget",
              "Direct communication with experienced tutors",
              "Task-based learning progression system",
              "Personalized feedback on your technique",
              "Video tutorials from multiple disciplines",
              "Progress tracking and achievement system",
              "Community support and discussion forums",
              "Mobile-friendly platform for learning on-the-go"
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="flex items-center gap-3"
              >
                <CheckCircle className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                <span className="text-zinc-300">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Learning Journey Section */}
      <motion.section 
        variants={fadeInUp}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="py-20 bg-[#0a0a0a]"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl font-bold text-white">Your Learning Journey</h2>
            <p className="text-zinc-400">
              Our unique approach combines structured learning with flexibility. Each tutorial 
              contains specific tasks that help reinforce your learning. Complete these tasks 
              to receive feedback from your tutor and unlock new content. This ensures you 
              build a strong foundation before advancing to more complex techniques.
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-left mt-12">
              <div className="p-6 bg-black rounded-xl border border-zinc-800">
                <MessageCircle className="w-8 h-8 text-cyan-400 mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">Tutor Interaction</h3>
                <p className="text-zinc-400">Direct communication with experienced instructors for guidance and feedback</p>
              </div>
              <div className="p-6 bg-black rounded-xl border border-zinc-800">
                <Upload className="w-8 h-8 text-fuchsia-400 mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">Task Submission</h3>
                <p className="text-zinc-400">Submit videos of your practice for personalized feedback and improvement</p>
              </div>
              <div className="p-6 bg-black rounded-xl border border-zinc-800">
                <Award className="w-8 h-8 text-violet-400 mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">Skill Progress</h3>
                <p className="text-zinc-400">Track your development and unlock advanced techniques as you improve</p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Final CTA Section */}
      <motion.section 
        variants={fadeInUp}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="py-20"
      >
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl font-bold text-white">Ready to Begin Your Journey?</h2>
            <p className="text-zinc-400">
              Join Martial Mastery today and take the first step towards mastering practical 
              self-defense skills with guidance from experienced tutors.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-semibold rounded-full 
                shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300"
            >
              Start Learning Today
            </motion.button>
          </div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
}

export default AboutUs;