import React from 'react'
import Header from '../../Components/Header'
import Footer from '../../Components/Footer'

function AboutUs() {
    return (
        <>
            <Header />

           
           <div className='mt-36 text-neutral-700 font-bold text-center text-6xl'>
           <p >
                ABOUT US
            </p>

           </div>

           

            <div className='  flex justify-center items-center p-6 mt-32'>
                <div className='w-1/3  relative'>
                    <img
                        src={'/pexels-ivan-samkov-4162449.jpg'}
                        alt='About Us'
                        className='w-full h-auto object-cover rounded-lg'

                    />

                    <div className="absolute inset-0 bg-black opacity-70 rounded-lg"></div>



                </div>

                <div className='w-1/2 px-12 font-thin '>
                
                <p className="mb-4">
                        At Martial Mastery, we are dedicated to empowering individuals through martial arts, providing practical self-defense skills and enhancing overall health.
                        Our platform offers a range of classes taught by experienced tutors who are committed to helping you build confidence, discipline, and physical fitness.
                    </p>
                    
                    <p className="mb-4">
                        We understand that learning martial arts is about more than just obtaining certifications; it’s about personal safety and well-being.
                        Our focus is on equipping you with essential self-defense techniques that can be applied in real-life situations.
                    </p>
                    
                    <p>
                        With our flexible subscription plans, you can connect with your tutor through chat and video calls, receiving personalized guidance tailored to your needs.
                        Join Martial Mastery today and take the first step towards a healthier, more confident you—without the pressure of earning a certification. 
                        Embrace the journey of self-improvement and empowerment through martial arts.
                    </p>

                </div>

            </div>
            <Footer />
        </>
    )
}

export default AboutUs