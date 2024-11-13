import * as yup from 'yup';

export const createCustomerModal = yup.object().shape({
    customerName: yup.string().trim().required("Customer name is required"),
    branch: yup.string().trim().required("Branch is required"),
    mobile: yup.string().trim().required("Mobile number is required")
        .min(10, "Mobile number is too short!")
        .matches(/^[0-9]{10}$/, "Invalid mobile number"),
    email: yup.string().trim().required("Email is required")
        .email("Invalid email format"),
    address: yup.string().trim().required("Address is required"),
    knownVia: yup.string().trim().required("Source is required"),
    feedBack: yup.string().trim().required("Feedback is required")
})

export const updateCustomerModal = yup.object().shape({

    customerName: yup.string().trim(),
    branch: yup.string().trim(),
    mobile: yup.string().trim()
        .min(10, "Mobile number is too short!")
        .matches(/^[0-9]{10}$/, "Invalid mobile number"),
    email: yup.string().trim().email("Invalid email format"),
    address: yup.string().trim(),
    knownVia: yup.string().trim(),
    feedBack: yup.string().trim()
});

export const deleteCustomerModal = yup.object().shape({
    customerId: yup.string().trim().required("Customer ID is required for deletion")
});

export const getSingleCustomerModal = yup.object().shape({
    customerId: yup.string().trim().required("Customer ID is required for deletion")
});