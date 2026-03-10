import { Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";

// Pages
import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import Teachers from "./pages/Teachers";
import TalabalarPage from "./pages/Students";
import Groups from "./pages/Groups";
import Finance from "./pages/Finance";
import Reports from "./pages/Reports";
import Courses from "./pages/Courses";
import Staff from "./pages/Staff";
import Settings from "./pages/Settings";

// Timetable import qilinadi
import Timetable from "./components/dashboard/Timetable";

// Finance
import Tolovlar from "./components/finance/Tolovlar";

//Outlets
import XarajatToifalari from "./components/finance/XarajatToifalari";
import YechibOlish from "./components/finance/YechibOlish";
import Qarizdorlar from "./components/finance/Qarizdorlar";
// Reports
import Darslar from "./components/reports/Darslar";
import Konversiya from "./components/reports/Konversiya";
import Lidlarhisob from "./components/reports/Lidlar";
import Jiringhisob from "./components/reports/Qongiroqlar";
import Smshisob from "./components/reports/smslar";
import Tarketganhisob from "./components/reports/tarkEtganlar";
import Worklyhisob from "./components/reports/Workly";
// Settings
import Arxiv from "./components/settings/NewArxiv";
import Holidays from "./components/settings/Holidays";
import Leftgroup from "./components/settings/Leftgroup";
import Profil from "./components/settings/Profil";
import Rooms from "./components/settings/Rooms";
import UmumiySozlamalar from "./components/settings/UmumiySozlamalar";

// Students
import Profile from "./components/students/Profile";

// Bottom Bar
import Blog from "./pages/News";

// ichki qismlar
import News from "./pages/NewsS";

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/leads/*" element={<Leads />} />
        <Route path="/teachers/*" element={<Teachers />} />
        <Route path="/students/" element={<TalabalarPage />} />
        <Route path="/students/:id" element={<Profile />} />
        <Route path="/groups/*" element={<Groups />} />

        <Route path="/finance/*" element={<Finance />}>
          <Route path="barchasi" element={<Tolovlar />} />
          <Route path="withdraw" element={<YechibOlish />} />
          <Route path="qarzdorlar" element={<Qarizdorlar />} />
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
          <Route path="ketgan-oquvchilar" element={<Leftgroup />} />
          <Route path="profil" element={<Profil />} />
          <Route path="xonalar" element={<Rooms />} />
        </Route>

        {/* Bottom Bar */}
        <Route path="/blog/*" element={<Blog />} />

        {/* ichki qismlar */}
        <Route path="/news/*" element={<News />} />
      </Routes>

      {/* MUHIM: Timetable doim shu yerda, Routes'dan keyin turishi kerak! */}
      <Timetable isGlobal={true} />

    </MainLayout>
  );
}

export default App;