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
        ASSINGMENTS: "/Assign/Assingments",
        ASSINGMENTSID: (ID) => `/Assign/Assingments/${ID}`,
        GETSTUDENTS: "/Assign/Students",
        STUDENTASSINGMENTS: "/Assign/student"
    },
    PARTIAL:
    {
        CREATE: "/Partial/Create",
        SAVE: (ID) => `/Partial/Save/${ID}`,
        SAVE_BY_INSTRUCTOR: (ID) => `/Partial/SaveEvaluation/${ID}`,
        UPDATE: (ID) => `/Partial/Update/${ID}`,
        GET_SUBMIT: "/Partial/SubmitAssingments",
        GET_ASSINGMENT_SUBMISSION: (ID) => `/Partial/SubmitAssingment/${ID}`,
        GET_STUDENTS_SUBMISSION: (ID) => `/Partial/SubmissionDetail/${ID}`,

    }
}