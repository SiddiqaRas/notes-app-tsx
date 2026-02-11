"use client"
import Link from "next/link";
import AddSimpleNavbar from "./simplenav";
import { useState } from "react";
import  {useRouter} from "next/router"
import React from "react";
 type Err ={
        email ?: string;
        password ?: string;
     }

const SignUp: React.FC = () => {
    
     const [email, setEmail] = useState<string>("")
      const [password, setPassword] = useState<string>("")
      const [errors, setErrors] = useState<Err>({})
      const router = useRouter();
      const handleemailChange = (e: React.ChangeEvent<HTMLInputElement>):void =>{
        setEmail(e.target.value);
      };
      const handlepasswordChange = (e: React.ChangeEvent<HTMLInputElement>):void =>{
        setPassword(e.target.value);
      };
      const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        let valid:boolean = true;
        let newErrors:Err = {};

        // Title validation
       const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
       const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,100}$/; //one uppercase, one lowercase, one digit and atleast 8 characters


        if (!email || email.trim() === "") {
          newErrors.email = "Email is required";
          valid = false;
        } else if (email.length > 255) {
          newErrors.email = "Email length cannot exceed 255 characters";
          valid = false;
        }else if (!emailPattern.test(email)) {
          newErrors.email = "Email can only contain letters and numbers";
          valid = false;
        }


        // Content validation
        if (!password || password.trim() === "") {
          newErrors.password = "Password is required";
          valid = false;
        } else if (password.length > 100) {
          newErrors.password = "Password Length cannot exceed 100 characters";
          valid = false;
        }else if (!passwordPattern.test(password)){
            newErrors.password = "Password must contain one uppercase letter, one lowercase letter, one digit and must be atleast 8 characters"
            valid = false;
        }

        setErrors(newErrors);

        if (!valid) return; // stop submission if validation failed

        const res= await fetch("/api/add_signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password}),
          });
          
          const data = await res.json();

          if (res.ok) {
            setEmail("");
            setPassword("");
            setErrors({});
            alert("Sign Up Done!")
            router.push("/login")
          } else {
            alert(data.message || data.error);
          }
      };
          
 return(
    <div><AddSimpleNavbar/>
            <div className="min-h-[90vh] flex items-center justify-center bg-white overflow-hidden ">
                <div className="w-full max-w-md p-6 shadow-sm bg-gray-100 rounded-lg max-h-[90vh]">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    Sign Up
                </h2>

                <form action="#" onSubmit = {handleSubmit}>
                    <div className="mb-4">
                    <label
                        htmlFor="useremail"
                        className="block mb-2 text-sm font-medium text-gray-800"
                    >
                            Email
                    </label>
                    <input
                        type="email"
                        placeholder="Enter your Email"
                        value={email}
                        onChange={handleemailChange}
                        className="w-full px-3 py-2 rounded-md border-b border-gray-300 focus:outline-none "
                    />{errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                    </div>

                
                    <div className="mb-4">
                    <label
                        htmlFor="password"
                        className="block mb-2 text-sm font-medium text-gray-800"
                    >
                        Password
                    </label>
                    <input type="password"
                        placeholder="Enter your Password"
                        value={password}
                         onChange={handlepasswordChange}
                        className="w-full px-3 py-2 rounded-md border-b border-gray-300 focus:outline-none"
                    />{errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                    )}
                        
                    </div>
                    <div>
                    <button 
                    type="submit"
                    className="mt-4 px-6 py-2 bg-gray-100 text-black font-semibold rounded-lg shadow-sm">SignUp</button>
                    </div>
                    <div className="mt-4 text-center">
                    <p className="text-sm text-black-700">
                        Already have an account?{" "}
                        <Link
                        href="/login"
                        className="text-gray-600 font-semibold hover:underline"
                        >
                        Log In
                        </Link>
                    </p>
                    </div>

                </form>
                </div>
            </div>
          </div>
 );
};
export default SignUp