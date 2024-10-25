import { Copy } from "lucide-react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useGetPasteById } from "../../services/operations/pasteApi";
import { useEffect } from "react";

const ViewPaste = () => {
  const { id } = useParams();
  const navigator = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.user);
  const { data: paste, isLoading } = useGetPasteById(id, token);

  useEffect(() => {
    if (!token && !user) {
      navigator("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // console.log(paste)

  return (
    <div className="w-full h-full py-10 max-w-[1200px] mx-auto">
      {isLoading ? (
        <div>Lodaing....</div>
      ) : (
        <>
          <div className="flex flex-col gap-y-5 items-start">
            <div className="w-full flex flex-row gap-x-3 justify-between">
              <input
                type="text"
                placeholder="Title"
                value={paste?.title}
                disabled
                className="w-[80%] text-black border border-input rounded-md p-2"
              />

              <button
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm 
            px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                <a href={`/create-paste?editId=${id}`}>Add to My Paste</a>
              </button>
            </div>
            <div
              className={`w-full flex flex-col items-start relative rounded bg-opacity-10 border border-[rgba(128,121,121,0.3)] backdrop-blur-2xl`}
            >
              <div
                className={`w-full rounded-t flex items-center justify-between gap-x-4 px-4 py-2 border-b border-[rgba(128,121,121,0.3)]`}
              >
                <div className="w-full flex gap-x-[6px] items-center select-none group">
                  <div className="w-[13px] h-[13px] rounded-full flex items-center justify-center p-[1px] overflow-hidden bg-[rgb(255,95,87)]" />

                  <div
                    className={`w-[13px] h-[13px] rounded-full flex items-center justify-center p-[1px] overflow-hidden bg-[rgb(254,188,46)]`}
                  />

                  <div className="w-[13px] h-[13px] rounded-full flex items-center justify-center p-[1px] overflow-hidden bg-[rgb(45,200,66)]" />
                </div>
                {/* Circle and copy btn */}
                <div
                  className={`w-fit rounded-t flex items-center justify-between gap-x-4 px-4`}
                >
                  {/*Copy  button */}
                  <button
                    className={`flex justify-center items-center  transition-all duration-300 ease-in-out group`}
                    onClick={() => {
                      navigator.clipboard.writeText(paste?.content);
                      toast.success("Copied to Clipboard");
                    }}
                  >
                    <Copy className="group-hover:text-sucess-500" size={20} />
                  </button>
                </div>
              </div>

              {/* TextArea */}
              <textarea
                value={paste?.content ? JSON.parse(paste.content) : ""}
                disabled
                placeholder="Write Your Content Here...."
                className="w-full p-3  focus-visible:ring-0"
                style={{
                  caretColor: "#000",
                }}
                rows={20}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ViewPaste;
