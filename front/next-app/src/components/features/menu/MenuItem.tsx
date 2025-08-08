import Image from "next/image"

type MenuItemProps = {
  image_url: string;
  name: string;
  price: string;
}

export function MenuItem({ menu }: { menu: MenuItemProps }) {
  return (
    <div>
      <Image 
        src={menu.image_url}
        alt={menu.name}
        width={160}
        height={100}
      />
      <div>
        <p>{menu.name}</p>
        <p>{menu.price}</p>
      </div>
    </div>
  )
}