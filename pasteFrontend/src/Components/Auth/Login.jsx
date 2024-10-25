import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { login, sendOtp } from "../../services/operations/authApi";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSignupData } from "../../redux/authSlice";
import { BiHide, BiShow } from "react-icons/bi";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loginWithEmail, setLoginWithEmail] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token, signupData } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.user);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (data) => {
    // console.log(data);
    if(loginWithEmail){
      dispatch(setSignupData(data.email))
      //sentotp
     dispatch(sendOtp(data.email, navigate));
    }
    else{
      dispatch(login(data.email, data.password, navigate));
    }
   
  };

 

  useEffect(() => {
    if (token && user) {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-md mx-auto p-6 border border-gray-200 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-center mb-6">Login Form</h2>

      <div className="text-center mb-4">
        <button
          onClick={() => setLoginWithEmail(!loginWithEmail)}
          className="text-blue-600 hover:underline"
        >
          {loginWithEmail ? "Login with Password" : "Login with OTP"}
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {loginWithEmail ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              defaultValue={signupData || ""}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                  message: "Enter a valid email",
                },
              })}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
        ) : (
          <>
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                  message: "Enter a valid email",
                },
              })}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && (
              <p className="text-sm text-red-600 mt-1">
                {errors.password.message}
              </p>
            )}

            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-[70%] right-3 transform -translate-y-1/2 cursor-pointer text-gray-500"
            >
              {showPassword ? <BiHide size={20} /> : <BiShow size={20} />}
            </span>
          </div>
          </>
        )}

        <button
          type="submit"
          className="w-full py-2 px-4 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Login
        </button>
      </form>

      <p className="text-center mt-4 text-sm">
        Don’t have an account?{" "}
        <a href="/signup" className="text-blue-600 hover:underline">
          Signup
        </a>
      </p>
    </div>
  );
}

export default Login;
