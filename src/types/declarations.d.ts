// src/types/declarations.d.ts

// react-map-glの型チェックを回避する宣言
declare module 'react-map-gl' {
    export * from 'react-map-gl/dist/esm/exports-s';
    const Map: any;
    export default Map;
    export const Marker: any;
    export const Popup: any;
    export const NavigationControl: any;
    export const FullscreenControl: any;
    export const ScaleControl: any;
    export const GeolocateControl: any;
    export const Source: any;
    export const Layer: any;
    export const useMap: any;
}