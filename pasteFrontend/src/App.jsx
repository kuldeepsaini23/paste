import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Components/Home";
import Login from "./Components/Auth/Login";
import Navbar from "./Components/Navbar";
import Signup from "./Components/Auth/Signup";
import Paste from "./Components/Paste/Paste";
import Verify from "./Components/Auth/Verify";
import AllPaste from "./Components/Paste/AllPaste";
import ViewPaste from "./Components/Paste/ViewPaste";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div className="w-full h-full flex flex-col">
        <Navbar />
        <Home />
      </div>
    ),
  },
  {
    path: "/create-paste",
    element: (
      <div className="w-full h-full flex flex-col">
        <Navbar />
        <Paste />
      </div>
    ),
  },
  {
    path: "/login",
    element: (
      <div className="w-full h-full flex flex-col gap-y-10">
        <Navbar />
        <Login />
      </div>
    ),
  },
  {
    path: "/signup",
    element: (
      <div className="w-full h-full flex flex-col gap-y-10">
        <Navbar />
        <Signup />
      </div>
    ),
  },

  {
    path: "/verify",
    element: (
      <div className="w-full h-full flex flex-col gap-y-10">
        <Navbar /> 
        <Verify />
      </div>
    ),
  },


  {
    path: "/all-pastes",
    element: (
      <div className="w-full h-full flex flex-col gap-y-10">
        <Navbar /> 
        <AllPaste />
      </div>
    ),
  },


  {
  path: "/paste/:id",
  element: (
    <div className="w-full h-full flex flex-col gap-y-10">
      <Navbar /> 
      <ViewPaste />
    </div>
  ),
},
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
