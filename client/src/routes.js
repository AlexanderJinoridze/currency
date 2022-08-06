import React from "react";
import {
    Routes,
    Route
} from "react-router-dom";

import Home from './pages/Home';
import Embed from './pages/Embed';
import NoMatch from './pages/NoMatch';

export default function useRoutes() {
    return(
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="embed" exact element={<Embed />} />
            <Route path="*" element={<NoMatch />} />
        </Routes>
    )
}