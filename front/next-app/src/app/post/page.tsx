"use client";

import Link from "next/link";
import Image from "next/image"
import { useState, useEffect } from "react"
import { menuStore, MenuStoreRequest } from "@/api/menu/menuStore"
import { uploadImage } from "@/api/upload/imageUpload"
import { ConditionalFooter } from "@/components/shared"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"

export default function Post() {
  const { isAuthenticated, userType, isLoading } = useAuth();
  const router = useRouter();

  // ローディング中または認証されていない場合、店舗ユーザー以外の場合はアクセス制限
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }
      if (userType !== 'shop_user') {
        router.push('/');
        return;
      }
    }
  }, [isAuthenticated, userType, isLoading, router]);

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
        
        // 投稿完了後、少し待ってからトップページへ遷移
        setTimeout(() => {
          router.push('/');
        }, 1500);
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

  // ローディング中または認証チェック中は何も表示しない
  if (isLoading || !isAuthenticated || userType !== 'shop_user') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    );
  }

  return (
    <main>
      <header className="flex items-center justify-between px-4 pt-4 h-[92px] bg-base shadow-md">
        <Link href="/profile" className="flex items-center justify-center w-10">
          <Image
            src="/icons/close-icon.svg"
            alt="close-icon"
            width={20}
            height={20}
          />
        </Link>
        <h1 className="text-normal font-medium text-center flex-1"></h1>
        <div className="w-10 h-10"></div>
      </header>
      
      <form onSubmit={handleSubmit} className="flex flex-col items-center px-8 mt-2">
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
          <li>
            {selectedFile ? (
              formData.image_url.startsWith('blob:') ? (
                <img
                  src={formData.image_url}
                  alt="preview"
                  width={300}
                  height={300}
                  style={{ objectFit: 'cover' }}
                  className="w-[300px] h-[300px] object-cover rounded-lg"
                />
              ) : (
                <Image
                  src={formData.image_url}
                  alt="preview"
                  width={300}
                  height={300}
                  style={{ objectFit: 'cover' }}
                  className="w-[300px] h-[300px] object-cover rounded-lg"
                />
              )
            ) : (
              <div className="flex justify-center items-center bg-white w-[300px] h-[300px]">
                <Image 
                  src="/icons/camera-icon.svg"
                  alt="camera-icon"
                  width={40}
                  height={40}
                />
              </div>
            )}
          </li>
        </ul>

        <div className="flex items-center gap-5 mt-4">
          <Image 
            src="/icons/photo-icon.svg"
            alt="photo-icon"
            width={24}
            height={24}
          />
          <label htmlFor="image" className="text-normal text-[#43B0FF] font-black ">
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

        <div className="flex flex-col items-center gap-2 w-[315px] mt-6">
          <div>
            <label htmlFor="name" className="inline-block text-large w-28">メニュー名</label>
            <input
              type="text"
              id="name"
              name="name"
              onChange={handleInputChange}
              className="bg-base border-b border-[#A2A2A2] py-2 outline-none"
              placeholder="メニュー名を入力"
              autoComplete="off"
              required
            />
          </div>
          <div>
            <label htmlFor="price" className="inline-block text-large w-28">価格</label>
            <input
              type="number"
              id="price"
              name="price"
              onChange={handleInputChange}
              className="bg-base border-b border-[#A2A2A2] py-2 outline-none"
              placeholder="価格を入力"
              autoComplete="off"
              required
              min="0"
            />
          </div>
          <div className="flex">
            <label htmlFor="description" className="inline-block text-large w-28">説明</label>
            <textarea
              name="description"
              id="description"
              onChange={handleInputChange}
              className="bg-base border-b border-[#A2A2A2] py-2 outline-none"
              placeholder="詳細を入力"
              autoComplete="off"
              required
            />
          </div>
        </div>

        <div className="mt-8">
          <label htmlFor="tags">タグ (最大10個)</label>
          
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

        <div className="mb-36 mt-8">
          <button 
            className="w-[300px] bg-accent text-white py-3 rounded-full"
            type="submit"
            disabled={isSubmitting || !formData.name.trim() || !formData.price || !formData.description.trim()}
          >
            {isSubmitting ? "投稿中..." : "投稿"}
          </button>
        </div>
      </form>

      <ConditionalFooter />
    </main>
  )
}