import { Calendar, Copy, Eye, PencilLine, Share, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useEffect, useState } from "react"; // Import useState
import { FormatDate } from "../../utils/formatDate";
import {
  deletePaste,
  useGetAllPastes,
} from "../../services/operations/pasteApi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AllPaste = () => {
  const [searchTerm, setSearchTerm] = useState(""); // State to hold the search term
  const navigator = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.user);

  const handleDelete = async (id) => {
    const res = await deletePaste(id, token);

    if (res) {
      refetch();
    }
  };

  const { data: pastes, refetch } = useGetAllPastes(token, searchTerm);

  useEffect(() => {
    if (searchTerm.length > 0) {
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  useEffect(() => {
    if (!token && !user) {
      navigator("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full h-full py-10 max-w-[1200px] mx-auto">
      <div className="flex flex-col gap-y-3">
        {/* Search */}
        <div className="w-full flex gap-3 px-4 py-2  rounded-[0.3rem] border border-[rgba(128,121,121,0.3)]  mt-6">
          <input
            type="search"
            placeholder="Search paste here..."
            className="focus:outline-none w-full bg-transparent"
            value={searchTerm} // Bind the input to searchTerm state
            onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm on input change
          />
        </div>

        {/* All Pastes */}
        <div className="flex flex-col border border-[rgba(128,121,121,0.3)] py-4 rounded-[0.4rem]">
          <h2 className="px-4 text-4xl font-bold border-b border-[rgba(128,121,121,0.3)] pb-4">
            All Pastes
          </h2>
          <div className="w-full px-4 pt-4 flex flex-col gap-y-5">
            {pastes?.length > 0 ? (
              pastes?.map((paste) => (
                <div
                  key={paste?._id}
                  className="border border-[rgba(128,121,121,0.3)] w-full gap-y-6 justify-between flex flex-col sm:flex-row p-4 rounded-[0.3rem]"
                >
                  {/* heading and Description */}
                  <div className="w-[50%] flex flex-col space-y-3">
                    <p className="text-4xl font-semibold ">{paste?.title}</p>
                    <p className="text-sm font-normal line-clamp-3 max-w-[80%] text-[#707070]">
                      {paste?.content}
                    </p>
                  </div>

                  {/* icons */}
                  <div className="flex flex-col gap-y-4 sm:items-end">
                    <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                      <button className="p-2 rounded-[0.2rem] bg-white border border-[#c7c7c7]  hover:bg-transparent group hover:border-blue-500">
                        <a href={`/create-paste?editId=${paste?._id}`}>
                          <PencilLine
                            className="text-black group-hover:text-blue-500"
                            size={20}
                          />
                        </a>
                      </button>
                      <button
                        className="p-2 rounded-[0.2rem] bg-white border border-[#c7c7c7]  hover:bg-transparent group hover:border-pink-500"
                        onClick={() => handleDelete(paste?._id)}
                      >
                        <Trash2
                          className="text-black group-hover:text-pink-500"
                          size={20}
                        />
                      </button>

                      <button
                        className="p-2 rounded-[0.2rem] bg-white border border-[#c7c7c7]  hover:bg-transparent group hover:border-red-500"
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/paste/${paste?._id}`);
                          toast.success("Copied to Clipboard");
                        }}
                      >
                        <Share
                          className="text-black group-hover:text-red-500"
                          size={20}
                        />
                      </button>

                      <button className="p-2 rounded-[0.2rem] bg-white border border-[#c7c7c7]  hover:bg-transparent group hover:border-orange-500">
                        <a href={`/paste/${paste?._id}`} target="_blank">
                          <Eye
                            className="text-black group-hover:text-orange-500"
                            size={20}
                          />
                        </a>
                      </button>
                      <button
                        className="p-2 rounded-[0.2rem] bg-white border border-[#c7c7c7]  hover:bg-transparent group hover:border-green-500"
                        onClick={() => {
                          navigator.clipboard.writeText(paste?.content);
                          toast.success("Copied to Clipboard");
                        }}
                      >
                        <Copy
                          className="text-black group-hover:text-green-500"
                          size={20}
                        />
                      </button>
                    </div>

                    <div className="gap-x-2 flex ">
                      <Calendar className="text-black" size={20} />
                      {FormatDate(paste?.expirationDate)}
                    </div>

                    {/* Badge */}
                    <span className="text-xl rounded-full text-white bg-slate-600 px-3 py-1 font-bold capitalize">
                      {paste?.contentType}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-2xl text-center w-full text-chileanFire-500">
                No Data Found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllPaste;
