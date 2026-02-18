"use client"
import React, { useState } from "react";
import { useRouter } from "next/router";
 type Err={
    title?: string;
    content?:string;
    
 };
 const NoteCard: React.FC = () => {
      const [title, setTitle] = useState("")
      const [content, setContent] = useState("")
      const [errors, setErrors] = useState<Err>({})
      const router = useRouter();
      const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>):Promise<void> => {
        e.preventDefault();

        let valid = true;
        let newErrors:Err = {};

        // Title validation
       const titlePattern = /^[a-zA-Z0-9 .,!?'-]+$/;

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
              content: content }),
          });

          if (res.ok) {
            setTitle("");
            setContent("");
            setErrors({});
            alert("Note Saved!")
            router.push("/dashboard")
          } else {
            alert("Error saving note");
          }
        }
        return (
          
          <div className="h-[40vh] flex flex-col items-center justify-center bg-white ">
            <h1 className="text-3xl font-semibold mt-8 mb-8 text-center">
            Add Note
          </h1>
            <div className="w-full max-w-3xl p-6 shadow-sm bg-gray-100 rounded-lg">
              <form action="#" onSubmit={handleSubmit}>
                {/* Title Input */}
                <div className="mb-4">
                  <label
                    htmlFor="title"
                    className="block mb-2 text-sm font-medium text-gray-800"
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
                    htmlFor="content"
                    className="block mb-2 text-sm font-medium text-gray-800"
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
                  className="mt-4 px-6 py-2 bg-gray-100 text-black font-semibold rounded-lg shadow-sm">Save</button>
                  </div>
              </form>
            </div>
          </div>
        );
      }
      export default NoteCard

