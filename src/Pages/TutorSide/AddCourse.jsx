import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  ChevronDown
} from 'lucide-react';
import { Card, CardContent } from '@/Components/ui/card';
// import { Alert, AlertDescription } from '@/components/ui/alert';
import TutorSidebar from '@/Components/TutorSidebar';
import TutorTopbar from '@/Components/TutorTopbar';
import axiosInstance from '@/services/interceptor';
import { toast } from 'react-toastify';

const AddCourse = () => {
  const navigate = useNavigate();
  const { role, user } = useSelector((state) => state.login);
  
  const [loading, setLoading] = useState(false);
  
  // Form state matching your Tutorial model
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration_weeks: '' ,
    fees:'',
    status:'pending'

  });

  // useEffect( () =>{

  //   console.log(user.id)

  // },[])

    // Error state
    const [errors, setErrors] = useState({
      title: '',
      description: '',
      duration_weeks: '' ,
      fees: ''


    });
  
    // Regular expressions for validation
    const regex = {
      title: /^[a-zA-Z0-9 ]{3,200}$/,  // Title can contain letters, numbers, and spaces (3-200 characters)
      description: /^.{10,500}$/,  // Description should be between 10 to 500 characters
      duration_weeks: /^[1-9][0-9]*$/,  // Duration should be a positive integer
      fees: /^[0-9]+(\.[0-9]{1,2})?$/  // Fees should be a valid number (optional decimal places)
    };
  

    useEffect(() => {
      if (role !== 'tutor') {
        navigate('/');
      }
    }, [role, navigate]);



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
      newErrors.title = 'Title should be alphanumeric and between 3 to 200 characters.';
      valid = false;
    }

    // Description validation
    if (!regex.description.test(formData.description)) {
      newErrors.description = 'Description should be between 10 and 500 characters.';
      valid = false;
    }

    // Duration validation
    if (!regex.duration_weeks.test(formData.duration_weeks)) {
      newErrors.duration_weeks = 'Duration should be a positive integer.';
      valid = false;
    }

    // Fees validation
    if (!regex.fees.test(formData.fees)) {
      newErrors.fees = 'Fees should be a valid number (e.g., 19.99).';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting form data:', formData);

    if (!validateForm()) {
      return;  // Prevent submission if validation fails
    }
    setLoading(true);

    try {
      // Create tutorial with the selected course and tutor
      const CourseData = {
        ...formData,
        tutor: user.id  // Current logged-in tutor's ID
      };
      console.log('Course creation response:', CourseData);


      await axiosInstance.post('course/', CourseData);
      toast.success('Course created  Successfully')
      navigate('/tutor/CourseManagement')
    } catch (error) {
      console.error('Error creating tutorial:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-indigo-50 text-gray-800">
      <TutorSidebar />
      
      <div className="flex-1 lg:ml-80">
        <TutorTopbar />
        
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center mb-6">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 p-2 hover:bg-indigo-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-indigo-900">Create New Course</h1>
          </div>

          {/* {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )} */}

          <Card className="bg-white border-indigo-200">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Course Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-indigo-800">
                    Course Title
                  </label>
                  <div className="relative">
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full bg-indigo-50 border-indigo-200 rounded-lg px-4 py-2.5"
                    required
                  />
                  {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-indigo-400" />
                  </div>
                </div>

                 {/* Course Description */}
                 <div>
                  <label className="block text-sm font-medium mb-2 text-indigo-800">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full bg-indigo-50 border-indigo-200 rounded-lg px-4 py-2.5"
                    required
                  />
                  {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-indigo-800">Duration (in weeks)</label>
                  <input
                    type="number"
                    name="duration_weeks"
                    value={formData.duration_weeks}
                    onChange={handleInputChange}
                    className="w-full bg-indigo-50 border-indigo-200 rounded-lg px-4 py-2.5"
                    min="1"
                    required
                  />
                  {errors.duration_weeks && <p className="text-red-500 text-sm">{errors.duration_weeks}</p>}
                </div>

                {/* Fees */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-indigo-800">Fees</label>
                  <input
                    type="number"
                    name="fees"
                    value={formData.fees}
                    onChange={handleInputChange}
                    className="w-full bg-indigo-50 border-indigo-200 rounded-lg px-4 py-2.5"
                    step="0.01" // Allow decimal points
                    min="0"
                    required
                  />
                  {errors.fees && <p className="text-red-500 text-sm">{errors.fees}</p>}
                </div>


                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      'Create Course'
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

export default AddCourse;