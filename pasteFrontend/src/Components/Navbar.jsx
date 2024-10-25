import { NavbarData } from "../data/Navbar";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaUserCircle } from "react-icons/fa"; // Profile icon
import { logout } from "../services/operations/authApi";
// import { logoutUser } from "../services/operations/authApi"; // Assume you have a logout action

const Navbar = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handler for logging out the user
  const handleLogout = () => {
    dispatch(logout(navigate));
  };

  return (
    <div className="w-full h-[45px] flex justify-center items-center p-4 bg-gray-800 gap-x-5">
      {NavbarData.map((link, idx) => (
        <NavLink
          key={idx}
          to={link.path}
          className={({ isActive }) =>
            isActive
              ? "text-blue-500 font-semibold text-xl"
              : "text-white font-medium text-xl"
          }
        >
          {link.title}
        </NavLink>
      ))}

      {/* Show profile icon and extra links if user is logged in */}
      {token ? (
        <div className="flex items-center gap-4">
        
          {/* Profile Icon with dropdown */}
          <div className="relative group">
            {user?.profilePicture ? (
            <img
              src={user?.profilePicture}
              alt="Profile"
              className="w-6 h-6 rounded-full"
            />
            ) : (
            <FaUserCircle className="text-white text-2xl cursor-pointer" />
            )
          }
            {/* Dropdown menu */}
            <div className="absolute -right-20 mt-2 w-40 bg-white rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="px-4 py-2 text-gray-700 font-medium">
                {user?.name || "User"}
              </p>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Show login/signup links if not logged in
        <>
          <NavLink to="/login"  className={({ isActive }) =>
            isActive
              ? "text-blue-500 font-semibold text-xl"
              : "text-white font-medium text-xl"
          }>
            Login
          </NavLink>
          <NavLink to="/signup"  className={({ isActive }) =>
            isActive
              ? "text-blue-500 font-semibold text-xl"
              : "text-white font-medium text-xl"
          }>
            Signup
          </NavLink>
        </>
      )}
    </div>
  );
};

export default Navbar;
