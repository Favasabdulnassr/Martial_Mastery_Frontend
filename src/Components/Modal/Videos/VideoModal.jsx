import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

const VideoModal = ({ video, onClose }) => {
  const videoRef = useRef(null);

  // State for controlling the video player
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [quality, setQuality] = useState(1080);
  const [isDragging, setIsDragging] = useState(false);


  useEffect(()=>{
    console.log('vvvvvvvvvvvvvvvvv',video);
    


  },[video])

  useEffect(() => {
    const videoElement = videoRef.current;
    
    const onTimeUpdate = () => {
      if (!isDragging) {
        setCurrentTime(videoElement.currentTime);
      }
    };

    const onDurationChange = () => {
      setDuration(videoElement.duration);
    };

    const onLoadedMetadata = () => {
      setDuration(videoElement.duration);
    };

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

  const handleSeekStart = () => {
    setIsDragging(true);
    if (isPlaying) {
      videoRef.current.pause();
    }
  };

  const handleSeeking = (e) => {
    const newTime = (e.target.value / 100) * duration;
    setCurrentTime(newTime);
  };

  const handleSeekEnd = (e) => {
    setIsDragging(false);
    const newTime = (e.target.value / 100) * duration;
    videoRef.current.currentTime = newTime;
    if (isPlaying) {
      videoRef.current.play();
    }
  };

  const handleVolumeChange = (e) => {
    const videoElement = videoRef.current;
    videoElement.volume = e.target.value / 100;
    setVolume(e.target.value / 100);
  };

  const toggleMute = () => {
    const videoElement = videoRef.current;
    videoElement.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSpeedChange = (e) => {
    const videoElement = videoRef.current;
    videoElement.playbackRate = parseFloat(e.target.value);
    setSpeed(parseFloat(e.target.value));
  };

  const handleQualityChange = (e) => {
    setQuality(e.target.value);
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 border-gray-700 p-6 w-full max-w-3xl mx-4 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-100">
            Watch: {video.title}
          </h3>
          <button onClick={onClose} className="text-white hover:text-gray-400">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="relative w-full">
          <video
            ref={videoRef}
            className="w-full"
            crossOrigin="anonymous"
            onClick={togglePlayPause}
          >
            <source src={video.video_url} type="video/mp4" />
          </video>
        </div>

        {/* Custom Video Controls */}
        <div className="flex flex-col space-y-4 mt-4">
          {/* Progress Bar */}
          <div className="flex items-center space-x-4">
            <input
              type="range"
              value={(currentTime / duration) * 100 || 0}
              onChange={handleSeeking}
              onMouseDown={handleSeekStart}
              onTouchStart={handleSeekStart}
              onMouseUp={handleSeekEnd}
              onTouchEnd={handleSeekEnd}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              min="0"
              max="100"
              step="0.1"
            />
            <span className="text-white text-sm min-w-[80px]">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              {/* Play/Pause Button */}
              <button
                onClick={togglePlayPause}
                className="text-white hover:text-gray-400 px-3 py-1 bg-gray-700 rounded"
              >
                {isPlaying ? 'Pause' : 'Play'}
              </button>

              {/* Mute Button */}
              <button
                onClick={toggleMute}
                className="text-white hover:text-gray-400 px-3 py-1 bg-gray-700 rounded"
              >
                {isMuted ? 'Unmute' : 'Mute'}
              </button>

              {/* Volume Control */}
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  value={volume * 100}
                  onChange={handleVolumeChange}
                  className="w-20 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  min="0"
                  max="100"
                />
                <span className="text-white text-sm">{Math.round(volume * 100)}%</span>
              </div>
            </div>

            <div className="flex space-x-4">
              {/* Playback Speed */}
              <select
                value={speed}
                onChange={handleSpeedChange}
                className="bg-gray-700 text-white border rounded px-2 py-1"
              >
                <option value="0.5">0.5x</option>
                <option value="1">1x</option>
                <option value="1.5">1.5x</option>
                <option value="2">2x</option>
              </select>

              {/* Quality Selector */}
              <select
                value={quality}
                onChange={handleQualityChange}
                className="bg-gray-700 text-white border rounded px-2 py-1"
              >
                <option value="1080">1080p</option>
                <option value="720">720p</option>
                <option value="480">480p</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;