import Home from "./pages/Home";
import About from "./pages/About";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import {FC} from "react";
import FileUploadPage from "./pages/FileUploadPage";

interface Route {
    key: string,
    title: string,
    path: string,
    enabled: boolean,
    component: FC<{}>
}

export const routes: Array<Route> = [
    {
        key: 'home-route',
        title: 'Home',
        path: '/',
        enabled: true,
        component: Home
    },
    {
        key: 'about-route',
        title: 'About',
        path: '/about',
        enabled: true,
        component: About
    },
    {
        key: 'profile-route',
        title: 'Profile',
        path: '/profile',
        enabled: true,
        component: Profile
    },
    {
        key: 'file_upload-route',
        title: 'Upload File',
        path: '/file_upload',
        enabled: true,
        component: FileUploadPage
    },
    {
        key: 'login-route',
        title: 'Login',
        path: '/login',
        enabled: true,
        component: Login
    },
    {
        key: 'register-route',
        title: 'Register',
        path: '/register',
        enabled: true,
        component: Register
    }
]