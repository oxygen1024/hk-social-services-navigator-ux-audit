import {useEffect, useRef} from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function CentreMap({units}: {units: any[]}) {
  const host = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!host.current || !units.length) return;
    const map = L.map(host.current, {scrollWheelZoom: false, zoomControl: false});
    L.control.zoom({zoomInTitle: '放大地圖', zoomOutTitle: '縮小地圖'}).addTo(map);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19, attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
    const bounds = L.latLngBounds([]);
    for (const u of units) {
      const marker = L.marker(u.point, {
        title: u.name, alt: u.name,
        icon: L.divIcon({className: 'centre-pin', iconSize: [16,16]}),
      }).addTo(map);
      const link = document.createElement('a');
      link.textContent = u.name + ' · 查看地址、電話';
      link.href = '#' + encodeURIComponent('unit-' + u.kind + '-' + u.tel);
      marker.bindPopup(link);
      bounds.extend(u.point);
    }
    map.fitBounds(bounds, {padding:[24,24], maxZoom:16});
    return () => { map.remove(); };
  }, [units]);
  return <section ref={host} className="centre-map" aria-label="篩選結果地圖" />;
}
