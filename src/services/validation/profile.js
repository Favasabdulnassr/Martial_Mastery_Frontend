// validationSchema.js

import * as Yup from 'yup';

export const ProfileValidationSchema = Yup.object({

    first_name: Yup.string()
        .required('First name is required')
        .min(2, 'First name must be at least 2 characters')
        .max(50, 'First name must be at most 50 characters')
        .matches(/^\S+$/, 'First name cannot contain spaces'), // No spaces allowed

    last_name: Yup.string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be at most 50 characters')
    .matches(/^\S+$/, 'First name cannot contain spaces'), // No spaces allowed



    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
        
    phone_number: Yup.string()
        .required('Phone number is required')
        .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits'),


});



