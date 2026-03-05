import React from "react";
import YechibOlish from "./YechibOlish";
import XarajatToifalari from "./XarajatToifalari";
import Xarajatlar from "./Xarajatlar";
import IshHaqi from "./IshHaqi";
import StudentDashboard from "./StudentDashboard";
import Qarizdorlar from "./Qarizdorlar";
import InputAllReports from "./InputAllReports";
import InputSearch from "./Inputsearch";
import { Route, Routes } from "react-router-dom";
import Tolovlar from "./Tolovlar";

function AppMoliya() {
  return (
    <div>
      <Routes>
        <Route index element={<YechibOlish />} />
        <Route path="XarajatToifalari" element={<XarajatToifalari />} />
        <Route path="InputallReports" element={<InputAllReports />} />
        <Route path="Qarizdorlar" element={<Qarizdorlar />} />
        <Route path="Xarajatlar" element={<Xarajatlar />} />
        {/* <Route path="Tolovlar" element={<Tolovlar />} /> */}
        <Route path="IshHaqi" element={<IshHaqi />} />
        <Route path="Student" element={<StudentDashboard />} />
        <Route path="search" element={<InputSearch />} />
      </Routes>
    </div>
  );
}

export default AppMoliya;