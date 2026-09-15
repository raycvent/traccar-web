import { useEffect } from 'react';
import * as maplibregl from 'maplibre-gl';

import { map, useMapReady } from '../map/core/MapView';

const DemoAssetMarkers = ({
  assets,
  selectedAssetKey,
  onSelect,
}) => {
  const mapReady = useMapReady();

  useEffect(() => {
    if (!mapReady) {
      return undefined;
    }

    const demoAssets = assets.filter(
      (asset) =>
        asset.placeholder &&
        Number.isFinite(asset.latitude) &&
        Number.isFinite(asset.longitude),
    );

    const markers = demoAssets.map((asset) => {
      const element = document.createElement('button');

      element.type = 'button';
      element.title = asset.name;

      element.style.width = '34px';
      element.style.height = '34px';
      element.style.borderRadius = '50%';
      element.style.border =
        selectedAssetKey === asset.key
          ? '4px solid white'
          : '3px solid white';
      element.style.background =
        asset.status === 'Offline'
          ? '#d84343'
          : '#168a55';
      element.style.boxShadow = '0 2px 8px rgba(0,0,0,0.45)';
      element.style.cursor = 'pointer';

      element.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        onSelect(asset);
      });

      const marker = new maplibregl.Marker({
        element,
        anchor: 'center',
      })
        .setLngLat([asset.longitude, asset.latitude])
        .addTo(map);

      return marker;
    });

    return () => {
      markers.forEach((marker) => marker.remove());
    };
  }, [mapReady, assets, selectedAssetKey, onSelect]);

  return null;
};

export default DemoAssetMarkers;