import * as yup from 'yup';

export const createEmployeeModal = yup.object().shape({
    employeeName: yup.string().trim().required("Employee name is required"),
    employeeId: yup.string().trim().required("Employee Id is required"),
    branch: yup.string().trim().required("Branch is required"),
    mobile: yup.string().trim().required("Mobile number is required")
        .min(10, "Mobile number is too short!")
        .matches(/^[0-9]{10}$/, "Invalid mobile number"),
    email: yup.string().trim().required("Email is required")
        .email("Invalid email format"),
    address: yup.string().trim().required("Address is required"),
    dob: yup.string().trim().required("DOJ is required"),
    doj: yup.string().trim().required("DOB is required"),
    salary: yup.string().trim().required("Salary is required"),
    // idProof: yup.string().trim().required("Id proof is required")
})

export const updateEmployeeModal = yup.object().shape({
    employeeName: yup.string().trim(),
    branch: yup.string().trim(),
    mobile: yup.string().trim()
        .min(10, "Mobile number is too short!")
        .matches(/^[0-9]{10}$/, "Invalid mobile number"),
    email: yup.string().trim().email("Invalid email format"),
    address: yup.string().trim(),
    dob: yup.string().trim(),
    doj: yup.string().trim(),
    salary: yup.string().trim(),
    // idProof: yup.string().trim()
});

export const deleteEmployeeModal = yup.object().shape({
    employeeId: yup.string().trim().required("Employee ID is required for deletion")
});

export const getSingleEmployeeModal = yup.object().shape({
    employeeId: yup.string().trim().required("Employee ID is required for deletion")
});