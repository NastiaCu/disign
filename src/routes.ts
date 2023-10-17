import Home from "./pages/Home";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import Login from "./pages/Login";
import {FC} from "react";

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
        key: 'FAQ-route',
        title: 'Products',
        path: '/products',
        enabled: true,
        component: FAQ
    },
    {
        key: 'login-route',
        title: 'Login',
        path: '/login',
        enabled: true,
        component: Login
    }
]