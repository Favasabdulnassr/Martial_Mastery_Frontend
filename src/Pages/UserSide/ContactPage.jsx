import React, { useEffect } from 'react'
import Header from '../../Components/Header'
import Footer from '../../Components/Footer'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

function ContactPage() {

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
        <div className="bg-black min-h-screen">
            <Header />
            
            {/* Title with gradient */}
            <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className='font-serif text-center pt-40 text-5xl bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-violet-400 bg-clip-text text-transparent'
            >
                Contact us
            </motion.h1>

            <div className="flex justify-center mt-16 px-4">
                {/* Left Side Content */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="w-1/3 bg-[#0a0a0a] p-8 rounded-lg shadow-lg shadow-cyan-500/10 mr-10 border border-cyan-900/20"
                >
                    <h2 className="text-2xl font-bold mb-4 text-cyan-400">Get in Touch</h2>
                    <p className="text-lg text-zinc-400 mb-4">
                        We'd love to hear from you! Whether you have questions about our programs, feedback, or just want to say hi, feel free to reach out.
                    </p>
                    <p className="text-lg text-zinc-400">
                        You can also visit us at:
                        <br /><br />
                        <strong className="text-fuchsia-400">Address:</strong> 123 Martial Arts Ave, City, Country
                        <br />
                        <strong className="text-violet-400">Phone:</strong> +123 456 7890
                        <br />
                        <strong className="text-cyan-400">Email:</strong> info@martialarts.com
                    </p>
                </motion.div>

                {/* Contact Form */}
                <motion.form 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className='w-1/2 bg-[#0a0a0a] shadow-lg shadow-violet-500/10 p-8 rounded-lg border border-violet-900/20'
                >
                    <div className='mb-4'>
                        <label className='block text-lg font-medium text-zinc-300'>Name:</label>
                        <input
                            type="text"
                            placeholder="Your Name"
                            className='mt-2 w-full p-2 bg-black border border-zinc-800 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-zinc-300 placeholder-zinc-600'
                        />
                    </div>
                    <div className='mb-4'>
                        <label className='block text-lg font-medium text-zinc-300'>Email:</label>
                        <input
                            type="email"
                            placeholder="Your Email"
                            className='mt-2 w-full p-2 bg-black border border-zinc-800 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 text-zinc-300 placeholder-zinc-600'
                        />
                    </div>
                    <div className='mb-4'>
                        <label className='block text-lg font-medium text-zinc-300'>Message:</label>
                        <textarea
                            placeholder="Your Message"
                            className='mt-2 w-full p-2 bg-black border border-zinc-800 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 text-zinc-300 placeholder-zinc-600 h-32'
                        />
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className='w-full p-3 bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-semibold rounded-md hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300'
                    >
                        Submit
                    </motion.button>
                </motion.form>
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mx-auto mt-20 text-center p-6"
            >
                <p className="text-sm text-zinc-400 whitespace-break-spaces max-w-3xl mx-auto pb-20">
                    At Martial Mastery, we are dedicated to providing top-notch martial arts training for all ages and skill levels. Whether you're a beginner or an experienced practitioner,
                     our programs are designed to help you improve, achieve your goals, and build lifelong skills in a supportive and inclusive environment.
                </p>
            </motion.div>

            <Footer/>
        </div>
    )
}

export default ContactPage