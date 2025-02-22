import { FaFacebook, FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-black border-t text-white py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between items-center">
          {/* Left side: Logo and company info */}
          <div className="w-full sm:w-1/3 mb-6 sm:mb-0">
            <img
              src="https://img.icons8.com/?size=100&id=9LCcCoTYXaRk&format=png&color=000000"
              alt="Taskly Logo"
              className="w-20 h-20 rounded-full object-cover mb-4"
            />
            <p className="font-semibold text-lg mb-2">Task Management.</p>
            <p className="text-sm text-gray-400">
              Providing solutions to your productivity problems
            </p>
          </div>

          {/* Center: Quick links */}
          <div className="w-full sm:w-1/3 text-center mb-6 sm:mb-0">
            <h3 className="font-semibold text-xl mb-3">Quick Links</h3>
            <ul>
              <li>
                <a href="/" className="hover:text-gray-300">
                  Home
                </a>
              </li>

              <li>
                <a href="/tasks" className="hover:text-gray-300">
                  Tasks
                </a>
              </li>
              {/* <li>
                <a href="/contact" className="hover:text-gray-300">
                  Contact
                </a>
              </li> */}
            </ul>
          </div>

          {/* Right side: Social Media Icons */}
          <div className="w-full sm:w-1/3 text-center">
            <h3 className="font-semibold text-xl mb-3">Follow Us</h3>
            <div className="flex justify-center gap-6">
              <a href="#" className="text-gray-400 hover:text-white">
                <FaFacebook size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FaTwitter size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FaLinkedin size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FaGithub size={24} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-gray-500 text-sm">
          <p>
            Copyright © {new Date().getFullYear()} - Task Management. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
