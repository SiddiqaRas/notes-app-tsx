"use Client"
import Image from 'next/image'
import Link from 'next/link'
function BackButton(){
    return(
        <div>
            <Link href="/dashboard" target='_self'>
                <button type="submit" >
                    <Image src="/backbutton.png" alt="back-button-icon" width={17} height={35} />
                </button>
            </Link>
        </div>
    )
}
export default BackButton