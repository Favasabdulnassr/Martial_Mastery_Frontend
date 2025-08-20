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
  ChevronLeft,
  Settings,
  Maximize,
  X
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
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const videoContainerRef = useRef(null);
  const [replyTo, setReplyTo] = useState(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
         // Add a short delay only when the component mounts
        await new Promise(resolve => setTimeout(resolve, 1000));
        const videoResponse = await axiosInstance.get(`payments/courses/${tutorialId}/lessons/${videoId}/`);
        setVideo(videoResponse.data);
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
    
    // Auto-hide controls after inactivity
    let controlsTimeout;
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(controlsTimeout);
      controlsTimeout = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false);
        }
      }, 3000);
    };

    videoElement.addEventListener('timeupdate', onTimeUpdate);
    videoElement.addEventListener('durationchange', onDurationChange);
    videoElement.addEventListener('loadedmetadata', onLoadedMetadata);

    // Add protection event listeners
    videoElement.addEventListener('contextmenu', preventContextMenu);
    videoContainer.addEventListener('contextmenu', preventContextMenu);
    window.addEventListener('keydown', preventKeyboardShortcuts);
    videoElement.addEventListener('dragstart', preventDrag);
    videoContainer.addEventListener('mousemove', handleMouseMove);
    
    // Disable picture-in-picture
    if (videoElement.disablePictureInPicture !== undefined) {
      videoElement.disablePictureInPicture = true;
    }

    return () => {
      videoElement.removeEventListener('timeupdate', onTimeUpdate);
      videoElement.removeEventListener('durationchange', onDurationChange);
      videoElement.removeEventListener('loadedmetadata', onLoadedMetadata);
      videoElement.removeEventListener('contextmenu', preventContextMenu);
      videoContainer.removeEventListener('contextmenu', preventContextMenu);
      window.removeEventListener('keydown', preventKeyboardShortcuts);
      videoElement.removeEventListener('dragstart', preventDrag);
      videoContainer.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(controlsTimeout);
    };
  }, [isDragging, isPlaying]);

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

  const toggleFullscreen = () => {
    const container = videoContainerRef.current;
    
    if (!document.fullscreenElement) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
      } else if (container.msRequestFullscreen) {
        container.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <Header />

      <main className="container mx-auto pt-4 px-2 sm:px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Video Section */}
          <div className="lg:w-3/4 w-full">
            {/* Video Player */}
            <div 
              ref={videoContainerRef}
              className="relative w-full rounded-lg overflow-hidden mt-16 sm:mt-20 bg-black"
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

              {/* Video Controls (conditionally shown) */}
              {showControls && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 sm:p-4 space-y-1 sm:space-y-2">
                  {/* Progress Bar */}
                  <div className="flex items-center space-x-2 sm:space-x-4">
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
                    <div className="flex items-center space-x-2 sm:space-x-4">
                      <button
                        onClick={togglePlayPause}
                        className="text-white hover:text-gray-300 transition"
                      >
                        {isPlaying ? <Pause className="w-5 h-5 sm:w-6 sm:h-6" /> : <Play className="w-5 h-5 sm:w-6 sm:h-6" />}
                      </button>

                      <div className="hidden sm:flex items-center space-x-2">
                        <button
                          onClick={toggleMute}
                          className="text-white hover:text-gray-300 transition"
                        >
                          {isMuted ? <VolumeX className="w-5 h-5 sm:w-6 sm:h-6" /> : <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />}
                        </button>
                        <input
                          type="range"
                          value={volume * 100}
                          onChange={handleVolumeChange}
                          className="w-16 sm:w-20 h-1 bg-gray-600 rounded-full appearance-none cursor-pointer"
                          min="0"
                          max="100"
                        />
                      </div>

                      <button
                        onClick={toggleMute}
                        className="sm:hidden text-white hover:text-gray-300 transition"
                      >
                        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                      </button>

                      <span className="text-white text-xs sm:text-sm">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 sm:space-x-4">
                      {/* Settings button (mobile friendly) */}
                      <div className="relative">
                        <button
                          onClick={toggleSettings}
                          className="text-white hover:text-gray-300 transition"
                        >
                          <Settings className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                        
                        {/* Settings popup */}
                        {showSettings && (
                          <div className="absolute bottom-full right-0 mb-2 bg-black/90 p-3 rounded-lg border border-gray-700 min-w-[150px] z-10">
                            <button 
                              onClick={() => setShowSettings(false)}
                              className="absolute top-2 right-2 text-gray-400 hover:text-white"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <div className="mb-3">
                              <p className="text-gray-400 text-xs mb-1">Playback Speed</p>
                              <select
                                value={speed}
                                onChange={(e) => {
                                  const newSpeed = parseFloat(e.target.value);
                                  videoRef.current.playbackRate = newSpeed;
                                  setSpeed(newSpeed);
                                }}
                                className="w-full bg-black/50 text-white text-sm rounded px-2 py-1 border border-gray-600"
                              >
                                <option value="0.5">0.5x</option>
                                <option value="1">1x</option>
                                <option value="1.5">1.5x</option>
                                <option value="2">2x</option>
                              </select>
                            </div>
                            <div>
                              <p className="text-gray-400 text-xs mb-1">Quality</p>
                              <select
                                value={quality}
                                onChange={(e) => setQuality(e.target.value)}
                                className="w-full bg-black/50 text-white text-sm rounded px-2 py-1 border border-gray-600"
                              >
                                <option value="1080">1080p</option>
                                <option value="720">720p</option>
                                <option value="480">480p</option>
                              </select>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Desktop settings controls */}
                      <div className="hidden md:flex items-center space-x-2">
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

                      {/* Fullscreen button */}
                      <button
                        onClick={toggleFullscreen}
                        className="text-white hover:text-gray-300 transition"
                      >
                        <Maximize className="w-5 h-5 sm:w-6 sm:h-6" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Play/Pause overlay in the center for better UX */}
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={togglePlayPause}
                    className="bg-black/30 rounded-full p-4 text-white hover:bg-black/50 transition"
                  >
                    <Play className="w-8 h-8 sm:w-12 sm:h-12" />
                  </button>
                </div>
              )}
            </div>

            {/* Video Info */}
            <div className="mt-4 pb-4 border-b border-gray-700 px-2">
              <h1 className="text-lg sm:text-xl font-bold text-white mb-2">{video?.title}</h1>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 sm:space-x-4 flex-wrap">
                  <div className="flex items-center text-gray-400">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="text-xs sm:text-sm">{video?.duration}</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-yellow-400" />
                    <span className="text-xs sm:text-sm">4.8</span>
                  </div>
                </div>
              </div>
              <p className="mt-3 text-gray-400 text-xs sm:text-sm line-clamp-3 sm:line-clamp-none">{video?.description}</p>
            </div>

            {/* Comments Section */}
            <CommentsSection lessonId={videoId} />
          </div>

          {/* Suggested Videos Section */}
         
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VideoPage;