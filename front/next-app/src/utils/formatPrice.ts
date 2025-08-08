/**
 * 数値を3桁区切りでカンマを追加してフォーマットする関数
 * @param price 金額（数値）
 * @returns フォーマット済みの金額文字列
 */
export const formatPrice = (price: number): string => {
  return price.toLocaleString('ja-JP');
};
