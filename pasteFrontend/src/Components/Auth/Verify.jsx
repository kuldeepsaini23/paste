import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5"; // Import back arrow icon
import OtpInput from "react-otp-input";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { verifyOtp } from "../../services/operations/authApi";

const Verify = () => {
  const { handleSubmit } = useForm();
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { signupData } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!signupData) {
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = () => {
    // console.log("Entered OTP:", otp);
    if (otp.length === 6) {
      dispatch(verifyOtp(signupData, otp, navigate));
    } else {
      toast.error("Please enter a valid OTP.");
    }
  };

  useEffect(() => {
    if (otp.length === 6) {
      onSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="max-w-md mx-auto p-6 border border-gray-200 rounded-lg shadow-lg">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate("/login")}
            className="mr-3 text-gray-600 hover:text-gray-800"
          >
            <IoArrowBack size={24} />
          </button>
          <h2 className="text-2xl font-semibold text-center flex-grow">
            Enter OTP
          </h2>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex justify-center">
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              containerStyle={{
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "10px 6px",
              }}
              inputType="number"
              renderInput={(props) => (
                <input
                  {...props}
                  type="tel"
                  placeholder="-"
                  style={{
                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                  }}
                  className="w-[48px] lg:w-[60px] border-black rounded-full aspect-square text-center focus:border-0 focus:outline-2 focus:outline-indigo-500 border"
                />
              )}
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default Verify;
