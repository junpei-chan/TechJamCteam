import Image from "next/image"
import Link from "next/link"

export function GeneralFooter() {
  return (
    <footer className="fixed bottom-0 left-0 w-screen bg-main flex justify-around items-center p-6 shadow-top z-20">
      <Link href="/">
        <Image
          src="/icons/home-icon.svg"
          alt="ホーム"
          width={24}
          height={24}
        />
      </Link>

      <Link href="/">
        <Image
          src="/icons/favorite-icon.svg"
          alt="お気に入り"
          width={24}
          height={24}
        />
      </Link>

      <Link href="/profile">
        <Image
          src="/icons/user-icon.svg"
          alt="プロフィール"
          width={24}
          height={24}
        />
      </Link>
    </footer>
  )
}