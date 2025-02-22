import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MainLayout = () => {
  return (
    <div>
      <div className="h-[72px]">
        <Navbar />
      </div>
      <div className="min-h-[calc(100vh-364px)]">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
