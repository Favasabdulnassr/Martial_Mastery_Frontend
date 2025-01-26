import React, { useEffect, useState } from 'react';
import TutorSidebar from "@/Components/TutorSidebar";
import TutorTopbar from "@/Components/TutorTopbar";
import {
  BookOpen,
  Play,
  AlertCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@/services/interceptor';
import Modal from '@/Components/Modal/ModalPortal';
import VideoModal from '@/Components/Modal/Videos/VideoModal';
import { toast } from 'react-toastify';
const PurchasedCourses = () => {
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [purchased_lessons,setPurchasedLessons] = useState([])
  const [tutorialId,setTutorialId] = useState(null)
  const navigate = useNavigate()

//   const [showVideoModal, setShowVideoModal] = useState(false);
//   const [selectedVideo, setSelectedVideo] = useState(null);
//   const navigate = useNavigate();

  useEffect(() => {
    fetchPurchasedCourses();
  }, []);

  const fetchPurchasedCourses = async () => {
    try {
      const response = await axiosInstance.get('payment/tutor/purchased-courses/');
      console.log('yyyyyyyyyyyyy',response.data);
      
      setPurchasedCourses(response.data);
    } catch (error) {
      console.error('Error fetching purchased courses:', error);
    }
  };

  const toggleCourse = async(courseId) => {
   
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
    if (expandedCourse !== courseId){

        setTutorialId(courseId)
        fetchLessons(courseId)
    
    }
  };

  const fetchLessons  = async (courseId) => {
    try {
        const response = await axiosInstance.get(`payment/tutor/courses/${courseId}/lessons/`);
        console.log('lesson',response.data);
        
        setPurchasedLessons(response.data);
      } catch (error) {
        console.error('Error fetching purchased courses:', error);
      }

  }

  const navigateVideo = (video) => {
    navigate(`/tutor/videoPage/${tutorialId}/${video.id}`,{replace:true})
  };


  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-100">
      <TutorSidebar />

      <div className="flex-1 lg:ml-80">
        <TutorTopbar />

        <div className="p-6 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold">Purchased Courses</h1>
            <p className="text-gray-400 mt-1">Manage and view your purchased courses</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Total Purchased Courses</p>
                    <p className="text-2xl font-bold mt-1">
                      {purchasedCourses.length}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Purchased Courses List */}
          <div className="space-y-4">
            {purchasedCourses.map((course) => (
              <Card key={course.id} className="bg-gray-800 border-gray-700">
                <CardHeader
                  className="cursor-pointer"
                  onClick={() => toggleCourse(course.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div>
                        <CardTitle className="text-lg font-semibold">
                          {course.course_title}
                        </CardTitle>
                        <p className="text-sm text-gray-400 mt-1">
                          {course.course_description}
                        </p>
                      </div>
                    </div>
                    {expandedCourse === course.id ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </CardHeader>

                {expandedCourse === course.id && (
                  <CardContent>
                    {purchased_lessons?.length === 0 ? (
                      <div className="flex items-center justify-center p-6 bg-gray-700/50 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-gray-400 mr-2" />
                        <p className="text-gray-400">No lessons available for this course.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {purchased_lessons?.map((lesson) => (
                          <div key={lesson.id} className="bg-gray-700 rounded-lg overflow-hidden">
                            <div
                              className="relative cursor-pointer"
                              onClick={() => navigateVideo(lesson)}
                            >
                              <img
                                src={lesson.thumbnail || '/api/placeholder/320/180'}
                                alt={lesson.title}
                                className="w-full h-40 object-cover"
                              />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                <Play className="w-12 h-12 text-white" />
                              </div>
                            </div>
                            <div className="p-4">
                              <h3 className="font-medium">{lesson.title}</h3>
                              <p className="text-sm text-gray-400 mt-1">{lesson.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {/* {showVideoModal && selectedVideo && (
        <Modal isOpen={showVideoModal} onClose={() => setShowVideoModal(false)}>
          <VideoModal
            video={selectedVideo}
            onClose={() => setShowVideoModal(false)}
          />
        </Modal>
      )} */}
    </div>
  );
};

export default PurchasedCourses;