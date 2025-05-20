import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Pause,
  Play,
  Volume2,
  VolumeX,
  ChevronLeft
} from 'lucide-react';

import axiosInstance from '@/services/interceptor';
import CommentsSection from '@/Components/comment';
import TutorSidebar from '@/Components/TutorSidebar';
import TutorTopbar from '@/Components/TutorTopbar';
import { useTutorSidebar } from '@/Components/TutorSidebarProvider';

const TutorVideoPage = () => {
  const { tutorialId, videoId } = useParams();
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const { isSidebarTutorOpen } = useTutorSidebar();

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

  // Comments states
  const [replyTo, setReplyTo] = useState(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const videoResponse = await axiosInstance.get(`payment/tutor-purchased-course/${tutorialId}/lesson/${videoId}/`);
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
    if (!videoElement) return;

    const onTimeUpdate = () => {
      if (!isDragging) setCurrentTime(videoElement.currentTime);
    };

    const onDurationChange = () => setDuration(videoElement.duration);
    const onLoadedMetadata = () => setDuration(videoElement.duration);

    videoElement.addEventListener('timeupdate', onTimeUpdate);
    videoElement.addEventListener('durationchange', onDurationChange);
    videoElement.addEventListener('loadedmetadata', onLoadedMetadata);

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
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      {/* Sidebar - Fixed position on large screens, hidden or overlay on mobile */}
      <div className={`fixed top-0 left-0 h-full w-72 lg:w-80 bg-white transition-transform duration-300 ease-in-out lg:translate-x-0 z-20 ${
        isSidebarTutorOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <TutorSidebar />
      </div>

      {/* Main content area */}
      <div className="flex-1 lg:ml-80">
        {/* Topbar */}
        <TutorTopbar />

        {/* Video content area */}
        <div className="p-4 sm:p-6">
          {/* Mobile breadcrumb/back button - visible only on small screens */}
          <div className="flex items-center mb-4 lg:hidden">
            <button 
              onClick={() => navigate(-1)} 
              className="flex items-center text-gray-500 hover:text-gray-800 transition"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              <span className="text-sm">Back to courses</span>
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
            {/* Main Video Section */}
            <div className="w-full lg:w-3/4">
              {/* Video Player */}
              <div className="relative w-full rounded-lg overflow-hidden bg-black">
                <div className="relative w-full pt-[56.25%]">
                  <video
                    ref={videoRef}
                    className="absolute top-0 left-0 w-full h-full"
                    crossOrigin="anonymous"
                    onClick={togglePlayPause}
                  >
                    <source src={video?.cloudinary_url} type="video/mp4" />
                  </video>
                </div>

                {/* Video Controls */}
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
                  <div className="flex flex-wrap justify-between items-center">
                    <div className="flex items-center space-x-2 sm:space-x-4">
                      <button
                        onClick={togglePlayPause}
                        className="text-white hover:text-gray-300 transition"
                      >
                        {isPlaying ? <Pause className="w-5 h-5 sm:w-6 sm:h-6" /> : <Play className="w-5 h-5 sm:w-6 sm:h-6" />}
                      </button>

                      <div className="flex items-center space-x-2">
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
                          className="w-12 sm:w-20 h-1 bg-gray-600 rounded-full appearance-none cursor-pointer"
                          min="0"
                          max="100"
                        />
                      </div>

                      <span className="text-white text-xs sm:text-sm">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 sm:space-x-4 mt-1 sm:mt-0">
                      <select
                        value={speed}
                        onChange={(e) => {
                          const newSpeed = parseFloat(e.target.value);
                          videoRef.current.playbackRate = newSpeed;
                          setSpeed(newSpeed);
                        }}
                        className="bg-black/50 text-white text-xs sm:text-sm rounded px-1 sm:px-2 py-1 border border-gray-600"
                      >
                        <option value="0.5">0.5x</option>
                        <option value="1">1x</option>
                        <option value="1.5">1.5x</option>
                        <option value="2">2x</option>
                      </select>

                      <select
                        value={quality}
                        onChange={(e) => setQuality(e.target.value)}
                        className="bg-black/50 text-white text-xs sm:text-sm rounded px-1 sm:px-2 py-1 border border-gray-600"
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
              <div className="mt-4 pb-4 border-b border-gray-200">
                <h1 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">{video?.title}</h1>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-gray-500">
                      <span className="text-xs sm:text-sm">{video?.duration}</span>
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-gray-500 text-xs sm:text-sm">{video?.description}</p>
              </div>

              {/* Comments Section */}
              <CommentsSection lessonId={videoId} />
            </div>

           
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorVideoPage;