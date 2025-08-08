import Image from "next/image"
import { useState } from "react"

type MenuItemProps = {
  image_url: string;
  name: string;
  price: number;
}

export function MenuItem({
  image_url,
  name,
  price
}: MenuItemProps) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="flex flex-col items-center text-center">
      <Image 
        src={imageError ? '/menu-default.jpg' : image_url}
        alt={`${name}`}
        width={160}
        height={100}
        onError={handleImageError}
        className="w-[160px] h-[100px] object-cover rounded-lg"
      />
      <div>
        <p>{name}</p>
        <p>¥{price}</p>
      </div>
    </div>
  )
}