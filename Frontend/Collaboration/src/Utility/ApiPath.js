export const BASE_URL = "http://localhost:3000"

export const API_PATH = {
    AUTH: {
        LOGIN: "/Auth/Login",
        REGISTER: "/REGISTER",
        PROFILE: "/Auth/profile"
    },
    ASSIGN: {
        CREATE: "/Assign/Create",
        UPDATE: (ID) => `/Assign/Update/${ID}`,
        UPLOAD_THUMBNAIL: (ID) => `/Assign/${ID}/upload-image`,
        ASSINGMENTS: "/Assign/Assingments",
        ASSINGMENTSID: (ID) => `/Assign/Assingments/${ID}`,
        GETSTUDENTS: "/Assign/Students",
        STUDENTASSINGMENTS: "/Assign/student",
        DELETE: (ID) => `/Assign/Assingments/${ID}`,
        STATS: "/Assign/Assingments/Count/By-day",
    },
    PARTIAL:
    {
        CREATE: "/Partial/Create",
        SAVE: (ID) => `/Partial/Save/${ID}`,
        SAVE_BY_INSTRUCTOR: (ID) => `/Partial/SaveEvaluation/${ID}`,
        UPDATE: (ID) => `/Partial/Update/${ID}`,
        UPLOAD_THUMBNAIL: (ID) => `/Partial/${ID}/upload-image`,
        GET_SUBMIT: "/Partial/SubmitAssingments",
        GET_ASSINGMENT_SUBMISSION: (ID) => `/Partial/SubmitAssingment/${ID}`,
        GET_STUDENTS_SUBMISSION: (ID) => `/Partial/SubmissionDetail/${ID}`,
        SAVE_THUMBNAIL: (ID) => `/Partial/SaveThumbnail/${ID}`
    }
}