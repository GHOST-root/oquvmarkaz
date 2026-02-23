import { Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";

// Pages
import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import Teachers from "./pages/Teachers";
// import Students from "./pages/Students";
import Groups from "./pages/Groups";
import Finance from "./pages/Finance";
import Reports from "./pages/Reports";
import Courses from "./pages/Courses";
import Staff from "./pages/Staff";
import Settings from "./pages/Settings";

//Outlets

import XarajatToifalari from "./components/finance/XarajatToifalari";
import Tolovlar from "./components/finance/Tolovlar";
// Reports
import Darslar from "./components/reports/Darslar";
import Konversiya from "./components/reports/Konversiya";
import Lidlarhisob from "./components/reports/Lidlar";
import Jiringhisob from "./components/reports/Qongiroqlar";
import Smshisob from "./components/reports/smslar";
import Tarketganhisob from "./components/reports/tarkEtganlar";
import Worklyhisob from "./components/reports/Workly";
// Settings
import Arxiv from "./components/settings/Arxiv";
import Holidays from "./components/settings/Holidays";
import { LeftStudents } from "./components/settings/LeftStudents";
import Profil from "./components/settings/Profil";
import Rooms from "./components/settings/Rooms";

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/leads/*" element={<Leads />} />
        <Route path="/teachers/*" element={<Teachers />} />
        {/* <Route path="/students" element={<Students />} /> */}
        <Route path="/groups/*" element={<Groups />} />
        <Route path="/finance/*" element={<Finance />}>
          <Route path="XarajatToifalari" element={<XarajatToifalari />}>
            <Route path="Tolovlar" element={<Tolovlar />} />
          </Route>
        </Route>
        <Route path="/reports/*" element={<Reports />}>
          <Route path="darslar" element={<Darslar />} />
          <Route path="konversiya" element={<Konversiya />} />
          <Route path="lidlar" element={<Lidlarhisob />} />
          <Route path="qongiroqlar" element={<Jiringhisob />} />
          <Route path="smslar" element={<Smshisob />} />
          <Route path="tarketganlar" element={<Tarketganhisob />} />
          <Route path="workly" element={<Worklyhisob />} />          
        </Route>
        <Route path="/courses/*" element={<Courses />} />
        <Route path="/staff/*" element={<Staff />} />
        <Route path="/settings/*" element={<Settings />}>
          <Route path="arxiv" element={<Arxiv />} />
          <Route path="bayram-kunlari" element={<Holidays />} />
          <Route path="ketgan-oquvchilar" element={<LeftStudents />} />
          <Route path="profil" element={<Profil />} />
          <Route path="xonalar" element={<Rooms />} />
        </Route>
      </Routes>
    </MainLayout>
  );
}

export default App;