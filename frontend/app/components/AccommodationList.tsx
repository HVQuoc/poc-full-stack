import React from "react";
import { Accommodation } from "../types/Accommodation";
import AccommodationCard from "./AccommodationCard";

const AccommodationList = ({ items }: { items: Accommodation[] }) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {items.length > 0 &&
        items.map((accommodation) => (
          <AccommodationCard
            key={accommodation.id}
            accommodation={accommodation}
          />
        ))}

      {items.length === 0 && (
        <div className="p-0 m-0 text-gray-500 w-full">
          No accommodations found
        </div>
      )}
    </div>
  );
};

export default AccommodationList;
