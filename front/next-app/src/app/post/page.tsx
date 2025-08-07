"use client";

import Image from "next/image"
import { useState, useEffect } from "react"
import { menuStore, MenuStoreRequest } from "@/api/menu/menuStore"
import { uploadImage } from "@/api/upload/imageUpload"

export default function Post() {
  const [formData, setFormData] = useState({
    name: "テストメニュー",
    price: "1000",
    description: "テスト説明",
    image_url: "",
    shop_id: 1,
    genre_id: 1
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  // クリーンアップ: blob URLを解放
  useEffect(() => {
    return () => {
      if (formData.image_url && formData.image_url.startsWith('blob:')) {
        URL.revokeObjectURL(formData.image_url);
      }
    };
  }, [formData.image_url]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 前のblob URLがあれば解放
      if (formData.image_url && formData.image_url.startsWith('blob:')) {
        URL.revokeObjectURL(formData.image_url);
      }
      
      setSelectedFile(file);
      
      const fileUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        image_url: fileUrl
      }));
    }
  };  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted with data:", formData);
    
    // フォームバリデーション
    if (!formData.name.trim()) {
      setMessage("名前を入力してください");
      return;
    }
    if (!formData.price || parseInt(formData.price) <= 0) {
      setMessage("有効な価格を入力してください");
      return;
    }
    if (!formData.description.trim()) {
      setMessage("説明を入力してください");
      return;
    }
    
    setIsSubmitting(true);
    setMessage("");

    try {
      let imageUrl = "/menu-default.png";
      
      // ファイルが選択されている場合、実際のアップロード処理を行う
      if (selectedFile) {
        console.log("Uploading image:", selectedFile.name);
        setMessage("画像をアップロード中...");
        const uploadResponse = await uploadImage(selectedFile);
        console.log("Upload response:", uploadResponse);
        
        if (uploadResponse.success) {
          imageUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}${uploadResponse.url}`;
          setMessage("画像アップロード完了。メニューを投稿中...");
        } else {
          setMessage(`画像アップロードエラー: ${uploadResponse.detail}`);
          setIsSubmitting(false);
          return;
        }
      }

      const menuRequest: MenuStoreRequest = {
        shop_id: formData.shop_id,
        genre_id: formData.genre_id,
        name: formData.name,
        description: formData.description,
        image_url: imageUrl,
        price: parseInt(formData.price) || 0
      };

      console.log("Sending menu request:", menuRequest);
      const response = await menuStore(menuRequest);
      console.log("Menu store response:", response);
      
      if (response.success) {
        setMessage("メニューが正常に投稿されました！");
        // blob URLがあれば解放
        if (formData.image_url && formData.image_url.startsWith('blob:')) {
          URL.revokeObjectURL(formData.image_url);
        }
        setFormData({
          name: "",
          price: "",
          description: "",
          image_url: "",
          shop_id: 1,
          genre_id: 1
        });
        setSelectedFile(null);
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
          {selectedFile && (
            <li>
              {formData.image_url.startsWith('blob:') ? (
                <img
                  src={formData.image_url}
                  alt="preview"
                  width={100}
                  height={100}
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <Image
                  src={formData.image_url}
                  alt="preview"
                  width={100}
                  height={100}
                  style={{ objectFit: 'cover' }}
                />
              )}
            </li>
          )}
        </ul>

        <div>
          <Image 
            src="/icons/photo-icon.svg"
            alt="photo-icon"
            width={24}
            height={24}
          />
          <label htmlFor="image">
            <input 
              type="file" 
              id="image" 
              name="image"
              className="hidden cursor-pointer"
              accept="image/*"
              onChange={handleFileChange}
            />
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

        <button type="submit" disabled={isSubmitting || !formData.name.trim() || !formData.price || !formData.description.trim()}>
          {isSubmitting ? "投稿中..." : "投稿"}
        </button>
      </form>
    </main>
  )
}