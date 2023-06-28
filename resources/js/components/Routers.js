import React,{Suspense} from 'react';
import {
    Routes,
    Route
} from "react-router-dom";
import Dashboard from "./Dashboard";
import Gifts from "./Gifts";
import Goals from "./Goals";
import ProgressBar from './ProgressBar';
import RecommendPopup from './RecommendPopup';
import Settings from './Settings';
import Contact from './Contact';
import CreateGoal from './CreateGoal';
import Goal from './Goal';

const Routers = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Routes>
                <Route exact path="/" element={<Gifts/>} />
                <Route path="/gifts" element={<Gifts/>} />
                <Route path="/goals" element={<Goals/>} />
                <Route path="/create-goal" element={<CreateGoal/>} />
                <Route path="/goals/:id" element={<Goal/>} />
                <Route path="/progress-bar" element={<ProgressBar/>} />
                <Route path="/recommend-popup" element={<RecommendPopup/>} />
                <Route path="/settings" element={<Settings/>} />
                <Route path="/contact" element={<Contact/>} />
            </Routes>
        </Suspense>
    );
};

export default Routers;