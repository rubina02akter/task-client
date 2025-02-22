import { useContext, useState } from "react";
import { FiLogOut, FiMenu, FiX } from "react-icons/fi";

import { motion, AnimatePresence } from "framer-motion";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";

const Navbar = () => {
  const { user, loading, logOutUser } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = () => {
    logOutUser()
      .then(() => {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Logged out successfully.",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate("/");
      })
      .catch((error) => console.error("Logout Error:", error.message));
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  if (loading) {
    return (
      <div className="h-[100vh] flex justify-center items-center">
        <span className="loading loading-ring loading-lg"></span>
      </div>
    );
  }

  const links = (
    <>
      <li>
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-2 hover:text-gray-300 ${
              isActive ? "text-blue-500" : " text-black "
            }`
          }
        >
          Home
        </NavLink>
      </li>
      <li key="menu">
        <NavLink
          to="/tasks"
          className={({ isActive }) =>
            `flex items-center gap-2 hover:text-gray-300 ${
              isActive ? "text-blue-500" : " text-black "
            }`
          }
        >
          Task
        </NavLink>
      </li>
    </>
  );

  return (
    //{`${theme? "text-black" : "text-white"}`}
    <nav className="fixed top-0 w-full z-50 bg-white text-black shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="text-xl font-bold flex items-center">
          <p className="text-black text-3xl mx-auto mr-1"></p>
          <p>
            Task--<span>Management</span>
          </p>
        </div>
        <ul className="hidden lg:flex gap-8">{links}</ul>

        <div className="flex gap-2">
          <div>
            {user ? (
              <div className="dropdown dropdown-end z-50">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar"
                >
                  <div
                    title={user?.displayName || "User"}
                    className="w-10 rounded-full tooltip"
                    data-tip={user?.displayName}
                  >
                    <img
                      referrerPolicy="no-referrer"
                      alt="User Profile Photo"
                      src={user?.photoURL || ""}
                    />
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-blue-500 rounded-box md:w-52 w-32 text-xs"
                >
                  <li className="text-center font-extrabold underline">
                    {user.displayName}
                  </li>
                  <li className="mt-2">
                    <button
                      onClick={handleSignOut}
                      className="bg-white   text-black  block text-center"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="rounded-full flex items-center gap-2">
                <Link className="btn btn-outline mr-2" to="/login">
                  Login
                </Link>
              </div>
            )}
          </div>

          <button className="lg:hidden focus:outline-none" onClick={toggleMenu}>
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-2/5 py-3 bg-[#FDFAF3] bg-opacity-45 backdrop-blur-md text-black shadow-lg z-50 lg:hidden"
          >
            <button onClick={toggleMenu} className="text-black pl-3 ">
              <FiX size={24} />
            </button>
            <div className="flex justify-between items-center p-4 border-b">
              <span className="text-xl font-bold"></span>
            </div>
            <ul className="flex flex-col gap-4 p-6 bg-black h-screen">
              {links}
              {user ? (
                <li>
                  <button
                    onClick={handleSignOut}
                    className=" text-black  flex items-center gap-2 "
                  >
                    <FiLogOut /> Logout
                  </button>
                </li>
              ) : (
                <li>
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      `flex items-center gap-2 text-black hover:text-gray-300 ${
                        isActive ? "text-blue-500" : " text-black "
                      }`
                    }
                  >
                    <FiLogOut /> Login
                  </NavLink>
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
