import Image from "next/image"

export function SearchBar() {
  return (
    <div>
      <ul className="flex text-[12px] justify-center py-4 gap-2">
        <li>
          <p className="text-light-black">選択されている地域</p>
        </li>
        <li>
          <p className="text-main">選択されていません</p>
        </li>
        <li>
          <span className="block w-3"></span>
        </li>
        <li>
          <button className="text-main">地域を変更する</button>
        </li>
      </ul>

      <div className="flex items-center border border-light-black w-[350px] h-[40px] rounded-lg px-[10px] gap-4 bg-white">
        <Image 
          src="/icons/search-icon.svg"
          alt="search-icon"
          width={10}
          height={10}
        />
        <input 
          type="text"
          name="search"
          placeholder="検索"
          autoComplete="off"
          className="outline-none w-full h-full"
        />
      </div>
    </div>
  )
}