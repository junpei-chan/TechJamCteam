import Image from "next/image"

export function GeneralFooter() {
  return (
    <footer className="fixed bottom-0 left-0 w-screen bg-base flex justify-around items-center p-6 shadow-top">
      <Image
        src="/icons/home-icon.svg"
        alt="ホーム"
        width={24}
        height={24}
      />
      <Image
        src="/icons/favorite-icon.svg"
        alt="お気に入り"
        width={24}
        height={24}
      />
      <Image
        src="/icons/user-icon.svg"
        alt="プロフィール"
        width={24}
        height={24}
      />
    </footer>
  )
}