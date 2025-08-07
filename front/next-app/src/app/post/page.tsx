"use client";

import Image from "next/image"
import { useState } from "react"
import { menuStore, MenuStoreRequest } from "@/api/menu/menuStore"

export default function Post() {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    image_url: "",
    shop_id: 1, // 仮の値、実際は動的に設定
    genre_id: 1 // 仮の値、実際は動的に設定
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const menuRequest: MenuStoreRequest = {
        shop_id: formData.shop_id,
        genre_id: formData.genre_id,
        name: formData.name,
        description: formData.description,
        image_url: formData.image_url || "/menu-default.png", // デフォルト画像
        price: parseInt(formData.price) || 0
      };

      const response = await menuStore(menuRequest);
      
      if (response.success) {
        setMessage("メニューが正常に投稿されました！");
        setFormData({
          name: "",
          price: "",
          description: "",
          image_url: "",
          shop_id: 1,
          genre_id: 1
        });
      } else {
        setMessage(`エラー: ${response.messages.join(", ")}`);
      }
    } catch (error) {
      setMessage("投稿中にエラーが発生しました");
      console.error("Submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <form onSubmit={handleSubmit}>
        {message && (
          <div style={{ 
            padding: "10px", 
            marginBottom: "20px", 
            backgroundColor: message.includes("エラー") ? "#fee" : "#efe",
            border: `1px solid ${message.includes("エラー") ? "#fcc" : "#cfc"}`,
            borderRadius: "4px"
          }}>
            {message}
          </div>
        )}

        <ul>
          {/* {previewFiles.map((file, i) => (
            <li key={i}>
              <Image
                src={URL.createObjectURL(file)}
                alt={`preview-${i}`}
                width={24}
                height={24}
              />
            </li>
          ))} */}
        </ul>

        <div>
          <Image 
            src="/icons/photo-icon.svg"
            alt="photo-icon"
            width={24}
            height={24}
          />
          <label htmlFor="image">
            <input type="file" id="image" className="hidden cursor-pointer"/>
            フォトライブラリ
          </label>
        </div>

        <div>
          <label htmlFor="name">名前</label>
          <input 
            type="text" 
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label htmlFor="price">価格</label>
          <input 
            type="number" 
            id="price"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            required
            min="0"
          />
        </div>

        <div>
          <label htmlFor="description">説明</label>
          <textarea 
            name="description" 
            id="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "投稿中..." : "投稿"}
        </button>
      </form>
    </main>
  )
}