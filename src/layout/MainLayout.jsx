import Sidebar from "./Sidebar";
import BottomBar from "./BottomBar";

function MainLayout({ children }) {
  return (
    <div className="d-flex">
      <Sidebar />

      <div
        className="flex-grow-1"
        style={{ marginLeft: "70px" }}
      >
        <div className="container-fluid py-4">
          {children}
        </div>
      </div>

      <BottomBar />
    </div>
  );
}

export default MainLayout;