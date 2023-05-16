import React,{Suspense} from 'react';
import {
    Routes,
    Route
} from "react-router-dom";
import Dashboard from "./Dashboard";
import GoalTypes from "./GoalTypes";
import Gifts from "./Gifts";
import Goals from "./Goals";
import ProgressBar from './ProgressBar';
import RecommendPopup from './RecommendPopup';
import Settings from './Settings';
import Contact from './Contact';

const Routers = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Routes>
                <Route exact path="/" element={<Gifts/>} />
                <Route path="/admin/goal-types" element={<GoalTypes/>} />
                <Route path="/admin/goals" element={<Goals/>} />
                <Route path="/admin/progress-bar" element={<ProgressBar/>} />
                <Route path="/admin/recommend-popup" element={<RecommendPopup/>} />
                <Route path="/admin/settings" element={<Settings/>} />
                <Route path="/admin/contact" element={<Contact/>} />
            </Routes>
        </Suspense>
    );
};

export default Routers;