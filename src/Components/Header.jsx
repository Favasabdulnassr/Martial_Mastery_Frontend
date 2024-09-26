import React from 'react'

function Header() {
  return (
    <>
    <header className='bg-black text-white py-8 fixed top-0 w-full z-10'>
        <nav className='container mx-auto flex justify-start items-center' style={{gap:'300px'}}>
            <h1 className='text-2xl font-bold '>Martial Mastery</h1>
            <ul className='flex space-x-20'>
                <li>Home</li>
                <li>Contact us</li>
                <li>About us</li>
                <li>Course</li>
            </ul>
        </nav>
    </header>

    </>
  )
}

export default Header
