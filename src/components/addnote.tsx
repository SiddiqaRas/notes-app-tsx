"use client"
import Image from "next/image"
import Link from "next/link"
import React from "react"

const AddNote = () => {
 return(
    <div>
        <Link href='/notesdetail'>
             <Image
              src="/add.png"
              alt="icon for adding a new note"
              width={40}
              height={40}
             />
        </Link>
    </div>
    
 );
};
export default AddNote