export const BASE_URL = "http://localhost:3000"

export const API_PATH = {
    AUTH: {
        LOGIN: "/Auth/Login",
        REGISTER: "/REGISTER",
        PROFILE: "/Auth/profile"
    },
    ASSIGN: {
        CREATE: "/Assign/Create",
        ASSINGMENTS: "/Assign/Assingments",
        ASSINGMENTSID: (ID) => `/Assign/Assingments/${ID}`,
        GETSTUDENTS: "/Assign/Students"
    }
}