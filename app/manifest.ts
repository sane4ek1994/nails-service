/**
 * PWA Manifest configuration
 */

import type { MetadataRoute } from 'next';
import { THEME_COLOR } from '@/src/shared/lib/constants';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Маникюр PWA',
    short_name: 'Маникюр',
    description: 'Веб-приложение для записи к мастеру маникюра',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: THEME_COLOR,
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}

