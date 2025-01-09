import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, ArrowLeft } from 'lucide-react';
import axiosInstance from '@/services/interceptor';
import { toast } from 'react-toastify';
import TutorSidebar from '@/Components/TutorSidebar';  // Import Sidebar
import TutorTopbar from '@/Components/TutorTopbar';  // Import Topbar

const AddVideo = () => {
  const { tutorialId } = useParams(); // To get the tutorial ID from URL
  const navigate = useNavigate();
  const { role, user } = useSelector((state) => state.login);

  const [loading, setLoading] = useState(false);
  const [tutorial, setTutorial] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    video_file: null,
    thumbnail: null,
    order: '',
    is_active: true,
  });

  const [errors, setErrors] = useState({}); // For validation errors


  useEffect(() => {
    if (role !== 'tutor') {
      navigate('/');
    } else {
      fetchTutorial();
    }
  }, [role, navigate, tutorialId]);

  // Fetch the selected tutorial
  const fetchTutorial = async () => {
    try {
      console.log('kkkkkkkkkkkkkkkkeeeeeeeeeeeeeeeeeeee', tutorialId);


      const response = await axiosInstance.get(`tutorials/tutorial/${tutorialId}/`);
      setTutorial(response.data);
    } catch (error) {
      console.error('Error fetching tutorial:', error);
      toast.error('Failed to load tutorial');
    }
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files[0],
    }));
  }

  const handleCheckboxChange = () => {
    setFormData((prev) => ({
      ...prev,
      is_active: e.target.checked,
    }));
  };



  // Regex Validation Function
  const validateForm = () => {
    const errors = {};

    // Title validation: Allow only alphanumeric and specific symbols
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    } else if (!/^[a-zA-Z0-9\s:.-]+$/.test(formData.title)) {
      errors.title = 'Invalid title. Only letters, numbers, spaces, :, ., - are allowed.';
    }

    // Order validation: Must be a positive number
    if (!formData.order) {
      errors.order = 'Order is required';
    } else if (isNaN(formData.order) || formData.order <= 0) {
      errors.order = 'Order must be a positive number';
    }

    // Video file validation: Ensure a file is selected
    if (!formData.video_file) {
      errors.video_file = 'Video file is required';
    }

    // Thumbnail validation: Ensure image file is selected
    if (!formData.thumbnail) {
      errors.thumbnail = 'Thumbnail is required';
    } else if (!/\.(jpg|jpeg|png|gif)$/i.test(formData.thumbnail.name)) {
      errors.thumbnail = 'Thumbnail must be an image (jpg, jpeg, png, gif)';
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; // Stop if validation fails
    setLoading(true);

    try {
      const videoData = new FormData();
      videoData.append('tutorial', tutorialId)
      videoData.append('title', formData.title);
      videoData.append('video_file', formData.video_file); // Add video file
      videoData.append('thumbnail', formData.thumbnail); // Add thumbnail
      videoData.append('order', formData.order);
      videoData.append('is_active', formData.is_active);


      await axiosInstance.post(`tutorials/tutorial/${tutorialId}/upload_video/`, videoData);
      toast.success('Video added successfully');
      navigate(`/tutor/tutorials/`);
    } catch (error) {
      console.error('Error adding video:', error);
      toast.error('Failed to add video');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-100">
      <TutorSidebar />  {/* Add the sidebar */}

      <div className="flex-1 lg:ml-80">
        <TutorTopbar />  {/* Add the topbar */}

        <div className="p-6">
          <div className="flex items-center mb-6">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 p-2 hover:bg-gray-800 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold">Add Video to Tutorial</h1>
          </div>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              {tutorial && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Tutorial: {tutorial.title}</h3>
                  </div>

                  {/* Video Title */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Video Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className={`w-full bg-gray-700 border-gray-600 rounded-lg px-4 py-2.5 ${errors.title ? 'border-red-500' : ''
                        }`}
                      required
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}

                  </div>

                  {/* Video Filw */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Upload Video</label>
                    <input
                      type="file"
                      name="video_file"
                      onChange={handlFileChange}
                      className="w-full bg-gray-700 border-gray-600 rounded-lg px-4 py-2.5"
                      accept="video/*" // Only allow video files
                      required
                    />

                    {errors.video_file && (
                      <p className="text-red-500 text-sm mt-1">{errors.video_file}</p>
                    )}
                  </div>

                  {/* Video Order */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Order</label>
                    <input
                      type="number"
                      name="order"
                      value={formData.order}
                      onChange={handleInputChange}
                      className={`w-full bg-gray-700 border-gray-600 rounded-lg px-4 py-2.5 ${errors.order ? 'border-red-500' : ''
                        }`}
                      required
                    />
                    {errors.order && <p className="text-red-500 text-sm mt-1">{errors.order}</p>}
                  </div>


                  {/* Thumbnail Field */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Upload Thumbnail</label>
                    <input
                      type="file"
                      name="thumbnail"
                      onChange={handlFileChange}
                      className="w-full bg-gray-700 border-gray-600 rounded-lg px-4 py-2.5"
                      accept="image/*" // Only allow image files
                      required
                    />

                    {errors.thumbnail && (
                      <p className="text-red-500 text-sm mt-1">{errors.thumbnail}</p>
                    )}
                  </div>


                  {/* Active Status */}
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={handleCheckboxChange}
                        className="mr-2"
                      />
                      Active
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-6 py-2.5 rounded-lg"
                    >
                      {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        'Add Video'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddVideo;
