import { Logo } from "./Logo"
import Link from "next/link"
import Image from "next/image"

export function Header() {
  return (
    <header className="fixed w-screen top-0 left-0 bg-base py-4 px-6 z-20">
      <div className="flex justify-between items-center max-w-md mx-auto">
        <span className="w-6"></span>

        <Logo />
        
        <Link href="/notification" className="flex items-center">
          <Image 
            src="/icons/bell-icon.svg"
            alt="通知"
            width={24}
            height={24}
          />
        </Link>
      </div>
    </header>
  )
}