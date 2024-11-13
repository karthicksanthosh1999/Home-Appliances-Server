import * as yup from 'yup';

export const createBranchModal = yup.object().shape({
    branchName: yup.string().trim().required("Branch name is missing!"),
    managerId: yup.string().trim().required("Manager is required"),
    street: yup.string().trim().required("Street is required"),
    city: yup.string().trim().required("City is required"),
    state: yup.string().trim().required("City is required"),
    country: yup.string().trim().required("Country is required")
})