import * as yup from 'yup';

export const createProductModal = yup.object().shape({
    productName: yup.string().trim().required("Product name is required"),
    brand: yup.string().trim().required("Brand is required"),
    branch: yup.string().trim().required("Branch is required"),
    category: yup.string().trim().required("Category is required"),
    dealerName: yup.string().trim().required("DealerName is required"),
    mrp: yup.string().trim().required("MRP is required"),
    count: yup.string().trim().required("MRP is required"),
})

export const updateProductModal = yup.object().shape({
    productName: yup.string().trim(),
    brand: yup.string().trim(),
    branch: yup.string().trim(),
    category: yup.string().trim(),
    dealerName: yup.string().trim(),
    mrp: yup.string().trim(),
    count: yup.string().trim(),
});

export const deleteProductModal = yup.object().shape({
    productId: yup.string().trim().required("Product ID is required for deletion")
});

export const getSingleProductModal = yup.object().shape({
    productId: yup.string().trim().required("Product ID is required for deletion")
});