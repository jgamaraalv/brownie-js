export const TILES_MAP_SNIPPET = `import { useState } from 'react';
import { GeoMap, TileLayer, Marker, Popup, Circle, MapControl } from '@brownie-js/react';
import { MarkerCluster } from '@brownie-js/react/cluster';
import { ZoomControl, ScaleBar } from '@brownie-js/react/controls';

const animals = [
  { id: '1', name: 'Rex',  type: 'lost',  coordinates: [-46.65, -23.56] },
  { id: '2', name: 'Luna', type: 'found', coordinates: [-46.63, -23.55] },
  { id: '3', name: 'Max',  type: 'lost',  coordinates: [-46.64, -23.54] },
  { id: '4', name: 'Mel',  type: 'found', coordinates: [-46.62, -23.57] },
  { id: '5', name: 'Bob',  type: 'lost',  coordinates: [-46.66, -23.53] },
  { id: '6', name: 'Nina', type: 'found', coordinates: [-46.70, -23.50] },
  { id: '7', name: 'Thor', type: 'lost',  coordinates: [-46.58, -23.60] },
];

const lostColor = '#d4850c';
const foundColor = '#7c8b6f';

function PetFinderMap() {
  const [selected, setSelected] = useState(null);
  const animal = animals.find((a) => a.id === selected);

  return (
    <GeoMap center={[-46.63, -23.55]} zoom={13} mapLabel="Pet finder map">
      <TileLayer />
      <Circle center={[-46.63, -23.55]} radius={2000} color="#7c8b6f" />
      <MarkerCluster
        animated
        categoryKey="type"
        categoryColors={{ lost: lostColor, found: foundColor }}
      >
        {animals.map((m) => (
          <Marker
            key={m.id}
            coordinates={m.coordinates}
            color={m.type === 'lost' ? lostColor : foundColor}
            animated
            onClick={() => setSelected(m.id)}
          />
        ))}
      </MarkerCluster>
      {animal && (
        <Popup
          coordinates={animal.coordinates}
          onClose={() => setSelected(null)}
          image={{ src: 'https://placedog.net/400/200?random', alt: animal.name }}
        >
          <strong>{animal.name}</strong> — {animal.type}
        </Popup>
      )}
      <MapControl position="top-right">
        <ZoomControl />
      </MapControl>
      <MapControl position="bottom-left">
        <ScaleBar />
      </MapControl>
    </GeoMap>
  );
}`;

export const GEOLOCATION_SNIPPET = `import { GeoMap, TileLayer, MapControl } from '@brownie-js/react';
import { Geolocation } from '@brownie-js/react/geo';
import { ZoomControl, ScaleBar } from '@brownie-js/react/controls';

function LiveLocationMap() {
  return (
    <GeoMap center={[-46.63, -23.55]} zoom={13} mapLabel="Location map">
      <TileLayer />
      <Geolocation
        watch={true}
        enableHighAccuracy={true}
        onError={(err) => console.warn(err.message)}
      />
      <MapControl position="top-right">
        <ZoomControl />
      </MapControl>
      <MapControl position="bottom-left">
        <ScaleBar />
      </MapControl>
    </GeoMap>
  );
}`;

export const ROUTE_FIXED_SNIPPET = `import { GeoMap, TileLayer, Marker, MapControl } from '@brownie-js/react';
import { Route } from '@brownie-js/react/route';
import { ZoomControl, ScaleBar } from '@brownie-js/react/controls';

function FixedRoute() {
  return (
    <GeoMap center={[-44.9, -23.2]} zoom={7} mapLabel="Route map">
      <TileLayer />
      <Route
        coordinates={[[-46.63, -23.55], [-43.17, -22.91]]}
        color="#d4850c"
        strokeWidth={3}
        routing={true}
        animated
        animationSpeed={2}
        onRouteLoaded={(data) =>
          console.log(\`\${(data.distance / 1000).toFixed(0)} km\`)
        }
      />
      <Marker coordinates={[-46.63, -23.55]} color="#7c8b6f" animated />
      <Marker coordinates={[-43.17, -22.91]} color="#d4850c" animated />
      <MapControl position="top-right">
        <ZoomControl />
      </MapControl>
      <MapControl position="bottom-left">
        <ScaleBar />
      </MapControl>
    </GeoMap>
  );
}`;

export const ROUTE_INTERACTIVE_SNIPPET = `import { useState } from 'react';
import { GeoMap, TileLayer, Marker, MapControl } from '@brownie-js/react';
import { Route } from '@brownie-js/react/route';
import { ZoomControl, ScaleBar } from '@brownie-js/react/controls';

function InteractiveRoute() {
  const [points, setPoints] = useState([
    [-46.63, -23.55], // Sao Paulo
    [-43.17, -22.91], // Rio de Janeiro
  ]);

  return (
    <GeoMap center={[-44.9, -23.2]} zoom={7} mapLabel="Interactive route">
      <TileLayer />
      <Route
        coordinates={points}
        routing={true}
        color="#d4850c"
        strokeWidth={3}
        animated
        animationSpeed={2}
      />
      {points.map((coord, i) => (
        <Marker
          key={i}
          coordinates={coord}
          draggable={true}
          animated
          color={i === 0 ? '#7c8b6f' : '#d4850c'}
          onDragEnd={(newCoord) => {
            const next = [...points];
            next[i] = newCoord;
            setPoints(next);
          }}
        />
      ))}
      <MapControl position="top-right">
        <ZoomControl />
      </MapControl>
      <MapControl position="bottom-left">
        <ScaleBar />
      </MapControl>
    </GeoMap>
  );
}`;

export const ROUTE_MULTIPOINT_SNIPPET = `import { GeoMap, TileLayer, Marker, MapControl } from '@brownie-js/react';
import { Route } from '@brownie-js/react/route';
import { ZoomControl, ScaleBar } from '@brownie-js/react/controls';

const waypoints = [
  [-46.63, -23.55], // Sao Paulo
  [-47.06, -22.91], // Campinas
  [-47.81, -21.18], // Ribeirao Preto
  [-48.28, -18.92], // Uberlandia
];

function MultipointRoute() {
  return (
    <GeoMap center={[-47.4, -21.2]} zoom={7} mapLabel="Multi-point route">
      <TileLayer />
      <Route
        coordinates={waypoints}
        routing={true}
        color="#6b5e54"
        strokeWidth={3}
        animated
        animationSpeed={2}
      />
      {waypoints.map((coord, i) => (
        <Marker key={i} coordinates={coord} color="#6b5e54" animated />
      ))}
      <MapControl position="top-right">
        <ZoomControl />
      </MapControl>
      <MapControl position="bottom-left">
        <ScaleBar />
      </MapControl>
    </GeoMap>
  );
}`;

export const THEME_SNIPPET = `import { GeoMap, TileLayer, Marker, MapControl } from '@brownie-js/react';
import { MapThemeProvider } from '@brownie-js/react/theme';
import { ZoomControl, ScaleBar } from '@brownie-js/react/controls';

function ThemedMap() {
  return (
    <MapThemeProvider
      theme={{
        markerColor: '#d4850c',
        popupBg: '#1a0f0a',
        popupColor: '#f5f0eb',
        popupRadius: '12px',
        controlBg: '#1a0f0a',
        controlColor: '#f5f0eb',
        controlShadow: '0 2px 8px rgba(26,15,10,0.4)',
        focusRing: '0 0 0 3px rgba(212,133,12,0.4)',
      }}
    >
      <GeoMap center={[-46.63, -23.55]} zoom={13} mapLabel="Themed map">
       <TileLayer />
        <Marker coordinates={[-46.65, -23.56]} />
        <Marker coordinates={[-46.63, -23.55]} />
        <Marker coordinates={[-46.66, -23.59]} />
        <MapControl position="top-right">
          <ZoomControl />
        </MapControl>
        <MapControl position="bottom-left">
          <ScaleBar />
        </MapControl>
      </GeoMap>
    </MapThemeProvider>
  );
}`;

export const ROUTE_TO_HERE_SNIPPET = `import { useState } from 'react';
import { GeoMap, TileLayer, Marker, MapControl } from '@brownie-js/react';
import { Route } from '@brownie-js/react/route';
import { ZoomControl, ScaleBar } from '@brownie-js/react/controls';

function RouteToHere() {
  const userPosition = [-46.63, -23.55]; // or from useGeolocation()
  const [destination, setDestination] = useState(null);

  const places = [
    { name: 'Ibirapuera Park', coordinates: [-46.66, -23.59] },
    { name: 'Paulista Ave', coordinates: [-46.65, -23.56] },
    { name: 'Pinheiros', coordinates: [-46.69, -23.57] },
    { name: 'Vila Madalena', coordinates: [-46.69, -23.55] },
    { name: 'Liberdade', coordinates: [-46.63, -23.56] },
  ];

  return (
    <GeoMap center={[-46.65, -23.57]} zoom={13} mapLabel="Route to here">
      <TileLayer />
      <Marker coordinates={userPosition} color="#d4850c" animated />
      {places.map((p) => (
        <Marker
          key={p.name}
          coordinates={p.coordinates}
          color="#7c8b6f"
          animated
          onClick={() => setDestination(p.coordinates)}
        />
      ))}
      {destination && (
        <Route
          coordinates={[userPosition, destination]}
          routing={true}
          color="#d4850c"
          strokeWidth={3}
          animated
          animationSpeed={2}
        />
      )}
      <MapControl position="top-right">
        <ZoomControl />
      </MapControl>
      <MapControl position="bottom-left">
        <ScaleBar />
      </MapControl>
    </GeoMap>
  );
}`;
