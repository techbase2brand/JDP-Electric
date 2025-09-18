import axios from 'axios';

export const API_BASE_URL = 'https://jdpbackend.prorevv.com/api';
export const LOGIN_URL = `${API_BASE_URL}/auth/login`;

/* axios instance */

// ✅ Login API
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// api.interceptors.response.use(
//   response => response,
//   async error => {
//     if (error.response?.status === 401) {
//       //Aall App.js logout function call
//       if (global.handleLogout) {
//         global.handleLogout();
//       }
//     }
//     return Promise.reject(error);
//   },
// );

// ✅ Send OTP
export const sendForgotPasswordOtp = async email => {
  try {
    const res = await api.post('/auth/forgot-password/send-otp', {email});
    return res.data;
  } catch (error) {
    throw error.response?.data || {message: 'Something went wrong'};
  }
};

// ✅ Verify OTP
export const verifyForgotPasswordOtp = async (email, otp) => {
  try {
    const res = await api.post('/auth/forgot-password/verify-otp', {
      email,
      otp,
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || {message: 'Something went wrong'};
  }
};

// ✅ Resend OTP
export const resendForgotPasswordOtp = async email => {
  try {
    const res = await api.post('/auth/forgot-password/resend-otp', {email});
    return res.data;
  } catch (error) {
    throw error.response?.data || {message: 'Something went wrong'};
  }
};

// ✅ Reset Password
export const resetForgotPassword = async (
  email,
  newPassword,
  confirmPassword,
) => {
  try {
    const res = await api.post('/auth/forgot-password/reset', {
      email,
      newPassword,
      confirmPassword,
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || {message: 'Something went wrong'};
  }
};

// ✅ Logout API
export const logoutApi = async token => {
  console.log('tokentoken', token);

  try {
    const res = await api.post(
      '/auth/logout',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return res.data;
  } catch (error) {
    throw error.response?.data || {message: 'Something went wrong'};
  }
};

// ✅ Get Lead Labor by ID
export const getLeadLaborById = async (id, token) => {
  try {
    const res = await api.get(`/lead-labor/getLeadLaborById/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // if auth required
      },
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || {message: 'Something went wrong'};
  }
};

// ✅ Get Labor by ID
export const getLaborById = async (id, token) => {
  try {
    const res = await api.get(`/labor/getLaborById/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // if auth required
      },
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || {message: 'Something went wrong'};
  }
};

// ✅ Update Lead Labor Profile
export const updateLeadLaborProfile = async (id, formData, token) => {
  try {
    const res = await api.post(`/lead-labor/updateProfile/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || {message: 'Something went wrong'};
  }
};

// ✅ Update Labor Profile
export const updateLaborProfile = async (id, formData, token) => {
  try {
    const res = await api.post(`/labor/updateProfile/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || {message: 'Something went wrong'};
  }
};

// ✅ getSuppliers
export const getSuppliers = async (page = 1, limit = 10, token) => {
  try {
    const response = await api.get(
      `/suppliers/getAllSuppliers?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // 👈 token send here
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error(
      'Error fetching suppliers:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

// // ✅ Get All Products
// export const getAllProducts = async (page = 1, limit = 10, token) => {
//   try {
//     const response = await api.get(
//       `/products/getAllProducts?page=${page}&limit=${limit}`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`, // token required
//         },
//       },
//     );
//     return response.data;
//   } catch (error) {
//     console.error(
//       'Error fetching products:',
//       error.response?.data || error.message,
//     );
//     throw error.response?.data || {message: 'Something went wrong'};
//   }
// };
// ✅ Get Products by Supplier
export const getProductsBySupplier = async (
  supplierId,
  page = 1,
  limit = 10,
  token,
) => {
  try {
    const response = await api.get(
      `/products/getProductsBySupplier/${supplierId}?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // token required
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error(
      'Error fetching supplier products:',
      error.response?.data || error.message,
    );
    throw error.response?.data || {message: 'Something went wrong'};
  }
};

// ✅ Create Customer
export const createCustomer = async (payload, token) => {
  try {
    const response = await api.post(
      `/customer/createCustomer`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`, // 👈 Token required
        },
      },
    );
    return response.data; // 👈 Response object return karega
  } catch (error) {
    console.error(
      'Error creating customer:',
      error.response?.data || error.message,
    );
    throw error.response?.data || { message: 'Something went wrong' };
  }
};

// ✅ Get Customers
export const getCustomers = async (page = 1, limit = 10, token) => {
  try {
    const response = await api.get(
      `/customer/getCustomers?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // 👈 token required
        },
      },
    );
    return response.data; // { data: [], total: number }
  } catch (error) {
    console.error(
      'Error fetching customers:',
      error.response?.data || error.message,
    );
    throw error.response?.data || {message: 'Something went wrong'};
  }
};

// ✅ Get All Labor
export const getAllLabor = async (page = 1, limit = 10, token) => {
  try {
    const response = await api.get(
      `/labor/getAllLabor?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // 👈 token send karo
        },
      },
    );
    return response.data; // { data: [] }
  } catch (error) {
    console.error(
      'Error fetching labor:',
      error.response?.data || error.message,
    );
    throw error.response?.data || {message: 'Something went wrong'};
  }
};

// 🔹 Contractor API
export const getContractors = async (page = 1, limit = 10, token) => {
  try {
    const res = await api.get(
      `/contractor/getContractors?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return res.data;
  } catch (error) {
    console.error('Error fetching contractors:', error);
    throw error;
  }
};

// createJob
export const createJob = async (payload, token) => {
  try {
    const res = await api.post(`/job/createJob`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error('Error creating job:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Something went wrong' };
  }
};

// ✅ Get Jobs API
export const getJobs = async (leadLaborId,page = 1, limit = 10, token) => {
  try {
    const res = await api.get(
     `/job/getJobsByLeadLabor?leadLaborId=${leadLaborId}&page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data; // { data: [], totalPages, currentPage }
  } catch (error) {
    console.error('Error fetching jobs:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Something went wrong' };
  }
};


// custom product
export const createProduct = async (payload, token) => {
  try {
    const res = await api.post(`/products/createProduct`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error('Error creating product:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Something went wrong' };
  }
};
