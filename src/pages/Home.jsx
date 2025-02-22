import { useNavigate } from "react-router";
import logo from "/Taskly-logo.webp";

const Home = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/tasks");
  };

  return (
    <div className="h-screen flex flex-col bg-black">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center h-4/5 text-center text-white">
        <img
          src="https://img.icons8.com/?size=100&id=9LCcCoTYXaRk&format=png&color=000000"
          alt="Taskly Logo"
          className="w-48 h-48 object-cover rounded-full mb-8 shadow-lg"
        />
        <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">
          Welcome to Task Managment App
        </h1>
        <p className="text-xl mb-6 opacity-90 drop-shadow-md">
          Your personal task management solution for seamless productivity.
        </p>
        <button onClick={handleGetStarted} className="btn btn-primary">
          Add Todo
        </button>
      </section>
    </div>
  );
};

export default Home;
