import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Play, 
  Clock, 
  Target,
  Star,
  Search,
  ChevronRight, 
  MessageCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import axiosInstance from '@/services/interceptor';
import Modal from '@/Components/Modal/ModalPortal';
import VideoModal from '@/Components/Modal/Videos/VideoModal';

const TutorialVideoList = () => {
  const { tutorialId } = useParams();
  const [tutorial, setTutorial] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  // const [showVideoModal, setShowVideoModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchTutorial = async () => {
      try {
        const response = await axiosInstance.get(`payment/purchased-courses/${tutorialId}/lessons/`);
        console.log('entte ',response.data);
        
        setTutorial(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tutorial:', error);
        setLoading(false);
      }
    };

    fetchTutorial();
  }, [tutorialId]);

  // const openVideoModal = (video) => {
  //   console.log('ttttttttttt',video)
  //   setSelectedVideo(video);
  //   setShowVideoModal(true);
  // };

  const filteredVideos = tutorial?.filter(video =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );


  const navigateVideo = (video) => {
    navigate(`/videoPage/${tutorialId}/${video.id}`,{replace:true})
  };

  



  const slideInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8 }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
      </div>
    );
  }





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
              <span className="block font-light text-zinc-300">{tutorial?.title}</span>
              <span className="block bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-violet-400 bg-clip-text text-transparent">
                Video Lessons
              </span>
            </h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              {tutorial?.description}
            </p>
          </div>
        </motion.div>

        {/* Videos Section */}
        <div className="py-16 bg-black">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center space-x-4">
                <Target className="w-8 h-8 text-cyan-400" />
                <h2 className="text-3xl font-bold text-white">Available Videos</h2>
              </div>
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Search videos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-zinc-900 text-white rounded-full border border-zinc-700 focus:ring-2 focus:ring-cyan-400"
                />
                <Search className="absolute left-3 top-3 text-zinc-400" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredVideos?.map((video, index) => (
                <motion.div
                  key={video.id}
                  variants={slideInUp}
                  whileHover={{ scale: 1.05 }}
                  className="p-6 bg-black rounded-2xl shadow-xl border border-cyan-900/20 group relative overflow-hidden"
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
                    className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-transparent"
                  />
                  
                  <div className="relative">
                    <div 
                      className="relative cursor-pointer mb-4" 
                      onClick={() => navigateVideo(video)}
                    >
                      <img
                        src={video.thumbnail || '/api/placeholder/320/180'}
                        alt={video.title}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                        <Play className="w-12 h-12 text-white" />
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-3">{video.title}</h3>
                    <p className="text-l font-bold text-white mb-3">{video.description}</p>

                    
                    <div className="flex justify-between items-center text-zinc-400 mb-4">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{video.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 mr-2 text-yellow-400" />
                        <span>4.8</span>
                      </div>
                    </div>

                    <button
                      onClick={() => navigateVideo(video)}
                      className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-400 
                        text-black font-semibold rounded-full shadow-lg transition-all duration-300 group
                        hover:shadow-[0_0_20px_rgba(79,236,255,0.3)]"
                    >
                      <span className="flex items-center justify-center gap-2">
                        Watch Now
                        <ChevronRight className="group-hover:translate-x-2 transition-transform" />
                      </span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <motion.button
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 flex items-center gap-2 px-6 py-3 
          bg-gradient-to-r from-cyan-500 to-cyan-400 
          text-black font-semibold rounded-full shadow-lg 
          transition-all duration-300 hover:shadow-[0_0_20px_rgba(79,236,255,0.3)]
          group z-50"
      >
        <MessageCircle className="w-5 h-5" />
        <span>Chat with Tutor</span>
      </motion.button>

      <Footer />
    </div>
  );
};

export default TutorialVideoList;