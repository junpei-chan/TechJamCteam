import Link from 'next/link';
import { MenuList } from '@/components/features/top/MenuList';
import { Logo } from '@/components/shared/Logo';

export default function Top() {
  return (
    <main>
      <Logo />

      <MenuList />
    </main>
  );
}
