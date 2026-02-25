"use client"
import Image from "next/image"
import Link from "next/link"

const AddNote = () => {
 return(
    <div className='rounded-full p-3 bg-[#FEFCE8] border-2 border-solid border-[#FEF3C6]'>
        <Link href='/notesdetail'>
             <Image
              src="/plus.png"
              alt="icon for adding a new note"
              width={15}
              height={15}
             />
        </Link>
    </div>
    
 );
};
export default AddNote