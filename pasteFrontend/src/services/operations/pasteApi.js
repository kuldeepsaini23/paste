import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { pasteEndpoints } from "../apis";
import { useQuery } from "@tanstack/react-query";
import { BsNutFill } from "react-icons/bs";

export const createPaste = async (data, token) => {
  const toastId = toast.loading("Creating Paste...");
  try {
    const response = await apiConnector(
      "POST",
      pasteEndpoints.CREATE_PASTE,
      data,
     {
      Authorization: `Bearer ${token}`,
     }
    );
    // console.log("CREATE PASTE RESPONSE", response.data);
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    toast.success("Paste Created Successfully");
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message||"Error Creating Paste");
    // console.log("CREATE PASTE ERROR", error);
    return null;
  }
  finally{
    toast.dismiss(toastId);
  }
};


export const getAllPaste = async (token, search) => {
  const baseUrl = pasteEndpoints.GET_ALL_PASTE;
  const params = new URLSearchParams();

  if (search) {
    params.append("query", search);
  }
  const queryParams = params.toString();
  const url = `${baseUrl}?${queryParams}`;

  try {
    const response = await apiConnector(
      "GET",
     url,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    // console.log("GET ALL PASTE RESPONSE", response.data);
    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data.pastes;
  } catch (error) {
    // console.log("GET ALL PASTE ERROR", error);
    return []; 
  }
};

export const useGetAllPastes = (token, search) => {  
  return useQuery({
    queryKey: ["getAllPaste"],
    queryFn: () => getAllPaste(token, search),
    enabled: token !== "",
  });
};



export const deletePaste = async (id, token) => {
  const toastId = toast.loading("Deleting Paste...");
  try {
    const response = await apiConnector(
      "DELETE",
      `${pasteEndpoints.DELETE_PASTE}/${id}`,
      null,
     {
      Authorization: `Bearer ${token}`,
    }
    );
    // console.log("DELETE PASTE RESPONSE", response.data);
    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success("Paste Deleted Successfully");

    return response.data;
  } catch (error) {
    // console.log("DELETE PASTE ERROR", error);
    toast.error(error?.response?.data?.message||"Error Deleting Paste");  
    return null;
  }
  finally{
    toast.dismiss(toastId);
  }
};



//Edit Paste
export const editPaste = async (data, token) => {
  const toastId = toast.loading("Editing Paste...");
  try {
    const response = await apiConnector(
      "PUT",
      `${pasteEndpoints.EDIT_PASTE}/${data._id}`,
      data,
     {
      Authorization: `Bearer ${token}`,
    }
    );
    // console.log("EDIT PASTE RESPONSE", response.data);
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    toast.success("Paste Updated Successfully");

    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message||"Error Editing Paste");
    // console.log("EDIT PASTE ERROR", error);
    return null;
  }
  finally{
    toast.dismiss(toastId);
  }
};



//get paste by Id
export const getPasteById = async (id, token) => {
  try {
    console.log("GET PASTE BY ID", id, token);
    const response = await apiConnector(
      "GET",
      `${pasteEndpoints.GET_PASTE_BY_ID}/${id}`,
      null,
     {
      Authorization: `Bearer ${token}`,
    }
    );
    // console.log("GET PASTE BY ID RESPONSE", response.data);
    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data.paste;
  } catch (error) {
    if(error?.response?.data?.paste){
      toast.error(error?.response?.data?.message||"Error Fetching Paste");
    }
   
    console.log("GET PASTE BY ID ERROR", error);
    return null;
  }
};


export const useGetPasteById = (id, token) => {  
  return useQuery({
    queryKey: ["getPasteById", id],
    queryFn: () => getPasteById(id, token),
    enabled: Boolean(id && token),
  });
};
