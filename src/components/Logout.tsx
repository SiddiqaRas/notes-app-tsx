"use client"
import router, {useRouter} from "next/router"
import React from "react"

const Logout: React.FC = () => {
    const Router = useRouter();
    const handleLogout = async (): Promise<void> => {
        try{

            const Response =  await fetch("/api/add_logout", { method: "POST" });

            if (!Response.ok){
             console.error ("Logout Failed");
             return;
            }
            router.push("/login");

        }catch(error)
        {
            console.error ("Problem Logging out", error)
        }

    };
    return(
        <div>
            <button onClick={handleLogout}
            className=" px-6 py-2 bg-gray-100 text-black font-semibold rounded-lg shadow-sm">Logout</button>
        </div>
    );

};
export default Logout