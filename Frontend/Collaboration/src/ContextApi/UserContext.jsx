import axios from "axios";
import { createContext, useEffect, useState } from "react";
import AxiosInstance from "../Utility/AxiosInstance";
import { API_PATH } from "../Utility/ApiPath";
// import { API_PATHS } from "../../Utility/API_Path"
// import AxiosInstance from "../../Utility/AxiosInstance";

export const UserContext = createContext();

const UserProvider = ({ children }) => {

    const [User, setUser] = useState(null)
    const [loading, setLoading] = useState(true);
    console.log("User",User);
    
    useEffect(() => {
        const fetchUserData = async () => {
            try {   
                const result = await AxiosInstance.get(API_PATH.AUTH.PROFILE);
                setUser(result.data.user);
            } catch (error) {
                console.error('Error fetching user profile:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    },[]);

    const updateUser = (user, token) => {
        setUser(user);
        localStorage.setItem("token", token);
        setLoading(false);
    }

    const clearUser = () => {
        setUser(null)
        localStorage.removeItem("token");
    }
    return (
        <UserContext.Provider value={{ updateUser, clearUser, User, loading }}>
            {children}
        </UserContext.Provider>
    )
}
export default UserProvider