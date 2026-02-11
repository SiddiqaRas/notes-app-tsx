"use client"
import Image from "next/image";

const Search =() =>{
return(
    <div className="flex items-center">
            <form action="#" className="flex items-center bg-gray-100 rounded-full overflow-hidden shadow-sm">
                <input
                type="text"
                name="searchnote"
                placeholder="Search Note"
                className="px-4 py-2 w-64 bg-white-100 text-black-800 placeholder-black-400 focus:outline-none"
                />
                <button
                type="submit"
                className="flex items-center justify-center px-3"
                >
                <Image src="/searchicon.png" alt="search icon" width={20} height={20} />
                </button>
            </form>
        </div>
);
};
export default Search