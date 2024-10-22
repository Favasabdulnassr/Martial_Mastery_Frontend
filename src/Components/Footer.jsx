import React from 'react'

function Footer() {
  return (
    <>
      <footer className='bg-gray-600 text-white h-64 flex flex-col justify-around p-6 min-h-max min-w-full  right-0'>
        <div className='flex flex-col text-center md:flex-row justify-around'>

          <div className='text-center md:text-left'>
            <p className='mt-6 text-center md:mt-11 md:text-4xl text-3xl '># Martial Mastery</p>

          </div>
          <div className='flex flex-col mt-4 md:mt-0'>
            <h6 className="footer-title text-lg font-semibold">Services</h6>
            <a className="link link-hover">Branding</a>
            <a className="link link-hover">Design</a>
            <a className="link link-hover">Marketing</a>
            <a className="link link-hover">Advertisement</a>
          </div>
          <div className='flex flex-col mt-4 md:mt-0'>
            <h6 className="footer-title">Company</h6>
            <a className="link link-hover">About us</a>
            <a className="link link-hover">Contact</a>
            <a className="link link-hover">Jobs</a>
            <a className="link link-hover">Press kit</a>
          </div>
          <div className='flex flex-col mt-4 md:mt-0'>
            <h6 className="footer-title">Legal</h6>
            <a className="link link-hover">Terms of use</a>
            <a className="link link-hover">Privacy policy</a>
            <a className="link link-hover">Cookie policy</a>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer