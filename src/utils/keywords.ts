/**
 * キーワード2次元配列を表示用文字列に変換する
 * 内側の配列（AND条件）はスペース区切り、外側の配列（OR条件）は改行区切り
 */
export const keywordsToString = (keywords: string[][]): string =>
  keywords.map((andGroup) => andGroup.join(" ")).join("\n");

/**
 * 表示用文字列をキーワード2次元配列に変換する
 */
export const stringToKeywords = (str: string): string[][] =>
  str
    .split("\n")
    .map((line) => line.split(/\s+/).filter(Boolean))
    .filter((group) => group.length > 0);
