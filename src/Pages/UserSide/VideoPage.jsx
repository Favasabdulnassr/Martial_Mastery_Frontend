import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Pause,
  Play,
  Volume2,
  VolumeX,
  MessageCircle,
  Send,
  Clock,
  Star,
  ThumbsUp,
  Reply,
  ChevronLeft
} from 'lucide-react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import axiosInstance from '@/services/interceptor';
import CommentsSection from '@/Components/comment';

const VideoPage = () => {
  const { tutorialId, videoId } = useParams();
  const videoRef = useRef(null);

  // Video player states
  const [video, setVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [quality, setQuality] = useState(1080);
  const [isDragging, setIsDragging] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoContainerRef = useRef(null);


  // Comments states
  // const [comments, setComments] = useState([]);
  // const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);



  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const videoResponse = await axiosInstance.get(`payment/purchased-course/${tutorialId}/lesson/${videoId}/`);
        setVideo(videoResponse.data);

        // // const commentsResponse = await axiosInstance.get(`/videos/${videoId}/comments`);
        // // setComments(commentsResponse.data);


        // setComments([
        //   {
        //     id: 1,
        //     user: {
        //       name: 'John Doe',
        //       avatar: '/api/placeholder/40/40',
        //       role: 'student'
        //     },
        //     content: 'Great explanation of the concept! Could you clarify the part about async functions?',
        //     timestamp: '2 hours ago',
        //     likes: 5,
        //     replies: [
        //       {
        //         id: 2,
        //         user: {
        //           name: 'Tutor Sarah',
        //           avatar: '/api/placeholder/40/40',
        //           role: 'tutor'
        //         },
        //         content: 'Async functions always return a promise. When you use await, it pauses the execution until the promise resolves.',
        //         timestamp: '1 hour ago',
        //         likes: 3
        //       }
        //     ]
        //   }
        // ]);




      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchVideo();
  }, [videoId, tutorialId]);


  // Video player functions
  useEffect(() => {
    if (!video) return;

    let videoUrl = video.cloudinary_url;
    if (videoUrl?.startsWith('video/upload/')) {
      videoUrl = videoUrl.replace('video/upload/', '');
    }

    if (videoRef.current && videoUrl) {
      videoRef.current.src = videoUrl;

    }
  }, [video]);

  useEffect(() => {
    const videoElement = videoRef.current;
    const videoContainer = videoContainerRef.current;

    if (!videoElement) return;

    const onTimeUpdate = () => {
      if (!isDragging) setCurrentTime(videoElement.currentTime);
    };

    const onDurationChange = () => setDuration(videoElement.duration);
    const onLoadedMetadata = () => setDuration(videoElement.duration);






    // Prevent context menu on video
    const preventContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    // Prevent keyboard shortcuts
    const preventKeyboardShortcuts = (e) => {
      // Prevent common download shortcuts
      if ((e.ctrlKey && e.key === 's') || // Ctrl+S
          (e.ctrlKey && e.key === 'c') || // Ctrl+C
          (e.key === 'F12') ||           // F12 (DevTools)
          (e.ctrlKey && e.shiftKey && e.key === 'i')) { // Ctrl+Shift+I (DevTools)
        e.preventDefault();
        return false;
      }
    };

    // Disable dragging of video
    const preventDrag = (e) => {
      e.preventDefault();
      return false;
    };




    videoElement.addEventListener('timeupdate', onTimeUpdate);
    videoElement.addEventListener('durationchange', onDurationChange);
    videoElement.addEventListener('loadedmetadata', onLoadedMetadata);



      // Add protection event listeners
      videoElement.addEventListener('contextmenu', preventContextMenu);
      videoContainer.addEventListener('contextmenu', preventContextMenu);
      window.addEventListener('keydown', preventKeyboardShortcuts);
      videoElement.addEventListener('dragstart', preventDrag);
      
      // Disable picture-in-picture
      if (videoElement.disablePictureInPicture !== undefined) {
        videoElement.disablePictureInPicture = true;
      }



    return () => {
      videoElement.removeEventListener('timeupdate', onTimeUpdate);
      videoElement.removeEventListener('durationchange', onDurationChange);
      videoElement.removeEventListener('loadedmetadata', onLoadedMetadata);
    };
  }, [isDragging]);

  const togglePlayPause = () => {
    const videoElement = videoRef.current;
    if (videoElement.paused) {
      videoElement.play();
      setIsPlaying(true);
    } else {
      videoElement.pause();
      setIsPlaying(false);
    }
  };

  const handleVolumeChange = (e) => {
    const value = e.target.value / 100;
    videoRef.current.volume = value;
    setVolume(value);
    setIsMuted(value === 0);
  };

  const toggleMute = () => {
    const newMutedState = !isMuted;
    videoRef.current.muted = newMutedState;
    setIsMuted(newMutedState);
    setVolume(newMutedState ? 0 : 0.5);
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <Header />

      <main className="container mx-auto  pt-4 px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Video Section */}
          <div className="lg:w-3/4">
            {/* Video Player */}
            <div 
            ref={videoContainerRef}

            className="relative w-full rounded-lg overflow-hidden mt-20 bg-black"
            onContextMenu={(e) => e.preventDefault()}


            >
              <div className="relative w-full pt-[56.25%]">
                <video
                  ref={videoRef}
                  className="absolute top-0 left-0 w-full h-full"
                  crossOrigin="anonymous"
                  onClick={togglePlayPause}
                  onContextMenu={(e) => e.preventDefault()}
                  controlsList="nodownload nofullscreen noremoteplayback"
                  disablePictureInPicture
                  disableRemotePlayback
                >
                  <source src={video?.cloudinary_url} type="video/mp4" />
                </video>
              </div>

              {/* Video Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 space-y-2">
                {/* Progress Bar */}
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    value={(currentTime / duration) * 100 || 0}
                    onChange={(e) => {
                      const newTime = (e.target.value / 100) * duration;
                      videoRef.current.currentTime = newTime;
                      setCurrentTime(newTime);
                    }}
                    className="w-full h-1 bg-gray-600 rounded-full appearance-none cursor-pointer hover:h-2 transition-all"
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </div>

                {/* Controls */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={togglePlayPause}
                      className="text-white hover:text-gray-300 transition"
                    >
                      {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                    </button>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={toggleMute}
                        className="text-white hover:text-gray-300 transition"
                      >
                        {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                      </button>
                      <input
                        type="range"
                        value={volume * 100}
                        onChange={handleVolumeChange}
                        className="w-20 h-1 bg-gray-600 rounded-full appearance-none cursor-pointer"
                        min="0"
                        max="100"
                      />
                    </div>

                    <span className="text-white text-sm">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4">
                    <select
                      value={speed}
                      onChange={(e) => {
                        const newSpeed = parseFloat(e.target.value);
                        videoRef.current.playbackRate = newSpeed;
                        setSpeed(newSpeed);
                      }}
                      className="bg-black/50 text-white text-sm rounded px-2 py-1 border border-gray-600"
                    >
                      <option value="0.5">0.5x</option>
                      <option value="1">1x</option>
                      <option value="1.5">1.5x</option>
                      <option value="2">2x</option>
                    </select>

                    <select
                      value={quality}
                      onChange={(e) => setQuality(e.target.value)}
                      className="bg-black/50 text-white text-sm rounded px-2 py-1 border border-gray-600"
                    >
                      <option value="1080">1080p</option>
                      <option value="720">720p</option>
                      <option value="480">480p</option>
                    </select>
                    
                  </div>


                  
                </div>
              </div>
            </div>

            {/* Video Info */}
            <div className="mt-4 pb-4 border-b border-gray-700">
              <h1 className="text-xl font-bold text-white mb-2">{video?.title}</h1>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-gray-400">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="text-sm">{video?.duration}</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <Star className="w-4 h-4 mr-2 text-yellow-400" />
                    <span className="text-sm">4.8</span>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-gray-400 text-sm">{video?.description}</p>
            </div>

            {/* Comments Section */}
            <CommentsSection lessonId = {videoId} />
          </div>

          {/* Suggested Videos Section - You can add this later */}
          <div className="lg:w-1/4 hidden lg:block">
            <div className="bg-[#0f0f0f] rounded-lg p-4">
              <h3 className="text-white font-medium mb-4">Up Next</h3>
              {/* Add suggested videos here */}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VideoPage;