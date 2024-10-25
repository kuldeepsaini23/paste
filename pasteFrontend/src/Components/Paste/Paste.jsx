import { Copy, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  createPaste,
  editPaste,
  useGetPasteById,
} from "../../services/operations/pasteApi";

const ProtectedRoute = () => {
  const navigator = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.user);

  const [searchParams, setSearchParams] = useSearchParams();

  const editId = searchParams.get("editId");

  const { data, isLoading } = useGetPasteById(editId, token);

  useEffect(() => {
    if (!token && !user) {
      navigator("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [value, setValue] = useState("");
  const [title, setTitle] = useState("");
  const [contentType, setContentType] = useState("text"); // Default content type
  const [expirationInDays, setExpirationInDays] = useState("30"); // Default expiration
  const [access, setAccess] = useState("public"); // Default access type

  const [edit, setEdit] = useState(false);
  useEffect(() => {
    if (data) {
      setValue(JSON.parse(data?.content));
      setTitle(data?.title);
      setEdit(data?.edit)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const hadnleCreatePaste = async () => {
    const paste = {
      title,
      content: value,
      contentType,
      expirationInDays,
      access,
      createdAt: new Date().toISOString(),
      _id:editId ? editId : null
    };

    // console.log(paste);

    if (editId) {
      const res = await editPaste(paste, token);
      if (res?.success) {
        setTitle("");
        setValue("");
        setContentType("text");
        setExpirationInDays("30");
        setAccess("public");
        setSearchParams({});
        setEdit(false);
      }
    } else {
      const res = await createPaste(paste, token);
      if (res?.success) {
        setTitle("");
        setValue("");
        setContentType("text");
        setExpirationInDays("30");
        setAccess("public");
      }
    }
  };

  const hadnleNewPaste = () => {
    setSearchParams({});
    setEdit(false)
    setTitle("");
    setValue("");
    setContentType("text");
    setExpirationInDays("30");
    setAccess("public");
  };


  return (
    <div className="w-full h-full py-10 max-w-[1200px] mx-auto">
      <div className="flex flex-col gap-y-5 items-start">
        {/* Content Type Select */}
        <div className="flex gap-4 w-full mb-4 items-center">
          <select
            value={contentType}
            onChange={(e) => setContentType(e.target.value)}
            className="border rounded-md p-2"
          >
            <option value="text">Text</option>
            <option value="code">Code</option>
            <option value="json">JSON</option>
          </select>

          {/* Expiration Select */}
          <select
            value={expirationInDays}
            onChange={(e) => setExpirationInDays(e.target.value)}
            className="border rounded-md p-2"
          >
            <option value="30">1 Month</option>
            <option value="365">1 Year</option>
            <option value="365000">Never</option>
          </select>

          {/* Access Type Select */}
          <select
            value={access}
            onChange={(e) => setAccess(e.target.value)}
            className="border rounded-md p-2"
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>

          <button
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm 
            px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700"
            onClick={hadnleCreatePaste}
          >
            {edit ? "Update My Paste" : "Create My Paste"}
          </button>

          {edit && (
            <button
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm 
            px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700"
              onClick={hadnleNewPaste}
            >
              <PlusCircle size={20} />
            </button>
          )}
        </div>
        <div className="w-full flex flex-row gap-x-4 justify-between items-center">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-black border border-input rounded-md p-2"
          />
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
              {/* Copy button */}
              <button
                className={`flex justify-center items-center transition-all duration-300 ease-in-out group`}
                onClick={() => {
                  navigator.clipboard.writeText(value);
                  toast.success("Copied to Clipboard", {
                    position: "top-right",
                  });
                }}
              >
                <Copy className="group-hover:text-sucess-500" size={20} />
              </button>
            </div>
          </div>

          {/* TextArea */}
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Write Your Content Here...."
            className="w-full p-3 focus-visible:ring-0"
            style={{
              caretColor: "#000",
            }}
            rows={20}
          />
        </div>
      </div>
    </div>
  );
};

export default ProtectedRoute;
