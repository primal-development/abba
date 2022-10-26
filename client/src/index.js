import React from 'react';
import { createRoot } from 'react-dom/client';
import Layout from './pages/Layout';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';

import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home/>}></Route>
                    <Route path="register" element={<Register />} />
                    <Route path="login" element={<Login />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}


const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<App tab="home" />);