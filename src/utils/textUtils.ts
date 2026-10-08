/**
 * Chuẩn hóa văn bản tiếng Việt theo bảng mã Unicode dựng sẵn chuẩn (NFC - Precomposed Unicode)
 * Đảm bảo:
 * 1. Toàn bộ chữ tiếng Việt dùng bảng mã Unicode Dựng Sẵn (NFC).
 * 2. Tuyệt đối không xuất hiện ký tự Unicode Tổ Hợp (NFD) hay dấu thanh rời rạc (như cấ´u, Phố´i, đồ`, vấ´n, tiế´t).
 * 3. Tự động khắc phục các âm tiết bị tách rời do dấu thanh (như chố` n -> chốn, triề` u -> triều, bắ` t -> bắt, chiế` c -> chiếc).
 * 4. Loại bỏ các dấu backtick ( ` ) hoặc modifier accents lạ xen giữa từ.
 */
export function normalizeVietnameseText(input: string): string {
  if (!input) return '';

  let text = String(input).normalize('NFC');

  // 1. Khắc phục âm tiết bị tách rời bởi dấu thanh gõ sai hoặc ký tự modifier:
  // Ví dụ: "chố` n" -> "chốn", "triề` u" -> "triều", "bắ` t" -> "bắt", "chiế` c" -> "chiếc", "đầ` u" -> "đầu"
  text = text.replace(/([a-zA-Z\u00C0-\u1EF9])[\u00B4\u0060\u02CA\u02CB\u02C6\u02DC\u02C7\u02D9]+\s+(ng|nh|ch|[nmtpcuioy])\b/gi, '$1$2');
  text = text.replace(/([a-zA-Z\u00C0-\u1EF9])\s+[\u00B4\u0060\u02CA\u02CB\u02C6\u02DC\u02C7\u02D9]+(ng|nh|ch|[nmtpcuioy])\b/gi, '$1$2');

  // 2. Loại bỏ dấu modifier accents/backtick gắn liền cạnh ký tự (cấ´u -> cấu, Phố´i -> Phối, đồ` -> đồ, vấ´n -> vấn, tiế´t -> tiết)
  text = text.replace(/([\p{L}\p{M}])[\u00B4\u0060\u02CA\u02CB\u02C6\u02DC\u02C7\u02D9]+/gu, '$1');
  text = text.replace(/[\u00B4\u0060\u02CA\u02CB\u02C6\u02DC\u02C7\u02D9]+([\p{L}\p{M}])/gu, '$1');

  // 3. Loại bỏ ký tự backtick cô lập nằm giữa các chữ cái
  text = text.replace(/(?<=[\p{L}\p{M}])`+(?=[\p{L}\p{M}])/gu, '');

  // 4. Loại bỏ mọi ký tự Combining Diacritical Marks còn sót lại chưa kết hợp được
  text = text.replace(/[\u0300-\u036f\u1dc0-\u1dff\u20d0-\u20ff\ufe20-\ufe2f]/g, '');

  return text.normalize('NFC');
}
