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
import { Card, CardHeader, CardTitle, CardContent } from '@/Components/ui/card';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@/services/interceptor';
import { useTutorSidebar } from '@/Components/TutorSidebarProvider';

const PurchasedCourses = () => {
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [purchased_lessons, setPurchasedLessons] = useState([]);
  const [tutorialId, setTutorialId] = useState(null);
  const navigate = useNavigate();
  const { isSidebarTutorOpen } = useTutorSidebar();

  useEffect(() => {
    fetchPurchasedCourses();
  }, []);

  const fetchPurchasedCourses = async () => {
    try {
      const response = await axiosInstance.get('payment/tutor/purchased-courses/');
      console.log('Purchased courses:', response.data);
      setPurchasedCourses(response.data);
    } catch (error) {
      console.error('Error fetching purchased courses:', error);
    }
  };

  const toggleCourse = async (courseId) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
    if (expandedCourse !== courseId) {
      setTutorialId(courseId);
      fetchLessons(courseId);
    }
  };

  const fetchLessons = async (courseId) => {
    try {
      const response = await axiosInstance.get(`payment/tutor/courses/${courseId}/lessons/`);
      console.log('lessons:', response.data);
      setPurchasedLessons(response.data);
    } catch (error) {
      console.error('Error fetching lessons:', error);
    }
  };

  const navigateVideo = (video) => {
    navigate(`/tutor/videoPage/${tutorialId}/${video.id}`, { replace: true });
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

        {/* Page Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Header */}
          <div className="mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Purchased Courses</h1>
            <p className="text-sm sm:text-base text-gray-500 mt-1">Manage and view your purchased courses</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
            <Card className="bg-white border-gray-200">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">Total Purchased Courses</p>
                    <p className="text-lg md:text-2xl font-bold mt-1 text-gray-800">
                      {purchasedCourses.length}
                    </p>
                  </div>
                  <div className="h-10 w-10 md:h-12 md:w-12 bg-gray-600/20 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Purchased Courses List */}
          <div className="space-y-4">
            {purchasedCourses.map((course) => (
              <Card key={course.id} className="bg-white border-gray-200">
                <CardHeader
                  className="cursor-pointer p-4 md:p-6"
                  onClick={() => toggleCourse(course.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 pr-2">
                      <CardTitle className="text-base md:text-lg font-semibold text-gray-800">
                        {course.course_title}
                      </CardTitle>
                      <p className="text-xs md:text-sm text-gray-600 mt-1 line-clamp-2">
                        {course.course_description}
                      </p>
                    </div>
                    {expandedCourse === course.id ? (
                      <ChevronUp className="w-5 h-5 text-gray-600 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-600 flex-shrink-0" />
                    )}
                  </div>
                </CardHeader>

                {expandedCourse === course.id && (
                  <CardContent className="px-4 pb-4 md:px-6 md:pb-6">
                    {purchased_lessons?.length === 0 ? (
                      <div className="flex items-center justify-center p-4 md:p-6 bg-gray-50 rounded-lg">
                        <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-gray-600 mr-2" />
                        <p className="text-sm md:text-base text-gray-600">No lessons available for this course.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                        {purchased_lessons?.map((lesson) => (
                          <div key={lesson.id} className="bg-gray-200 rounded-lg overflow-hidden">
                            <div
                              className="relative cursor-pointer"
                              onClick={() => navigateVideo(lesson)}
                            >
                              <img
                                src={lesson.thumbnail || '/api/placeholder/320/180'}
                                alt={lesson.title}
                                className="w-full h-32 sm:h-36 md:h-40 object-cover"
                              />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                <Play className="w-8 h-8 md:w-12 md:h-12 text-white" />
                              </div>
                            </div>
                            <div className="p-3 md:p-4">
                              <h3 className="text-sm md:text-base font-medium line-clamp-1 text-gray-800">{lesson.title}</h3>
                              <p className="text-xs md:text-sm text-gray-600 mt-1 line-clamp-2">{lesson.description}</p>
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
    </div>
  );
};

export default PurchasedCourses;