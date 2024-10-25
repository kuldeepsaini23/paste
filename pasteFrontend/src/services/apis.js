const BASE_URL =import.meta.env.VITE_URL

// console.log("BASE_URL", BASE_URL);

export const authEndpoints = {
  SENDOTP_API: BASE_URL + "/auth/send-otp",
  VERIFYOTP_API: BASE_URL + "/auth/verify-otp",
  SIGNUP_API: BASE_URL + "/auth/signup",
  LOGIN_API: BASE_URL + "/auth/login",
};


export const pasteEndpoints = {
  CREATE_PASTE : `${BASE_URL}/pastes`,
  GET_ALL_PASTE : `${BASE_URL}/pastes/all-pastes`,
  EDIT_PASTE : `${BASE_URL}/pastes/edit`,
  DELETE_PASTE : `${BASE_URL}/pastes/delete`,
  GET_PASTE_BY_ID : `${BASE_URL}/pastes/get-paste`,
}