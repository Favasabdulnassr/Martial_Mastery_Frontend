import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  ChevronDown
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
// import { Alert, AlertDescription } from '@/components/ui/alert';
import TutorSidebar from '@/Components/TutorSidebar';
import TutorTopbar from '@/Components/TutorTopbar';
import axiosInstance from '@/services/interceptor';
import { toast } from 'react-toastify';

const AddTutorial = () => {
  const navigate = useNavigate();
  const { role, user } = useSelector((state) => state.login);
  
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  
  // Form state matching your Tutorial model
  const [formData, setFormData] = useState({
    course: '',  // For Course ForeignKey
    title: '',
    description: '',
    price: '' 

  });


    // Error state
    const [errors, setErrors] = useState({
      title: '',
      description: '',
      price: ''
    });
  
    // Regular expressions for validation
    const regex = {
      title: /^[a-zA-Z0-9 ]{3,50}$/,  // Title can contain letters, numbers, and spaces (3-50 characters)
      description: /^.{10,500}$/,  // Description should be between 10 to 500 characters
      price: /^[0-9]+(\.[0-9]{1,2})?$/  // Price should be a valid number (optional decimal places)
    };
  

  useEffect(() => {
    if (role !== 'tutor') {
      navigate('/');
    } else {
      fetchCourses();
    }
  }, [role, navigate]);

  const fetchCourses = async () => {
    try {
      const response = await axiosInstance.get('courses/');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    

      // Clear error message for the field as user types
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    };
  


  
  // Validate form data
  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    // Title validation
    if (!regex.title.test(formData.title)) {
      newErrors.title = 'Title should be alphanumeric and between 3 to 50 characters.';
      valid = false;
    }

    // Description validation
    if (!regex.description.test(formData.description)) {
      newErrors.description = 'Description should be between 10 and 500 characters.';
      valid = false;
    }

    // Price validation
    if (!regex.price.test(formData.price)) {
      newErrors.price = 'Price should be a valid number (e.g., 19.99).';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;  // Prevent submission if validation fails
    }
    setLoading(true);

    try {
      // Create tutorial with the selected course and tutor
      const tutorialData = {
        ...formData,
        tutor: user.id  // Current logged-in tutor's ID
      };
      console.log('useeeeeeeeeeeeeeeeeeeeeer',user)
      console.log('ddddddddddddddddddddda',tutorialData)

      await axiosInstance.post('tutorials/create/', tutorialData);
      toast.success('Tutorial created  Successfully')
      navigate('/tutor/tutorials')
    } catch (error) {
      console.error('Error creating tutorial:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-100">
      <TutorSidebar />
      
      <div className="flex-1 lg:ml-80">
        <TutorTopbar />
        
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center mb-6">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 p-2 hover:bg-gray-800 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold">Create New Tutorial</h1>
          </div>

          {/* {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )} */}

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Course Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Select Course
                  </label>
                  <div className="relative">
                    <select
                      name="course"
                      value={formData.course}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border-gray-600 rounded-lg px-4 py-2.5 appearance-none"
                      required
                    >
                      <option value="">Select a course</option>
                      {courses.map(course => (
                        <option key={course.id} value={course.id}>
                          {course.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                {/* Tutorial Title */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Tutorial Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border-gray-600 rounded-lg px-4 py-2.5"
                    required
                  />
                                    {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}

                </div>

                {/* Tutorial Description */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full bg-gray-700 border-gray-600 rounded-lg px-4 py-2.5"
                    required
                  />
                                    {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}

                </div>


                {/* Price */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Price
                  </label>
                  <input
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border-gray-600 rounded-lg px-4 py-2.5"
                    required
                  />
                  {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
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
                      'Create Tutorial'
                    )}
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddTutorial;