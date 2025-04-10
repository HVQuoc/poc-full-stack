"use client";
import { Accommodation } from "@/app/types/Accommodation";
import { Coordinates } from "@/app/types/Coordinates";
import { createPriceTagMarker } from "@/app/utils/OSMHelper";
import React, { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

interface LeafletMapProps {
  accommodations: Accommodation[];
  centerPoint: Coordinates;
  onChange: (lat: number, lng: number, radius: number) => void;
  setSelectedAcc: (acc: Accommodation | null) => void;
  setCenterPoint: ({ lat, lng }: Coordinates) => void;
}

const LeafletMap = ({
  accommodations,
  centerPoint,
  onChange,
  setSelectedAcc,
  setCenterPoint,
}: LeafletMapProps) => {
  const [zoom, setZoom] = useState(15);
  const mapRef = useRef<HTMLDivElement | null>(null);

  // Function to calculate radius based on zoom level and map width
  const calculateRadius = (zoomLevel: number) => {
    const earthCircumference = 40075000; // in meters
    const mapWidth = mapRef.current ? mapRef.current.clientWidth : 0; // Get the map width in pixels
    const radius = (earthCircumference * mapWidth) / Math.pow(2, zoomLevel + 9);
    // console.log("radius, mapWidth", { radius, mapWidth });
    return radius;
  };

  // Custom component to handle map interactions
  function MapEventHandler() {
    useMapEvents({
      moveend: (event) => {
        const map = event.target;
        const newCenter = map.getCenter();
        const newZoom = map.getZoom();
        if (
          newCenter.lat !== centerPoint.lat ||
          newCenter.lng !== centerPoint.lng ||
          newZoom !== zoom
        ) {
          setCenterPoint({ lat: newCenter.lat, lng: newCenter.lng });
          setZoom(newZoom);
          onChange(newCenter.lat, newCenter.lng, calculateRadius(newZoom));
        }
      },
    });
    return null;
  }

  // Custom hook to handle map center changes
  function MapFocusHandler() {
    const map = useMap();
    useEffect(() => {
      map.flyTo([centerPoint.lat, centerPoint.lng], zoom);
    }, [centerPoint, zoom]);
    return null;
  }

  return (
    <div ref={mapRef} className="w-full h-full">
      <MapContainer
        center={[centerPoint.lat, centerPoint.lng]}
        zoom={zoom}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapEventHandler />
        <MapFocusHandler />
        {accommodations.map((acc) => (
          <Marker
            key={acc.id}
            position={[acc.latitude, acc.longitude]}
            icon={createPriceTagMarker(acc.price, "$")}
            eventHandlers={{
              click: () => setSelectedAcc(acc),
            }}
          ></Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default LeafletMap;
