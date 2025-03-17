"use client";

import { GoogleMap, LoadScript, OverlayView } from "@react-google-maps/api";
import { BeatLoader } from "react-spinners";
import { useEffect, useState, useCallback, useRef } from "react";
import AccommodationCard from "../components/AccommodationCard";
import { Accommodation } from "../types/Accommodation";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

export default function GoogleMapComponent() {
  const [center, setCenter] = useState({ lat: 10.824411, lng: 106.629401 });
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [zoom, setZoom] = useState(12);
  const [loading, setLoading] = useState<boolean>(true);
  const mapRef = useRef<google.maps.Map | null>(null);

  // Store map instance
  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  // Fetch accommodations when the center updates
  const fetchAccommodations = async (
    lat: number,
    lng: number,
    radius: number
  ) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/accommodations/nearby?lat=${lat}&lng=${lng}&radius=${radius}&page=0&size=30`
      );
      const data = await response.json();
      console.log("Fetched accommodations:", data);
      setAccommodations(data); // Store the fetched accommodations
    } catch (error) {
      console.error("Error fetching accommodations:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to calculate radius based on zoom and screen size
  const calculateRadius = () => {
    if (!mapRef.current) return 1000; // Default radius in meters

    const zoomLevel = mapRef.current.getZoom() || 12;
    setZoom(zoomLevel); // Update zoom state
    const mapDiv = mapRef.current.getDiv();
    const mapWidth = mapDiv.clientWidth; // Get map container width

    // Approximate radius calculation
    const earthCircumference = 40075000; // in meters
    const radius = (earthCircumference * mapWidth) / Math.pow(2, zoomLevel + 8);
    console.log("radius", radius);
    return radius;
  };

  // Update center when the user stops dragging
  const handleMapInteraction = useCallback(() => {
    if (mapRef.current) {
      const newCenter = mapRef.current.getCenter();
      if (newCenter) {
        const lat = newCenter.lat();
        const lng = newCenter.lng();
        console.log("new coordinates", { lat, lng });
        setCenter({ lat, lng });
        fetchAccommodations(lat, lng, calculateRadius()); // Fetch data from backend
      }
    }
  }, []);

  // Fetch accommodations on first render
  useEffect(() => {
    fetchAccommodations(center.lat, center.lng, 5000);
  }, []);

  return (
    <div className="flex gap-2 h-[100vh] p-2">
      {/* Left panel: display the list of accommodations */}
      <div className="h-full w-full">
        <div className="scoller-wrapper overflow-y-auto h-full">
          <h2 className="text-lg font-semibold mb-4">Accommodations</h2>
          <div className="grid grid-cols-3 gap-2">
            {accommodations.length > 0 &&
              accommodations.map((accommodation) => (
                <AccommodationCard
                  key={accommodation.id}
                  accommodation={accommodation}
                />
              ))}

            {accommodations.length === 0 && (
              <div className="text-center text-gray-500 w-full">
                No accommodations found
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="h-full w-full relative">
        {loading && (
          <div className="absolute top-1/4 left-0 w-full flex items-center justify-center z-9999">
            <div className="bg-white p-2 rounded-lg shadow-lg">
              <BeatLoader color="#000000" size={12} />
            </div>
          </div>
        )}
        <LoadScript
          googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
        >
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={zoom}
            center={center}
            options={{
              scaleControl: true, // Enables the distance scale ruler
              mapTypeControl: true, // Allows users to change the map type
            }}
            onLoad={onLoad}
            onDragEnd={handleMapInteraction}
            onZoomChanged={handleMapInteraction}
          >
            {accommodations.slice(0, 10).map((acc) => (
              <OverlayView
                key={acc.id}
                position={{ lat: acc.latitude, lng: acc.longitude }}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              >
                {/* Display price tags on the map */}
                <div
                  className="bg-white text-black inline-block text-center px-2 hover:scale-105 transition-all py-1 rounded-2xl shadow-lg cursor-pointer"
                  style={{ fontSize: "14px", fontWeight: "bold" }}
                >
                  ${acc.price}
                </div>
              </OverlayView>
            ))}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
}
