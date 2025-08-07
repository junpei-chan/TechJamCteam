import Link from "next/link"
import Image from "next/image"

export function Logo() {
  return (
    <Link href="/">
      <Image 
        src="/logo.png"
        alt="Logo"
        width={115}
        height={60}
      />
    </Link>
  )
}