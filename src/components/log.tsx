"use client"
import AddSimpleNavbar from "./simplenav";
import { useState } from "react";
import { useRouter} from "next/router";
import Link from "next/link";

type Err = {
    lemail ?: string;
    lpassword ?: string;
}
const Login = ()=>{
    const [lemail, setlEmail] = useState<string>("")
      const [lpassword, setlPassword] = useState<string>("")
      const [errors, setErrors] = useState<Err>({})
      const router = useRouter();
      const handleEmailSub = (e: React.ChangeEvent<HTMLInputElement>):void => {
        setlEmail (e.target.value);
      };
      const handlePasswordSub = (e: React.ChangeEvent<HTMLInputElement>):void => {
        setlPassword (e.target.value);
      };
      const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>):Promise<void> => {
        e.preventDefault();

        let valid:boolean = true;
        let newErrors:Err = {};

        // Title validation
       const lemailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
       const lpasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,100}$/; //one uppercase, one lowercase, one digit and atleast 8 characters


        if (!lemail || lemail.trim() === "") {
          newErrors.lemail = "Email is required";
          valid = false;
        } else if (lemail.length > 255) {
          newErrors.lemail = "Email length cannot exceed 255 characters";
          valid = false;
        }else if (!lemailPattern.test(lemail)) {
          newErrors.lemail = "Email can only contain letters and numbers";
          valid = false;
        }


        // Content validation
        if (!lpassword || lpassword.trim() === "") {
          newErrors.lpassword = "Password is required";
          valid = false;
        } else if (lpassword.length > 100) {
          newErrors.lpassword = "Password Length cannot exceed 100 characters";
          valid = false;
        }else if (!lpasswordPattern.test(lpassword)){
            newErrors.lpassword = "Password must contain one uppercase letter, one lowercase letter, one digit and must be atleast 8 characters"
            valid = false;
        }

        setErrors(newErrors);

        if (!valid) return; // stop submission if validation failed

        const res= await fetch("/api/add_login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lemail, lpassword}),
          });

          if (res.ok) {
            setlEmail("");
            setlPassword("");
            setErrors({});
            alert("Login Done!")
            router.push("/dashboard")
          } else {
            alert("User not found");
          }
        }

 return(
        <div>
             <AddSimpleNavbar/>
         <div className="min-h-[90vh] flex items-center justify-center bg-white overflow-hidden">
            <div className="w-full max-w-md p-6 shadow-sm bg-gray-100 rounded-lg max-h-[90vh]">
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                Login
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-800"
                  >
                        Email
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your Email"
                    value={lemail}
                    id="email"
                     onChange={handleEmailSub}
                    className="w-full px-3 py-2 rounded-md border-b border-gray-300 focus:outline-none "
                  />{errors.lemail && (
                    <p className="text-red-500 text-sm mt-1">{errors.lemail}</p>
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
                    value={lpassword}
                    id="password"
                     onChange={handlePasswordSub}
                    className="w-full px-3 py-2 rounded-md border-b border-gray-300 focus:outline-none"
                  />{errors.lpassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.lpassword}</p>
                    )}
                    
                </div>

                <div>
                    <button 
                  type="submit"
                  className="mt-4 px-6 py-2 bg-gray-100 text-black font-semibold rounded-lg shadow-sm">Login</button>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-sm text-black-700">
                    Account doesn't exist?{" "}
                    <Link
                      href="/signup"
                      className="text-gray-600 font-semibold hover:underline"
                    >
                      SignUp
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>


 );
};
export default Login