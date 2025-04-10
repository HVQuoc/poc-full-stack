"use";
import L from "leaflet";
export function createPriceTagMarker(price: number, currency: string) {
  return L.divIcon({
    className: "", // prevent default styling
    html: `
      <div class="relative z-0 hover:z-100 inline-block bg-white text-black border border-gray-200 text-center px-2 py-1 rounded-2xl shadow-lg font-bold hover:scale-[1.05] cursor-pointer w-max">
          <span>${price}</span>
          <span>${currency}</span>
      </div>`,
  });
}
