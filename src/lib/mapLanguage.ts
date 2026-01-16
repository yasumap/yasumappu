import MapboxLanguage from '@mapbox/mapbox-gl-language';

/**
 * サポートされる言語コード
 */
export type SupportedLanguage = 'ja' | 'en' | 'es' | 'fr' | 'de' | 'ru' | 'zh-Hans' | 'pt' | 'ar' | 'ko';

/**
 * デフォルトの言語設定
 */
export const DEFAULT_LANGUAGE: SupportedLanguage = 'ja';

/**
 * 日本語対応のMapboxスタイルURL
 * mapbox-gl-languageプラグインはv8ベースのスタイルが必要
 */
export const MAPBOX_STYLE_STREETS = 'mapbox://styles/mapbox/streets-v12';

/**
 * Mapbox言語コントロールを作成
 * @param language - 表示言語（デフォルト: 日本語）
 * @returns MapboxLanguageインスタンス
 */
export function createLanguageControl(language: SupportedLanguage = DEFAULT_LANGUAGE) {
  return new MapboxLanguage({
    defaultLanguage: language,
  });
}
