import axios from 'axios';

export const api = axios.create({
    baseURL: "https://add-bot-server.vercel.app/api", // Use HTTP for local development
  });
  

  export const createUser = async (email,password) => {
    try {
      await api.post(
     `/user/register`,
       { email , password},
       
       
     );
   } catch (err) {
     console.log("Something wrong");
     throw err;
   }
 };

 export const createResidency = async (data) => {
console.log(data)
 
 
};


export const getAllProperties = async () => {
  try {
    const response = await api.get("/residency/allres", {
      timeout: 10 * 10000,
    });
    if (response.status === 400 || response.status === 500) {
      throw response.data;
    }
    return response.data;
  } catch (error) {
    console.log(error)
     throw error;
  }
};

export const getProperty = async (id) => {
  try {
    const response = await api.get(`/residency/${id}`, {
      timeout: 10 * 10000,
    });
    if (response.status === 400 || response.status === 500) {
      throw response.data;
    }
    return response.data;
  } catch (error) {
    console.log("Something went wrong ssh");
    throw error;
  }
};