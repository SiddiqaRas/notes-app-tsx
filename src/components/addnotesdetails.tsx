"use client"
import React, { useState } from "react";
import { useRouter } from "next/router";
 type Err={
    title?: string;
    content?:string;
    keywords?:string;
    
 };
 const NoteCard: React.FC = () => {
      const [title, setTitle] = useState("")
      const [content, setContent] = useState("")
      const [keywords, setKeywords] = useState("")
      const [errors, setErrors] = useState<Err>({})
      const router = useRouter();
      const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>):Promise<void> => {
        e.preventDefault();

        let valid = true;
        let newErrors:Err = {};

        // Title validation
       const titlePattern = /^[a-zA-Z0-9 .,!?'-]+$/;
        const keyPattern = /^[a-zA-Z0-9 .,!?'-]+$/;

        if (!title || title.trim() === "") {
          newErrors.title = "Title is required";
          valid = false;
        } else if (title.length > 30) {
          newErrors.title = "Title length cannot exceed 30 characters";
          valid = false;
        }else if (!titlePattern.test(title)) {
          newErrors.title = "Title can only contain letters, numbers, and basic punctuation";
          valid = false;
        }

        if (!keywords || keywords.trim() === "") {
          newErrors.keywords = "Keywords are required";
          valid = false;
        } else if (keywords.length > 30) {
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

        const res= await fetch("/api/add_notes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: title,
              content: content,
            keywords:keywords }),
          });

          if (res.ok) {
            setTitle("");
            setContent("");
            setKeywords("");
            setErrors({});
            alert("Note Saved!")
            router.push("/dashboard")
          } else {
            alert("Error saving note");
          }
        }
        return (
          
          <div className="h-[75vh] flex flex-col items-center my-* justify-center ">
            <h1 className="text-3xl font-sans mt-10 mb-15 font-bold text-center">
            Add Note
          </h1>
            <div className="w-full max-w-3xl p-6 shadow-md bg-white my-6 rounded-lg">
              <form action="#" onSubmit={handleSubmit}>
                {/* Title Input */}
                <div className="mb-4">
                  <label
                    htmlFor="title"
                    className="block mb-2 text-md font-medium text-black"
                  >
                    Title
                  </label>
                  <input
                    value={title}
                    type="text"
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                  
                    className="w-full px-3 py-2 rounded-md border-b border-gray-300 focus:outline-none "
                  />
                    {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="keywords"
                    className="block mb-2 text-md font-medium text-black"
                  >
                   Keywords
                  </label>
                  <input
                    value={keywords}
                    type="text"
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="Keywords"
                  
                    className="w-full px-3 py-2 rounded-md border-b border-gray-300 focus:outline-none "
                  />
                    {errors.keywords && (
                    <p className="text-red-500 text-sm mt-1">{errors.keywords}</p>
                  )}
                </div>
              
                <div className="mb-4">
                  <label
                    htmlFor="content"
                    className="block mb-2 text-md font-medium text-black"
                  >
                    Add Notes
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Content"
                   
                    className="w-full px-3 py-2 rounded-md border-b border-gray-300 focus:outline-none max-h-[18rem] overflow-y-auto resize-none"
                  />
                    {errors.content && (
                    <p className="text-red-500 text-sm mt-1">{errors.content}</p>
                  )}
                </div>
                <div>
                <button
                  type="submit"
                  className="mt-4 px-6 py-2 bg-[#FEFCE8] border-2 border-solid border-[#FEF3C6] transform hover:-translate-y-2 transition-all duration-500 text-black font-semibold rounded-lg shadow-sm">Save</button>
                  </div>
              </form>
            </div>
          </div>
        );
      }
      export default NoteCard

