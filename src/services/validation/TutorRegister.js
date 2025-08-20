import * as Yup from 'yup';



export const TutorRegistrationSchema = Yup.object().shape({
  first_name: Yup.string()
    .required('Full Name is required')
    .min(2, 'Full Name must be at least 2 characters'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  phone_number: Yup.string()
    .required('Phone number is required')
    .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits')
    .notOneOf(['0000000000'], 'Phone number cannot be all zeros')
    .test(
      'no-long-repeats',
      'Phone number cannot contain more than 5 identical digits in a row',
      (value) => !/(\d)\1{5,}/.test(value || '')
    ),

  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must include uppercase, lowercase, number, and special character'
    )
    .required('Password is required'),
  confirm_password: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
  experience: Yup.string()
    .required('Experience is required') // Makes the field required
    .min(25, 'Experience description must be at least 25 characters') // Checks minimum length
    .matches(
      /^[a-zA-Z0-9\s]+$/, // Only allows letters, numbers, and spaces (no special characters)
      'Experience must only contain letters, numbers, and spaces'
    )
});