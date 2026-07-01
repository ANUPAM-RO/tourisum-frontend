import dynamic from 'next/dynamic';

export const InteractiveMap = dynamic(() => import('./InteractiveMap'), { ssr: false });
export type { MapMarker } from './InteractiveMap';
