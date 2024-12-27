import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sword, 
  Zap, 
  Target, 
  Medal, 
  Star, 
  ChevronRight, 
  Filter,
  Search
} from 'lucide-react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';

const courseCategories = [
  {
    name: 'Karate',
    icon: <Sword className="w-12 h-12" />,
    color: 'cyan',
    description: 'Traditional Japanese martial art focusing on striking techniques',
    tutors: [
      { 
        name: 'John Nakamura', 
        expertise: '5th Dan Black Belt', 
        experience: '20+ years', 
        rating: 4.8,
        price: 49
      },
      { 
        name: 'Sarah Kim', 
        expertise: '4th Dan Black Belt', 
        experience: '15 years', 
        rating: 4.6,
        price: 45
      }
    ]
  },
  {
    name: 'Muay Thai',
    icon: <Zap className="w-12 h-12" />,
    color: 'fuchsia',
    description: 'Traditional Thai striking art known as the "Art of Eight Limbs"',
    tutors: [
      { 
        name: 'Alex Rodriguez', 
        expertise: 'Professional Fighter', 
        experience: '12+ years', 
        rating: 4.9,
        price: 55
      },
      { 
        name: 'Elena Patel', 
        expertise: 'National Champion', 
        experience: '10 years', 
        rating: 4.7,
        price: 52
      }
    ]
  },
  {
    name: 'Brazilian Jiu-Jitsu',
    icon: <Target className="w-12 h-12" />,
    color: 'violet',
    description: 'Grappling-based martial art and combat sport',
    tutors: [
      { 
        name: 'Marcus Silva', 
        expertise: 'Black Belt', 
        experience: '18 years', 
        rating: 4.7,
        price: 59
      },
      { 
        name: 'Lisa Chen', 
        expertise: 'World Champion', 
        experience: '14 years', 
        rating: 4.6,
        price: 54
      }
    ]
  }
];

function CoursesPage() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const slideInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8 }
  };

  const filteredTutors = selectedCategory 
    ? selectedCategory.tutors.filter(tutor => 
        tutor.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <div className="h-20">
        <Header />
      </div>
      <main className="flex-1 overflow-hidden">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative min-h-[30vh] bg-[#0a0a0a]"
        >
          <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="text-5xl font-bold mb-6">
              <span className="block font-light text-zinc-300">Choose Your</span>
              <span className="block bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-violet-400 bg-clip-text text-transparent">
                Martial Arts Journey
              </span>
            </h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Explore our diverse range of martial arts courses and find the perfect tutor to guide your path.
            </p>
          </div>
        </motion.div>

        {/* Course Categories */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="py-16 bg-[#0a0a0a]"
        >
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              {courseCategories.map((course, index) => (
                <motion.div
                  key={index}
                  variants={slideInUp}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setSelectedCategory(course)}
                  className={`p-8 bg-black rounded-2xl shadow-xl border border-${course.color}-900/20
                    group relative overflow-hidden cursor-pointer ${
                      selectedCategory?.name === course.name 
                        ? `ring-2 ring-${course.color}-400` 
                        : ''
                    }`}
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
                    className={`absolute inset-0 bg-gradient-to-br from-${course.color}-500/10 to-transparent`}
                  />
                  <div className="relative">
                    <div className={`text-${course.color}-400 mb-4`}>
                      {course.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">
                      {course.name}
                    </h3>
                    <p className="text-zinc-400 mb-4">
                      {course.description}
                    </p>
                    <div className={`text-${course.color}-400 flex items-center font-semibold`}>
                      Select Course
                      <ChevronRight className="ml-2 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Tutors Section */}
        {selectedCategory && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="py-16 bg-black"
          >
            <div className="container mx-auto px-4">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-white">
                  {selectedCategory.name} Tutors
                </h2>
                <div className="relative">
                  <input 
                    type="text"
                    placeholder="Search tutors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-zinc-900 text-white rounded-full border border-zinc-700 focus:ring-2 focus:ring-cyan-400"
                  />
                  <Search className="absolute left-3 top-3 text-zinc-400" />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                {filteredTutors.map((tutor, index) => (
                  <motion.div
                    key={index}
                    variants={slideInUp}
                    whileHover={{ scale: 1.05 }}
                    className={`p-8 bg-black rounded-2xl shadow-xl border border-${selectedCategory.color}-900/20
                      group relative overflow-hidden`}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div className={`text-${selectedCategory.color}-400`}>
                        <Medal className="w-12 h-12" />
                      </div>
                      <div className="flex items-center text-yellow-400">
                        <Star className="w-5 h-5 mr-2" />
                        {tutor.rating}
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {tutor.name}
                    </h3>
                    <div className="text-zinc-400 mb-4">
                      <p>{tutor.expertise}</p>
                      <p>Experience: {tutor.experience}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-2xl font-bold text-cyan-400">
                        ${tutor.price}/session
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-6 py-3 bg-gradient-to-r from-${selectedCategory.color}-500 to-${selectedCategory.color}-400 
                          text-black font-semibold rounded-full shadow-lg transition-all duration-300 group`}
                      >
                        <span className="flex items-center gap-2">
                          Book Tutor
                          <ChevronRight className="group-hover:translate-x-2 transition-transform" />
                        </span>
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default CoursesPage;