import * as yup from "yup";

export const CreateUserSchema = yup.object().shape({
    firstName: yup
        .string()
        .trim()
        .required("First Name is missing!")
        .min(3, "First Name is too short!")
        .max(20, "First Name is too long!"),
    lastName: yup
        .string()
        .trim()
        .required("Last Name is missing!")
        .min(3, "Last Name is too short!")
        .max(20, "Last Name is too long!"),
    email: yup.string().required("Email is missing!").email("Invalid email id!"),
    mobile: yup.string().required('Mobile is missing!').min(10, "Mobile number is too sort!").matches(/^[0-9]{10}$/),
    password: yup
        .string()
        .trim()
        .required("Password is missing!")
        .min(8, "Password is too short!")
        .matches(
            /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#\$%\^&\*])[a-zA-Z\d!@#\$%\^&\*]+$/,
            "Password is too simple!"
        ),
    userType: yup.string().required("User type is required"),
    profile: yup.string().required("Profile is required"),
    dob: yup.string().required("Dob is required"),
    doj: yup.string().required("Doj is required"),
    Branch: yup.string().required("Branch is required"),
    salary: yup.number().required("salary is required"),
    address: yup.string().required("Address is required"),
});
