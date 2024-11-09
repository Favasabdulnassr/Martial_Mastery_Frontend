import React from 'react'
import Header from '../../Components/Header'
import Footer from '../../Components/Footer'

function ContactPage() {

    return (
        <>
            <Header />
            <h1 className='font-serif text-center text-zinc-700 mt-40 text-5xl'>Contact us</h1>

            
            <div className="flex justify-center mt-16">
                {/* Left Side Content */}
                <div className="w-1/3 bg-gray-100 p-8 rounded-lg shadow-lg mr-10">
                    <h2 className="text-2xl font-bold mb-4 text-blue-500">Get in Touch</h2>
                    <p className="text-lg text-gray-700 mb-4">
                        We’d love to hear from you! Whether you have questions about our programs, feedback, or just want to say hi, feel free to reach out.
                    </p>
                    <p className="text-lg text-gray-700">
                        You can also visit us at:
                        <br /><br />
                        <strong>Address:</strong> 123 Martial Arts Ave, City, Country
                        <br />
                        <strong>Phone:</strong> +123 456 7890
                        <br />
                        <strong>Email:</strong> info@martialarts.com
                    </p>
                </div>

                {/* Contact Form */}
                <form className='w-1/2 bg-white shadow-lg p-8 rounded-lg'>
                    <div className='mb-4'>
                        <label className='block text-lg font-medium text-gray-700'>Name:</label>
                        <input
                            type="text"
                            placeholder="Your Name"
                            className='mt-2 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                    </div>
                    <div className='mb-4'>
                        <label className='block text-lg font-medium text-gray-700'>Email:</label>
                        <input
                            type="email"
                            placeholder="Your Email"
                            className='mt-2 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                    </div>
                    <div className='mb-4'>
                        <label className='block text-lg font-medium text-gray-700'>Message:</label>
                        <textarea
                            placeholder="Your Message"
                            className='mt-2 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32'
                        />
                    </div>
                    <button
                        type="submit"
                        className='w-full p-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    >
                        Submit
                    </button>
                </form>
            </div>


            <div className="mx-auto mt-20 text-center text-gray-700 p-6">
                <p className="text-sm whitespace-break-spaces">
                    At Martial Mastery, we are dedicated to providing top-notch martial arts training for all ages and skill levels. Whether you're a beginner or an experienced practitioner,
                     our programs are designed to help you improve, achieve your goals,  and build lifelong skills in a supportive and inclusive environment.
                </p>
            </div>


            <Footer/>

        </>
    )
}

export default ContactPage