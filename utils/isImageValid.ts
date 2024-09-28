export function isValidBase64Image(base64: string): boolean {
  const base64Regex = /^data:image\/(jpeg|jpg|png|avif|webp|);base64,/;

  return base64Regex.test(base64);
}
