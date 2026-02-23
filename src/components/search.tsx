"use client"
import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/router'
type Errortype={
    text?:string;
}
function Search(){
    const[text, setText] = useState("");
    const router = useRouter();
     const [errors, setErrors] = useState<Errortype>({}); 
    const handleSubmit = async(e: React.SubmitEvent<HTMLFormElement>):Promise<void>=>{
        e.preventDefault();
        let valid = true;
        const newErrors: Errortype = {};
        
        const textPattern = /^[a-zA-Z0-9 .,!?'-]+$/;

        if (!text || text.trim() === "") {
            newErrors.text = "Text Required";
            valid = false;
        } else if (text.length > 255) {
            newErrors.text = "Maximum 255 characters";
            valid = false;
        }else if (!textPattern.test(text)) {
            newErrors.text = "Wrong Pattern";
            valid = false;
        }

         setErrors(newErrors);
        
        if (!valid) return; // stop submission if validation failed

            setErrors({});
            router.push(`/notessearch?q=${encodeURIComponent(text)}`);
            setText("");

            }

        return(
            <div className="flex items-center">
                <form onSubmit={handleSubmit} className="flex items-center bg-gray-100 rounded-full overflow-hidden shadow-sm">
                    <input
                    type="text"
                    value={text}
                    name="searchnote"
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Search Title"
                    className="px-4 py-2 w-64 bg-white text-black placeholder-black focus:outline-none"
                    />
                    <button
                    type="submit"
                    className="flex items-center justify-center px-3"
                    >
                    <Image src="/searchicon.png" alt="search icon" width={20} height={20} />
                    </button>
                    {errors.text && (
                    <p className="text-red-500 text-sm mt-1 mr-4">{errors.text}</p>
                  )}
                </form>
            </div>

        )
  }

export default Search