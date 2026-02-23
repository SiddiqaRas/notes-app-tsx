import pool from "@/lib/db"
import { parse } from "cookie";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import AddLogo from "@/components/logo";
import Logout from "@/components/Logout";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";

type Notes={
    notes_id: number;
    notes_title:string;
    notes_content:string;
    notes_keywords:string;
    
}
type Dashboard={
    notes: Notes[];
};
type Params={
   id : string;
};
type ERR={
     
      title?:string;
      content?:string;
      keywords?:string;
};

export const getServerSideProps: GetServerSideProps<Dashboard> = async(context) =>  {
  const cookies = context.req.headers.cookie ? parse(context.req.headers.cookie) : {};
  const userId = cookies.user_id;
  if(!userId){
    return{
        redirect:{
            destination:"/login",
            permanent:false,
        },
    };
  }
  const id = Number(context.params!.id);

  try{
    const result = await pool.query(
        "SELECT notes_id, notes_title, notes_content, notes_keywords FROM notes_tbl WHERE notes_user_id =$1 AND notes_id=$2",
        [userId, id]
    )
    const notes = result.rows;
    return{props:{notes}};
  }catch(error){
    console.error("Error fetching notes:", error);
    return { props: { notes: [] } };
    }
}
export default function Editnotesdetail({notes}:Dashboard){
    const [title, setTitle] = useState(notes[0]?.notes_title || "");
    const [content, setContent] = useState(notes[0]?.notes_content || "");
     const [keywords, setKeywords] = useState(notes[0]?.notes_keywords || "");
    const [errors, setErrors] = useState<ERR>({});
    const router = useRouter();
    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>):Promise<void> => {
            e.preventDefault();
    
            let valid = true;
            const newErrors: ERR = {};
    
            // Title validation
           const titlePattern = /^[a-zA-Z0-9 .,!?'-]+$/;
           const keyPattern = /^[a-zA-Z0-9 .,!?'-]+$/;
    
            if (!title || title.trim() === "") {
              newErrors.title = "Title is required";
              valid = false;
            } else if (title.length > 255) {
              newErrors.title = "Title length cannot exceed 255 characters";
              valid = false;
            }else if (!titlePattern.test(title)) {
              newErrors.title = "Title can only contain letters, numbers, and basic punctuation";
              valid = false;
            }
            
            if (!keywords || keywords.trim() === "") {
              newErrors.keywords = "Keywords are required";
              valid = false;
            } else if (keywords.length > 50) {
              newErrors.keywords = "Keywords length cannot exceed 100 characters";
              valid = false;
            }else if (!keyPattern.test(keywords)) {
              newErrors.title = "Title can only contain letters, numbers, and basic punctuation";
              valid = false;
            }
    
            // Content validation
            if (!content || content.trim() === "") {
              newErrors.content = "Content is required";
              valid = false;
            } else if (content.length > 10000) {
              newErrors.content = "Content length cannot exceed 10000 characters";
              valid = false;
            }
    
    
            setErrors(newErrors);
    
            if (!valid) return; // stop submission if validation failed
    
            const res= await fetch("/api/add_update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    id: notes[0].notes_id,
                    title: title,
                  content: content,
                  keywords:keywords }),
              });
    
              if (res.ok) {
                setTitle("");
                setContent("");
                setKeywords("");
                setErrors({});
                alert("Note Edited!")
                router.push("/dashboard")
              } else {
                alert("Error saving note");
              }
            }

    return(
    <div>
        <nav className="flex items-center justify-between px-6 h10 bg-white shadow-md sticky top-0 z-50"> 
                <div className="flex items-center space-x-1">
                    <Link href="/dashboard" target='_self'>
                        <button type="submit" >
                            <Image src="/backbutton.png" alt="back-button-icon" width={17} height={35} />
                        </button>
                    </Link>
                     <AddLogo/>
                </div>
                    <Logout/>
        </nav>
        <div className="min-h-screen bg-white p-6">
          <h1 className="text-3xl font-semibold mt-8 mb-8 text-center">
            Edit Note
          </h1>
            <form onSubmit={handleSubmit} >
                <div className=" mt-10 relative max-w-3xl bg-gray-100 rounded-lg shadow p-6 mx-auto">
                  <div className="mb-4">
                      <label
                        htmlFor="title"
                        className="block mb-2 text-sm font-medium text-gray-800"
                      >
                        Title
                      </label>
                      <p className="text-gray-600 text-md break-words">
                        <textarea value={title} onChange={e => setTitle( e.target.value)} className="w-full px-3 py-2 rounded-md border-b border-gray-300 focus:outline-none"/>
                        {errors.title && (
                        <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                      )}
                      </p>
                </div>
                <div className="mb-4">
                      <label
                        htmlFor="keywords"
                        className="block mb-2 text-sm font-medium text-gray-800"
                      >
                        Keywords
                      </label>
                      <p className="text-gray-600 text-md break-words">
                        <textarea value={keywords} onChange={e => setKeywords( e.target.value)} className="w-full px-3 py-2 rounded-md border-b border-gray-300 focus:outline-none"/>
                        {errors.keywords && (
                        <p className="text-red-500 text-sm mt-1">{errors.keywords}</p>
                      )}
                     </p>
                   </div>
                <div className="mb-4">
                      <label
                        htmlFor="content"
                        className="block mb-2 text-sm font-medium text-gray-800"
                      >
                        Content
                      </label>
                    <p className="text-gray-600 text-sm break-words">
                        <textarea value={content} onChange={e => setContent(e.target.value)} className="w-full px-3 py-2 rounded-md border-b border-gray-300 focus:outline-none"/>
                        {errors.content && (
                        <p className="text-red-500 text-sm mt-1">{errors.content}</p>
                      )}
                    </p>
                </div>
                <button className="mt-4 px-6 py-2 bg-gray-100 text-black font-semibold rounded-lg shadow-sm" type="submit">
                    Save
                </button>

                </div>
            </form>
        </div>
    </div>
    );
}