// *.d.ts 只包含類型聲明，不包含邏輯，不會被編譯也不會被webpack打包
// 以css為後綴的文件，都會遵循以下的約定
// 約定內容: 導出key所在的對象，原始的類名和相應的值，都將被轉化為這個對象
declare module "*.css" {
  const css: { [key: string]: string };
  export default css;
}
