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
    tags: [] as string[],
    image_url: "",
    shop_id: 1,
    genre_id: 1
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [newTag, setNewTag] = useState("");

  // クリーンアップ: blob URLを解放
  useEffect(() => {
    return () => {
      if (formData.image_url && formData.image_url.startsWith('blob:')) {
        URL.revokeObjectURL(formData.image_url);
      }
    };
  }, [formData.image_url]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim()) && formData.tags.length < 10) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const addPredefinedTag = (tag: string) => {
    if (!formData.tags.includes(tag) && formData.tags.length < 10) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const predefinedTags = [
    "和食", "洋食", "中華", "イタリアン", "フレンチ", 
    "カフェ", "ファストフード", "デザート", "ドリンク", "その他",
    "ヘルシー", "辛い", "甘い", "おすすめ", "人気", "限定"
  ];

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
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
      let imageUrl = "/menu-default.jpg";
      
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
        price: parseInt(formData.price) || 0,
        tags: formData.tags.length > 0 ? formData.tags : undefined
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
          tags: [],
          image_url: "",
          shop_id: 1,
          genre_id: 1
        });
        setSelectedFile(null);
        setNewTag("");
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

        <div>
          <label htmlFor="tags">タグ (最大10個)</label>
          
          {/* 事前定義されたタグ */}
          <div style={{ marginBottom: "15px" }}>
            <p style={{ fontSize: "14px", color: "#666", marginBottom: "8px" }}>
              よく使われるタグ（クリックで追加）：
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {predefinedTags.map((tag) => {
                const isAlreadyAdded = formData.tags.includes(tag);
                const isMaxReached = formData.tags.length >= 10;
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => addPredefinedTag(tag)}
                    disabled={isAlreadyAdded || isMaxReached}
                    style={{
                      padding: "4px 8px",
                      fontSize: "12px",
                      borderRadius: "12px",
                      border: "1px solid #ddd",
                      backgroundColor: isAlreadyAdded ? "#e0e0e0" : "#f5f5f5",
                      color: isAlreadyAdded ? "#999" : "#333",
                      cursor: isAlreadyAdded || isMaxReached ? "not-allowed" : "pointer",
                      opacity: isAlreadyAdded || isMaxReached ? 0.5 : 1
                    }}
                  >
                    {isAlreadyAdded ? "✓ " : ""}{tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* <div style={{ marginBottom: "10px" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "10px" }}>
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  style={{
                    backgroundColor: "#e3f2fd",
                    color: "#1976d2",
                    padding: "4px 8px",
                    borderRadius: "16px",
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#1976d2",
                      cursor: "pointer",
                      fontSize: "16px",
                      padding: "0",
                      marginLeft: "4px"
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleTagKeyPress}
                placeholder="カスタムタグを入力してEnterまたは追加ボタンを押してください"
                style={{
                  flex: 1,
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  fontSize: "16px"
                }}
                maxLength={20}
              />
              <button
                type="button"
                onClick={addTag}
                disabled={!newTag.trim() || formData.tags.includes(newTag.trim()) || formData.tags.length >= 10}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#1976d2",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px"
                }}
              >
                追加
              </button>
            </div>
            <p style={{ fontSize: "12px", color: "#666", margin: "4px 0 0 0" }}>
              {formData.tags.length}/10 個のタグが追加されています
            </p>
          </div> */}
        </div>

        <button type="submit" disabled={isSubmitting || !formData.name.trim() || !formData.price || !formData.description.trim()}>
          {isSubmitting ? "投稿中..." : "投稿"}
        </button>
      </form>
    </main>
  )
}