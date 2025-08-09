import axios from "axios";

export type ImageUploadResponse = 
  | {
    success: true;
    message: string;
    url: string;
    filename: string;
  }
  | {
    success: false;
    detail: string;
  };

export async function uploadImage(file: File): Promise<ImageUploadResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/upload/image`;
  console.log("Upload URL:", apiUrl); // デバッグ用
  
  // FormDataを作成
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post<{
      success: boolean;
      message: string;
      url: string;
      filename: string;
    }>(apiUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return {
      success: true,
      message: response.data.message,
      url: response.data.url,
      filename: response.data.filename,
    };
  } catch (error: any) {
    console.error("Image upload error:", error);
    console.error("Error response:", error.response);
    console.error("Error config:", error.config);
    
    return {
      success: false,
      detail: error.response?.data?.detail || error.message || "画像のアップロードに失敗しました",
    };
  }
}

export async function deleteImage(filename: string): Promise<{ success: boolean; message?: string; detail?: string }> {
  const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/upload/image/${filename}`;

  try {
    const response = await axios.delete<{
      success: boolean;
      message: string;
    }>(apiUrl);
    
    return {
      success: true,
      message: response.data.message,
    };
  } catch (error: any) {
    console.error("Image delete error:", error);
    
    return {
      success: false,
      detail: error.response?.data?.detail || "画像の削除に失敗しました",
    };
  }
}
