import axios from "axios";
import { redirect } from "react-router-dom";
axios.defaults.withCredentials = true;

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

const MAX_RETRIES = 3;

axiosInstance.interceptors.response.use(
  (response) => response,
  async function (error) {
    const originalRequest = error.config;
    if(error.response?.data?.message === "Access token not found!") return;
    if (
      (error.response?.data?.error?.message === "jwt expired" &&
        !originalRequest._retry)
    ) {
      if (!originalRequest.retryCount) {
        originalRequest.retryCount = 1;
      } else {
        originalRequest.retryCount++;
      }

      if (originalRequest.retryCount <= MAX_RETRIES) {
        originalRequest._retry = true;
        Api.refreshToken()
          .then(() => {
            window.location.reload()
            return axiosInstance(originalRequest);
          })
          .catch((error) => {
            if (error.response?.status === 401) {
              redirect("/login");
              Api.logOut();
              localStorage.removeItem("isAuthenticated");
              return Promise.reject(error);
            }
          });
      } else {
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

const Api = {
  //* auth

  logIn: (username, password) => {
    return axiosInstance.post("/login", {
      username,
      password,
    });
  },

  logOut: () => {
    return axiosInstance.post("/logout");
  },

  signUp: (username, password, email, firstName, lastName) => {
    return axiosInstance.post("/signup", {
      username,
      password,
      email,
      firstName,
      lastName,
    });
  },

  changePassword: (currentPassword, newPassword) => {
    return axiosInstance.post("/change-password", {
      currentPassword,
      newPassword,
    });
  },

  refreshToken: () => {
    return axiosInstance.post("/refresh-token");
  },

  //* invoices

  getInvoices: async () => {
    return axiosInstance
      .get("/invoices/get")
      .then((res) => res.data.allInvoices);
  },

  createInvoice: (data) => {
    return axiosInstance.post("/invoices/add", data);
  },

  editInvoice: (id, newData) => {
    return axiosInstance.put(`/invoices/update/${id}`, newData);
  },

  deleteInvoice: (id) => {
    return axiosInstance.delete(`/invoices/delete/${id}`);
  },

  //* profile

  getProfile: () => {
    return axiosInstance.get(`/profile/get-profile`);
  },

  editProfile: (data) => {
    return axiosInstance.post(`/profile/edit-profile`, data);
  },

  uploadProfilePicture: (base64image) => {
    return axiosInstance.post(`/profile/upload-picture`, {
      profilePicture: base64image,
    });
  },
};

export default Api;
