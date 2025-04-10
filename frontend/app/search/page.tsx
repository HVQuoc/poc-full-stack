"use client";

import { BeatLoader } from "react-spinners";
import { useState } from "react";
import AccommodationCard from "../components/AccommodationCard";
import { Accommodation } from "../types/Accommodation";
import { Paginator } from "primereact/paginator";
import { Skeleton } from "primereact/skeleton";
import dynamic from "next/dynamic";
import { Coordinates } from "../types/Coordinates";
import AccommodationList from "../components/AccommodationList";
import { useAccommodations } from "./hooks/useAccommodations";
import SearchBar from "../components/SearchPage/SearchBar";
const LeafletMap = dynamic(() => import("../components/MapView/LeafletMap"), {
  ssr: false,
});

export default function SearchPage() {
  const [selectedAcc, setSelectedAcc] = useState<Accommodation | null>(null);
  const [center, setCenter] = useState<Coordinates>({
    lat: 10.824411,
    lng: 106.629401,
  });
  const [radius, setRadius] = useState<number>(500);
  const pageSize = 20;
  const { accommodations, pagination, isLoading, setPage } = useAccommodations({
    lat: center.lat,
    lng: center.lng,
    radius,
    pageSize,
  });

  const onPageChange = (event: {
    first: number;
    rows: number;
    page: number;
  }) => {
    setPage(event.page + 1); // Update the page using setPage
    window.history.pushState(null, "", `?page=${event.page + 1}`);
  };

  // Handle map changes
  const handleMapChange = (lat: number, lng: number, newRadius: number) => {
    setCenter({ lat, lng }); // Update the center coordinates
    setRadius(newRadius);
  };

  // // Fetch accommodations on first render
  // useEffect(() => {
  //   fetchAccommodations(center.lat, center.lng, 500);
  // }, []);

  return (
    <div className="relative flex gap-6 h-full w-full pl-4">
      {/* Left panel: display the list of accommodations */}
      <div className="h-full w-3/5 py-4">
        {/* Search bar */}
        <div className="flex">
          <SearchBar onSelect={setCenter} />
        </div>

        {isLoading ? (
          // Loading animation
          <div className="py-4 grid grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="p-2 border border-gray-300 rounded-lg shadow-sm"
              >
                <div className="flex flex-col justify-center items-center gap-4">
                  <div className="w-full h-[150px]">
                    <Skeleton shape="rectangle" width="100%" height="100%" />
                  </div>
                  <div className="w-full flex gap-2">
                    <Skeleton width="75%" height="1.5rem" />
                  </div>
                  <div className="w-full flex gap-2">
                    <Skeleton width="50%" height="1.5rem" />
                    <Skeleton width="25%" height="1.5rem" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <h2 className="text-lg font-semibold my-2">Accommodations</h2>
            {pagination.totalPages > 1 && accommodations.length > 0 && (
              <p className="my-2">
                {pagination.totalItems > 100 && <span>Over </span>}{" "}
                {pagination.totalItems} results
              </p>
            )}
            <AccommodationList items={accommodations} />

            {/* Pagination */}
            {pagination.totalItems > pageSize && (
              <div className="mt-4">
                <Paginator
                  first={(pagination.page - 1) * pageSize}
                  rows={pageSize}
                  totalRecords={pagination.totalItems}
                  onPageChange={onPageChange}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right panel */}
      <div className="sticky top-0 w-2/5 h-[100vh]">
        {/* Loading animation */}
        {isLoading && (
          <div className="absolute top-1/4 left-0 w-full flex items-center justify-center z-9999">
            <div className="bg-white p-2 rounded-lg shadow-lg">
              <BeatLoader color="#000000" size={12} />
            </div>
          </div>
        )}

        {/* Mapview */}
        <LeafletMap
          accommodations={accommodations}
          onChange={handleMapChange}
          setSelectedAcc={setSelectedAcc}
          centerPoint={center}
          setCenterPoint={setCenter}
        />

        {/* Diplay selected accommodation on Map */}
        {selectedAcc && (
          <div className="absolute top-0 left-0 z-9999 h-full w-full">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="bg-white rounded-xl text-black shadow-lg w-[250px]">
                <AccommodationCard
                  key={selectedAcc.id + "popup"}
                  accommodation={selectedAcc}
                />
                <button
                  onClick={() => setSelectedAcc(null)}
                  className="hover:scale-105 absolute flex items-center justify-center w-6 h-6 right-0 top-0 m-2 p-2 bg-gray-200 text-black rounded-full shadow-sm text-sm"
                >
                  <span className="p-0 m-0 cursor-pointer">&#x2715;</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
