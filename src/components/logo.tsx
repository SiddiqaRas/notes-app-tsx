"use client"
import Image from "next/image"
import Link from "next/link";

const AddLogo = () =>{
return(
        <div>
        <Link href='/'>
                <Image
                src='/logo.png'
                alt="logo of this website"
                width={70}
                height={70}
                />
        </Link>
        </div>
);
};
export default AddLogo