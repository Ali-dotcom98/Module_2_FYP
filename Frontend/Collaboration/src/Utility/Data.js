import {
    LuLayoutDashboard,
    LuUsers,
    LuClipboardCheck,
    LuSquarePlus,
    LuLogOut,
} from "react-icons/lu";
import { FaTrophy } from "react-icons/fa"
import { LucideBarChart2 } from "lucide-react";

// import P1 from "../Layouts/Instructor/Icons/I1.svg"
// import P2 from "../Layouts/Instructor/Icons/I2.svg"
// import P3 from "../Layouts/Instructor/Icons/I3.svg"
// import P4 from "../Layouts/Instructor/Icons/I4.svg"

export const SIDE_MENU_DATA = [
    {
        id: "01",
        label: "Dashboard",
        icon: LuLayoutDashboard,
        path: "/Instructor/Dashboard",
    },

    {
        id: "02",
        label: "Create Assingment",
        icon: LuClipboardCheck,
        path: "/Instructor/CreateAssingment",
    },
    {
        id: "03",
        label: "Evaluation",
        icon: LucideBarChart2,
        path: "/Instructor/Evaluation",
    },

    {
        id: "04",
        label: "Logout",
        icon: LuLogOut,
        path: "logout",
    },
];

export const SIDE_MENU_DATA_User = [
    {
        id: "01",
        label: "Dashboard",
        icon: LuLayoutDashboard,
        path: "/Student/Dashboard",
    },
    {
        id: "02",
        label: "My Performance",
        icon: LuClipboardCheck,
        path: "/Student/Performance",
    },
    {
        id: "03",
        label: "Logout",
        icon: LuLogOut,
        path: "logout",
    },

];

// export const LanguageIcons = [
//     {
//         label: "C",
//         icons: P1,
//     },
//     {
//         label: "C++",
//         icons: P2,
//     },
//     {
//         label: "Java",
//         icons: P3,
//     }
//     ,
//     {
//         label: "Python",
//         icons: P4,
//     }


// ]

export const PRIORITY_DATA = [
    { label: "Low", value: "Low" },
    { label: "Medium", value: "Medium" },
    { label: "High", value: "High" },
];

export const STATUS_DATA = [
    { label: "Pending", value: "Pending" },
    { label: "In Progress", value: "In Progress" },
    { label: "Completed", value: "Completed" },
];

export const addThousandsSeparator = (num) => {
    if (num == null || isNaN(num)) return "";
    const [integerPart, fractionalPart] = num.toString().split(".");
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return fractionalPart
        ? `${formattedInteger}.${fractionalPart}`
        : formattedInteger;
};

