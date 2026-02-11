"use client"
import AddLogo from "./logo";
const AddSimpleNavbar= () => {
    return(
         <nav className="flex items-center justify-center px-6 h10 bg-white shadow-md sticky top-0 z-50">
  
            <div className="flex items-center space-x-2">
                <AddLogo />
            </div>
        </nav>
    );
};
export default AddSimpleNavbar