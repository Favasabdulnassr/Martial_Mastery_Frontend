import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import { 
  Play, 
  Clock, 
  Target,
  Star,
  Search,
  ChevronRight, 
  MessageCircle,
  Menu,
  X
} from 'lucide-react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import axiosInstance from '@/services/interceptor';

const TutorialVideoList = () => {
  const { tutorialId, tutorId } = useParams();
  const [tutorial, setTutorial] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTutorial = async () => {
      try {
         // Add a short delay only when the component mounts
        await new Promise(resolve => setTimeout(resolve, 1000));
        const response = await axiosInstance.get(`payment/purchased-courses/${tutorialId}/lessons/`);
        setTutorial(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tutorial:', error);
        setLoading(false);
      }
    };

    fetchTutorial();
  }, [tutorialId]);

  const filteredVideos = tutorial?.filter(video =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const navigateVideo = (video) => {
    navigate(`/videoPage/${tutorialId}/${video.id}`, { replace: true });
  };

  const handleChatWithTutor = () => {
    navigate(`/chat/${tutorId}`);
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

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
  };



  

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <div className="h-auto">
        <Header />
      </div>

      <main className="flex-1 overflow-hidden">
        {/* Hero Section */}
        <div 
          className="relative min-h-[20vh] md:min-h-[30vh] bg-[#0a0a0a] px-4 py-8 md:py-16"
        >
          <div className="container mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">
              <span className="block font-light text-zinc-300">{tutorial?.title}</span>
              <span className="block bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-violet-400 bg-clip-text text-transparent">
                Video Lessons
              </span>
            </h1>
            <p className="text-base md:text-xl text-zinc-400 max-w-2xl mx-auto">
              {tutorial?.description}
            </p>
          </div>
        </div>

        {/* Videos Section */}
        <div className="py-8 md:py-16 bg-black">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 gap-4">
              <div className="flex items-center space-x-2 md:space-x-4">
                <Target className="w-6 h-6 md:w-8 md:h-8 text-cyan-400" />
                <h2 className="text-2xl md:text-3xl font-bold text-white">Available Videos</h2>
              </div>
              
              {/* Mobile Search Toggle Button */}
              <div className="sm:hidden w-full flex justify-end">
                <button 
                  onClick={toggleSearch}
                  className="p-2 bg-zinc-900 rounded-full"
                >
                  {isSearchVisible ? 
                    <X className="w-5 h-5 text-white" /> : 
                    <Search className="w-5 h-5 text-white" />
                  }
                </button>
              </div>
              
              {/* Mobile Search Input (Conditionally Visible) */}
              {isSearchVisible && (
                <div className="w-full sm:hidden">
                  <input 
                    type="text"
                    placeholder="Search videos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-zinc-900 text-white rounded-full border border-zinc-700 focus:ring-2 focus:ring-cyan-400"
                    autoFocus
                  />
                  <Search className="absolute left-7 top-3 text-zinc-400" />
                </div>
              )}
              
              {/* Desktop Search (Always Visible) */}
              <div className="relative hidden sm:block">
                <input 
                  type="text"
                  placeholder="Search videos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-zinc-900 text-white rounded-full border border-zinc-700 focus:ring-2 focus:ring-cyan-400"
                />
                <Search className="absolute left-3 top-3 text-zinc-400 w-5 h-5" />
              </div>
            </div>

            {filteredVideos?.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-xl text-zinc-400">No videos found matching your search.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                {filteredVideos?.map((video, index) => (
                  <div
                    key={video.id}
                    className="p-4 md:p-6 bg-black rounded-2xl shadow-xl border border-cyan-900/20 group relative overflow-hidden"
                  >
                    <div
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
                          className="w-full h-40 md:h-48 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-70 hover:opacity-90 transition-opacity rounded-lg">
                          <Play className="w-10 h-10 md:w-12 md:h-12 text-white" />
                        </div>
                      </div>

                      <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3 line-clamp-2">{video.title}</h3>
                      <p className="text-sm md:text-base text-white mb-3 line-clamp-2">{video.description}</p>

                      

                      <button
                        onClick={() => navigateVideo(video)}
                        className="w-full px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-cyan-500 to-cyan-400 
                          text-black font-semibold rounded-full shadow-lg transition-all duration-300 
                          hover:shadow-[0_0_20px_rgba(79,236,255,0.3)] text-sm md:text-base"
                      >
                        <span className="flex items-center justify-center gap-2">
                          Watch Now
                          <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <button
        onClick={handleChatWithTutor}
        className="fixed bottom-4 right-4 md:bottom-8 md:right-8 flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 
          bg-gradient-to-r from-cyan-500 to-cyan-400 
          text-black text-sm md:text-base font-semibold rounded-full shadow-lg 
          transition-all duration-300 hover:shadow-[0_0_20px_rgba(79,236,255,0.3)]
          group z-50"
      >
        <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
        <span className="hidden sm:inline">Chat with Tutor</span>
      </button>

      <Footer />
    </div>
  );
};

export default TutorialVideoList;