"use client"
import AddLogo from "./logo";
import SearchNotes from "./search";
import AddNote from "./addnote";
import Logout from "./Logout";
const AddNavbar = () =>{
 return(
    <nav className="flex items-center justify-between px-6 h10 bg-white shadow-md sticky top-0 z-50">
  
            <div className="flex items-center space-x-2">
                <AddLogo />
            </div>

  
            <div className="flex items-center space-x-4">
                <SearchNotes/>
                <AddNote />
                <Logout/>
                 
            </div>

        </nav>
 );
};
export default AddNavbar