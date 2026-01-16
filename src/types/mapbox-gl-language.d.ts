declare module '@mapbox/mapbox-gl-language' {
  import type { IControl, Map } from 'mapbox-gl';

  interface MapboxLanguageOptions {
    /** サポートする言語のリスト */
    supportedLanguages?: string[];
    /** 言語ソースを変換する関数 */
    languageSource?: string;
    /** デフォルトの言語コード */
    defaultLanguage?: string;
    /** 言語フィールドを取得する関数または正規表現 */
    getLanguageField?: (language: string) => string;
    /** 言語フィールドの正規表現 */
    languageField?: RegExp;
    /** 除外するレイヤーIDのリスト */
    excludedLayerIds?: string[];
  }

  class MapboxLanguage implements IControl {
    constructor(options?: MapboxLanguageOptions);
    onAdd(map: Map): HTMLElement;
    onRemove(): void;
    setLanguage(language: string): void;
  }

  export default MapboxLanguage;
}
