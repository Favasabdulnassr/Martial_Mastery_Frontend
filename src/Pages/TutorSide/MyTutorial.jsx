import React, { useEffect, useState } from 'react';
import TutorSidebar from "@/Components/TutorSidebar";
import TutorTopbar from "@/Components/TutorTopbar";
import {
  BookOpen,
  Video,
  Clock,
  Play,
  Edit,
  X,
  Trash2,
  ChevronDown,
  ChevronUp,
  Plus
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axiosInstance from '@/services/interceptor';
import Modal from '@/Components/Modal/ModalPortal';
import VideoModal from '@/Components/Modal/Videos/VideoModal';

const TutorTutorial = () => {
  // Sample data - In real app, fetch from API
  // const [tutorials, setTutorials] = useState([
  //   {
  //     id: 1,
  //     title: 'Basic Stances',
  //     description: 'Learn the fundamental stances in Karate',
  //     status: 'published',
  //     videos: [
  //       {
  //         id: 1,
  //         title: 'Front Stance Tutorial',
  //         duration: '10 mins',
  //         thumbnail: '/api/placeholder/320/180',
  //         url: '#'
  //       },
  //       {
  //         id: 2,
  //         title: 'Back Stance Guide',
  //         duration: '8 mins',
  //         thumbnail: '/api/placeholder/320/180',
  //         url: '#'
  //       }
  //     ]
  //   },
  //   {
  //     id: 2,
  //     title: 'Blocking Techniques',
  //     description: 'Master the essential blocking moves',
  //     status: 'published',
  //     videos: [
  //       {
  //         id: 3,
  //         title: 'Basic Blocks',
  //         duration: '15 mins',
  //         thumbnail: '/api/placeholder/320/180',
  //         url: '#'
  //       }
  //     ]
  //   }
  // ]);

  const [tutorials,setTutorials] = useState([]);
  const [expandedTutorial, setExpandedTutorial] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showTutorialModal, setShowTutorialModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const navigate = useNavigate()

  const { role, user } = useSelector((state) => (state.login));

  useEffect(() => {

    if (role !== 'tutor') {
      navigate('/')
    } else {
      fetchTutorials();

    }

  }, [role, navigate])


  const fetchTutorials = async () => {
    try {
      const tutorId = user?.id
      
      const response = await axiosInstance.get(`tutorials/list/${tutorId}/`)
      console.log(response);
      
      const fetchedTutorials = response.data.map(tutorial => ({
        ...tutorial,
        videos: tutorial.videos || []  // Ensure videos is always an array
      }));
      setTutorials(fetchedTutorials);
      

    } catch (error) {
      console.log(error)

    }

  }

  const toggleTutorial = (tutorialId) => {
    setExpandedTutorial(expandedTutorial === tutorialId ? null : tutorialId);
  };

  const handleAddTutorial = () => {
    navigate('/tutor/AddTutorials')
  };

  const handleAddVideo = (tutorial) => {
    navigate(`/tutor/tutorials/${tutorial.id}/addVideo`)
  };

  const handleDeleteTutorial = async (tutorial) => {
    try {
      const response = await axiosInstance.delete(`tutorials/delete-tutorial/${tutorial.id}/`);
      if (response.status === 200) {
        // Remove the tutorial from state
        setTutorials(tutorials.filter(t => t.id !== tutorial.id));
        setShowDeleteModal(false);
        // You might want to add a success toast notification here
      }
    } catch (error) {
      console.error('Error deleting tutorial:', error);
      // You might want to add an error toast notification here
    }
  };
  const handleDeleteVideo = async (video, tutorial) => {
    try {
      const response = await axiosInstance.delete(`tutorials/delete-video/${video.id}/`);
      if (response.status === 200) {
        // Update the tutorials state to remove the deleted video
        const updatedTutorials = tutorials.map(t => {
          if (t.id === tutorial.id) {
            return {
              ...t,
              videos: t.videos.filter(v => v.id !== video.id)
            };
          }
          return t;
        });
        setTutorials(updatedTutorials);
        setShowDeleteModal(false);
        // You might want to add a success toast notification here
      }
    } catch (error) {
      console.error('Error deleting video:', error);
      // You might want to add an error toast notification here
    }
  };

  const confirmDelete = () => {
    if (itemToDelete.type === 'tutorial') {
      // Implement tutorial delete logic
      setTutorials(tutorials.filter(t => t.id !== itemToDelete.item.id));
    } else {
      // Implement video delete logic
      const updatedTutorials = tutorials.map(tutorial => {
        if (tutorial.id === itemToDelete.tutorial.id) {
          return {
            ...tutorial,
            videos: tutorial.videos.filter(v => v.id !== itemToDelete.item.id)
          };
        }
        return tutorial;
      });
      setTutorials(updatedTutorials);
    }
    setShowDeleteModal(false);
    setItemToDelete(null);
  };


  const openVideoModal = (video) => {
    setSelectedVideo(video);
    setShowVideoModal(true);  // Show the modal when a video is clicked
  };
  

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-100">
      <TutorSidebar />

      <div className="flex-1 lg:ml-80">
        <TutorTopbar />

        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">My Tutorials</h1>
              <p className="text-gray-400 mt-1">Manage your tutorials and video content</p>
            </div>
            <button
              onClick={handleAddTutorial}
              className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Tutorial
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Total Tutorials</p>
                    <p className="text-2xl font-bold mt-1">{tutorials.length}</p>
                  </div>
                  <div className="h-12 w-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Total Videos</p>
                    <p className="text-2xl font-bold mt-1">
                      {tutorials.reduce((acc, tutorial) => acc + tutorial.videos.length||0, 0)}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
                    <Video className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tutorials List */}
          <div className="space-y-4">
            {tutorials.map((tutorial) => (
              <Card key={tutorial.id} className="bg-gray-800 border-gray-700">
                <CardHeader
                  className="cursor-pointer"
                  onClick={() => toggleTutorial(tutorial.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold">{tutorial.title}</CardTitle>
                      <p className="text-sm text-gray-400 mt-1">
                        {tutorial.videos.length} videos • {tutorial.description}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddVideo(tutorial);
                        }}
                        className="flex items-center px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Video
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTutorial(tutorial);
                        }}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      {expandedTutorial === tutorial.id ?
                        <ChevronUp className="w-5 h-5 text-gray-400" /> :
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      }
                    </div>
                  </div>
                </CardHeader>

                {expandedTutorial === tutorial.id && (
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {tutorial.videos.map((video) => (
                        <div key={video.id} className="bg-gray-700 rounded-lg overflow-hidden">
                          <div className="relative cursor-pointer"  onClick={() => openVideoModal(video)}>
                            <img
                              src={video.thumbnail}
                              alt={video.title}
                              className="w-full h-40 object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                              <Play className="w-12 h-12 text-white" />
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="font-medium">{video.title}</h3>
                            <div className="flex items-center justify-between mt-4">
                              <div className="flex items-center text-sm text-gray-400">
                                <Clock className="w-4 h-4 mr-1" />
                                {video.duration}
                              </div>
                              <button
                                onClick={() => handleDeleteVideo(video, tutorial)}
                                className="p-1 hover:bg-gray-600 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4 text-red-400" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="bg-gray-800 border-gray-700 w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Delete {itemToDelete?.type === 'tutorial' ? 'Tutorial' : 'Video'}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Are you sure you want to delete "{itemToDelete?.item.title}"? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}



{showVideoModal&& selectedVideo&&(
<Modal isOpen={showVideoModal} onClose={()=>setShowVideoModal(false)}>
  <VideoModal
  video={selectedVideo}
  onClose={()=>setShowVideoModal(false)}
  />

</Modal>
)}

      

    </div>
  );
};

export default TutorTutorial;