"use client";

import { Logo } from "./Logo"
import Link from "next/link"
import Image from "next/image"
import { useUnreadNotificationCount } from "@/hooks/useUnreadNotifications"

export function Header() {
  const { unreadCount } = useUnreadNotificationCount();

  return (
    <header className="fixed w-screen top-0 left-0 bg-base py-4 px-6 z-20">
      <div className="flex justify-between items-center max-w-md mx-auto">
        <span className="w-6"></span>

        <Logo />
        
        <Link href="/notification" className="flex items-center relative">
          <Image 
            src="/icons/bell-icon.svg"
            alt="通知"
            width={24}
            height={24}
          />
          {unreadCount > 0 && (
            <div className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
              {unreadCount > 9 ? '9+' : unreadCount}
            </div>
          )}
        </Link>
      </div>
    </header>
  )
}