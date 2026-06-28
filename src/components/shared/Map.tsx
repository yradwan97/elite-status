"use client";

import { useState, useEffect } from "react";
import { Map, MapMarker, MarkerContent, MapControls } from "@/components/ui/map";
import { MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface PropertyMapProps {
  lat: string;
  long: string;
}

const PropertyMap = ({ lat, long }: PropertyMapProps) => {
  const { t } = useTranslation();

  const [position, setPosition] = useState({ lat, lng: long });

  // Sync if parent props change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPosition({ lat, lng: long });
  }, [lat, long]);

  // [lng, lat] order required by the map library
  const center: [number, number] = [parseFloat(position.lng), parseFloat(position.lat)];

  const navigationUrl = `https://www.google.com/maps/dir/?api=1&destination=${position.lat},${position.lng}`;

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200">
      {/* Interactive map — replaces the static Google Maps image */}
      <div className="h-55 w-full">
        <Map center={center} zoom={11} theme="light" className="h-full w-full">
          <MapControls showZoom />
          <MapMarker longitude={parseFloat(position.lng)} latitude={parseFloat(position.lat)}>
            <MarkerContent>
              <MapPin
                className="fill-primary stroke-white"
                size={28}
                style={{ cursor: "default" }}
              />
            </MarkerContent>
          </MapMarker>
        </Map>
      </div>

      {/* Footer — identical to the original */}
      <div className="p-3 bg-white border-t border-gray-100 flex justify-end">
        <Button
          variant="outline"
          size="lg"
          className="text-white cursor-pointer bg-navy hover:bg-white hover:text-navy transition-colors gap-1.5"
          onClick={() => window.open(navigationUrl, "_blank")}
        >
          <Navigation className="w-4 h-4 " />
          {t("Properties.Details.map.navigate")}
        </Button>
      </div>
    </div>
  );
};

export default PropertyMap;