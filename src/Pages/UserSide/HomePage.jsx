import React from 'react'
import Footer from '../../Components/Footer'
import Header from '../../Components/Header'
import '../../assets/UserSide/HomePage.css'

function HomePage() {
  return (
    <>
      <div className='min-h-screen flex flex-col  mx-auto'>
        <Header />
        <main className='m-0 flex flex-col overflow-auto '>

          <div className='bg-white relative child_parent_12'>


            <div className='relative child_container_1  p-4 ' >
              <div className='absolute inset-0 bg-black opacity-65'></div>

              <div className='relative mt-56 mr-36'>
                <div className='text-center ml-28 min-[250px]:max-[360px]:ml-20'>
                  <h1 className='text-center   lg:text-center  md:text-center sm:text-center text-2xl 2xl:text-6xl xl:text-6xl lg:text-6xl md:text-5xl sm:text-4xl  text-white uppercase font-extralight'>Mastery begins with </h1>
                  <h1 className='text-center  lg:text-center md:text-center sm:text-center  text-2xl 2xl:text-6xl xl:text-6xl lg:text-6xl  md:text-5xl sm:text-3xl mt-10 text-white uppercase font-serif'> the right guidance</h1>
                </div>
                <p className='text-center text-[10px]  text-white lg:text-2xl md:text-lg  sm:text-base mt-48 ml-28
                 min-[340px]:mt-10 min-[250px]:max-[360px]:mt-4 min-[250px]:max-[360px]:text-[5px]'>
                  Master self-defense with the flexibility to learn at your own pace.
                  Our platform allows you to progress according to your schedule and personal goals. With expert guidance,
                  you’ll receive the support and training needed to build confidence and skill in self-defensemin.
                </p>
              </div>

            </div>


            <div className='child_container_2 flex flex-col justify-end  bg-white  p-4'>

              <div className='mt-auto pb-36'>

                <h6 className=' 2xl:text-5xl xl:text-4xl lg:text-3xl text-center font-medium text-gray-800 uppercase 
                2xl:mb-[2%]  sm:mb-40 max-[600px]:mb-28 min-[430px]:max-[500px]:mb-40 min-[300px]:mb-0 mb-20  p-6 
                 md:text-2xl sm:text-xl'>
                  Build Confidence Fast
                </h6>

                <div className='mt-6 p-6 py-6  h-[150px] flex justify-center items-center rounded-lg w-66 2xl:text-xl xl:text-xl lg:text-xl md:text-lg sm:text-sm text-[10px]'>
                  <p className='text-center font-medium text-blue-950 p-4'>
                    Our martial arts program is designed to do more than just teach you fighting techniques — it's about transforming your mindset.
                    We start with fundamental skills that empower you to stand tall, face your fears, and approach challenges with confidence.
                    As you train, you’ll learn to trust in your own abilities and tackle problems head-on, no matter how intimidating they may seem.
                    With every session, you'll break through your limits and develop a sense of resilience that extends far beyond the gym.
                    Whether it’s on the mat or in life, our goal is to equip you with the mental and physical strength to push past adversity, overcome obstacles, and achieve your personal best.
                    Embrace the journey of growth, where each challenge is an opportunity to build unshakable confidence and become fearless in the face of life’s toughest moments.

                  </p>

                </div>

              </div>

            </div>

          </div>


          <div className='child_container_3 bg-opacity-50 p-4 flex flex-col sm:flex-row h-full'>

            <div className='relative child_3_1  w-full sm:w-1/2 rounded-lg overflow-hidden '>

              <div className='absolute inset-0 bg-black opacity-60'></div>

              <div className='relative  '>

                <h1 className='text-2xl 2xl:text-5xl text-center xl:text-4xl lg:text-xl md:text-lg md:ml-1 sm:ml-1 sm:text-sm 
                 text-gray-50 p-6 sm:text-center '>Subscribe for Expert Guidance</h1>

                <p className='2xl:text-2xl xl:text-lg  lg:text-md md:text-sm sm:text-xs text-white p-20 mt-auto leading-10'>
                  This platform connects you with expert martial arts tutors who offer personalized training to help you reach your goals.
                  Whether for self-defense or skill improvement, our tutors provide real-time support through chat and video call sessions.
                  To access these interactions, you’ll need to subscribe to one of our plans.
                  Receive tailored advice, feedback, and motivation to stay on track and continuously improve.
                  Our tutors are dedicated to helping you progress and build lasting martial arts skills.

                </p>
              </div>

            </div>


            <div className='w-full sm:w-1/2 p-6 mr-8 rounded-xl'>
              <div className='w-full sm:ml-10 mt-auto'>
                <h4 className='text-3xl text-center 2xl:text-5xl xl:text-2xl lg:text-lg md:text-lg sm:text-lg sm:text-center font-semibold mb-2 mt-20 pb-10  text-red-600'>Martial Arts Tutorial Classes:</h4>
                <p className='2xl:text-xl xl:text-lg lg:text-md md:text-sm sm:text-xs text-black leading-8'>
                  We offer a variety of tutorial classes in different martial arts styles, each taught by experienced tutors.
                  For example, karate tutorials are available from various specialized instructors, ensuring you find the right fit for your learning needs.
                  The fees for accessing these tutorials vary based on the tutor's expertise.
                </p>
                <p className='2xl:text-xl xl:text-lg lg:text-md md:text-xs sm:text-xs text-black leading-8 mt-1'>
                  If you wish to interact with a tutor, you can subscribe for chat and video call options.
                  First, check if the tutor is available for a chat, and then connect via video call for a more personal training experience.
                </p>
              </div>
            </div>


          </div>


          <div className=' child_container_4 bg-white  p-4 mt-20'>

            <h2 className='text-6xl text-center text-black mb-16'>Talk with Tutors</h2>

            <div className='flex flex-col  sm:flex-row justify-around'>

              <div className='bg-black p-10 mb-7 sm:p-6 rounded-lg shadow-zinc-700 w-full sm:w-1/4 '>
                <h3 className='text-xl p-6 font-semibold text-center text-red-600'>Monthly Plan</h3>

                <p className='text-center text-white mt-2'>
                  One month of personalized training sessions with expert tutors.
                </p>
              </div>


              <div className='bg-black p-10 mb-7 sm:p-6 rounded-lg shadow-zinc-700 w-full sm:w-1/4'>
                <h3 className='text-xl p-6 font-semibold text-center text-red-600'>Six-month Plan</h3>

                <p className='text-center text-white mt-2'>
                  Six months of tailored training sessions for sustained progress.
                </p>
              </div>



              <div className='bg-black p-10 mb-7 sm:p-6 rounded-lg shadow-zinc-700 w-full sm:w-1/4'>
                <h3 className='text-xl p-6 font-semibold text-center text-red-600'>Yearly Plan</h3>

                <p className='text-center text-white mt-2'>
                  One year of unlimited personalized training sessions.
                </p>
              </div>


            </div>




            <div className='mt-40 p-6 text-center'>
              <p className='text-sm sm:text-lg'>
                This website is dedicated to those who aspire to learn martial arts through engaging video tutorials and personalized assistance
                from expert tutors. While we do not offer certificates or belts, our primary focus is on empowering individuals with self-defense skills for personal safety and protection.
              </p>
              <p className='text-sm sm:text-lg mt-4'>
                Our platform provides the flexibility to learn at your own pace, allowing you to access instructional videos whenever it suits your schedule.
                Whether you are a busy professional or someone looking to enhance their fitness, you can practice self-defense techniques in the comfort of your home and at times that work best for you.
              </p>
              <p className='text-sm sm:text-lg mt-4'>
                Join us on this journey to boost your confidence, improve your physical fitness, and equip yourself with essential skills for self-protection.
                Our dedicated tutors are here to support you every step of the way, ensuring a fulfilling and enriching learning experience.
              </p>
            </div>
          </div>

          <div
            className="child_container_absolute absolute bg-zinc-800 rounded-lg sm:rounded-lg md:rounded-lg lg:rounded-lg xl:rounded-xl 2xl:rounded-2xl flex flex-col items-center
             lg:h-[300px] md:h-[250px] sm:h-[220px] xl:h-[350px] 2xl:h-[400px] h-[220px] 
              transform hover:scale-110 transition-transform duration-300 "

          >
            <h6 className='text-sm lg:text-4xl md:text-3xl xl:text-5xl 2xl:text-5xl sm:text-lg text-center 
            font-medium text-white uppercase p-3 sm:p-4 md:p-4 lg:p-4 xl:p-6 2xl:8
            sm:mb-3 mb-2 min-[250px]:max-[360px]:text-[12px]
            '>
              Become a tutor with us
            </h6>

            <div className='p-4 sm:p-4 lg:p-4 xl:p-4 2xl:p-6 mt-10  h-[50px] lg:h-[150px] md:h-[100px] sm:h-[50px] xl:h-[150px] 2xl:[150px] flex flex-col 
            lg:flex-row justify-center items-center space-y-4 lg:space-y-0 lg:space-x-4 rounded-lg'>
              <p className='text-center font-medium text-white p-4 md:p-4 sm:p-4 text-xs sm:text-xs md:text-sm lg:text-lg xl:text-xl 2xl:text-xl min-[250px]:max-[360px]:text-[8px]'>
                Are you passionate about teaching and looking to share your expertise? We invite you to join our
                team of dedicated tutors. Register here to become a tutor and help others learn and grow
              </p>

              <div className='flex space-x-4'>

                <button className='bg-blue-500 text-white text-xs lg:text-sm xl:text-base 2xl:text-lg md:text-xs font-bold py-2 px-4 rounded-lg hover:bg-blue-600'>
                  Login
                </button>

                <button className='bg-green-500 text-white text-xs lg:text-sm xl:text-base 2xl:text-lg md:text-xs font-bold py-2 px-4 rounded-lg hover:bg-green-600'>
                  Register
                </button>
              </div>

            </div>

          </div>

        </main>
        <Footer />
      </div>
    </>
  )
}

export default HomePage