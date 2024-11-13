import * as yup from 'yup';

export const createLeadModal = yup.object().shape({
    customerName: yup.string().trim().required("Customer name is required"),
    branch: yup.string().trim().required("Branch is required"),
    mobile: yup.string().trim().required("Mobile number is required")
        .min(10, "Mobile number is too short!")
        .matches(/^[0-9]{10}$/, "Invalid mobile number"),
    email: yup.string().trim().required("Email is required")
        .email("Invalid email format"),
    address: yup.string().trim().required("Address is required"),
    knownVia: yup.string().trim().required("Source is required"),
    remainder: yup.string().trim().required("Feedback is required"),
    status: yup.string().trim().required("Status is required"),
    suggestion: yup.string().trim().required("suggestion is required"),
})

export const updateLeadModal = yup.object().shape({

    customerName: yup.string().trim(),
    branch: yup.string().trim(),
    mobile: yup.string().trim()
        .min(10, "Mobile number is too short!")
        .matches(/^[0-9]{10}$/, "Invalid mobile number"),
    email: yup.string().trim().email("Invalid email format"),
    address: yup.string().trim(),
    knownVia: yup.string().trim(),
    remainder: yup.string().trim(),
    updateOn: yup.string().trim(),
    status: yup.string().trim(),
    suggestion: yup.string().trim()
});

export const deleteLeadModal = yup.object().shape({
    customerId: yup.string().trim().required("Lead ID is required for deletion")
});

export const getSingleLeadModal = yup.object().shape({
    customerId: yup.string().trim().required("Lead ID is required for deletion")
});