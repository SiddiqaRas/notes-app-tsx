"use client"
import AddLogo from "@/components/logo"
import BackButton from "@/components/backbutton"
import Logout from "./Logout"

function AddSimpleNav()
{
    return(
        <nav className="flex items-center justify-between px-6 h10 bg-white shadow-md sticky top-0 z-50">
  
            <div className="flex items-center space-x-1">
                <BackButton/>
                <AddLogo />
            </div>
             <Logout/>
        </nav>

    )
}
export default AddSimpleNav