import axios from 'axios';

export const api = axios.create({
    baseURL: "http://localhost:3000/api", // Use HTTP for local development
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

export const getAllLikes = async () => {
  const email = localStorage.getItem("email")

   try {
    const res = await api.post(
      `/user/allLikes`,
      {
        email,
      },
      
    );
    console.log(res.data,"asdfghjkkjhgfdsdfghjk")
    return res.data;

    
  } catch (error) {
    // toast.error("Something went wrong while fetching bookings");
    // throw error

    console.log(error)
  }
}
<<<<<<< HEAD

export const getAllUsers = async () => {
  try {
    const response = await api.get("/user/allusers", {
      timeout: 10 * 10000,
    });
    if (response.status === 400 || response.status === 500) {
      throw response.data;
    }
    return response.data;
  } catch (error) {
    console.log("Something went wrong userall");
    throw error;
  }
};





export const getAllDraft = async () => {
  console.log("Hiii")
  try {
    const response = await api.get("/residency/alldrafts", {
      timeout: 10 * 10000,
    });
    if (response.status === 400 || response.status === 500) {
      throw response.data;
    }
    return response.data;
  } catch (error) {
    console.log("Something went wrong ");
    throw error;
  }
};
=======
>>>>>>> 9f26180c6a9f254a3848072cc9b365117cf52713
