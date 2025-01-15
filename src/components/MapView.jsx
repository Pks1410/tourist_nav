import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { fetchAttractions } from "../utils/utils";
import AttractionCardList from "./AttractionCardList";
import "../style/styles.css";
import SearchBar from "./SearchBar";
import PropTypes from "prop-types";
import { ping } from "ldrs";
import "leaflet-routing-machine";

ping.register();

// Create custom icon for user's location
const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/4899/4899329.png", // You can use any custom image here
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});
const locationIcon = new L.Icon({
  iconUrl:
    "https://www.iconpacks.net/icons/2/free-location-icon-2955-thumb.png", // You can use any custom image here
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});
// Custom search location icon
const searchIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.freepik.com/512/12536/12536176.png",
  iconSize: [50, 50],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

function MapView() {
  const [location, setLocation] = useState(null);
  const [attractions, setAttractions] = useState([]);
  const [selectedAttraction, setSelectedAttraction] = useState(null);
  const [searchLocation, setSearchLocation] = useState(null);
  const mapRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [directions, setDirections] = useState(null);
  const [isFindDirectionMode, setIsFindDirectionMode] = useState(false);

  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);
  const routeControlRef = useRef(null);
  const markersRef = useRef([]);

  const MapCenter = ({ coords }) => {
    const map = useMap();
    const handleLocateMe = () => {
      if (location && map) {
        map.setView(location, 13);
        setSearchLocation(null);
      }
    };

    useEffect(() => {
      if (coords && map) {
        map.setView(coords, 13);
      }
    }, [coords, map]);

    return (
      <button
        onClick={handleLocateMe}
        style={{
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          padding: "10px 15px",
          borderRadius: "5px",
          fontSize: "14px",
          cursor: "pointer",
          zIndex: 1000,
        }}
      >
        Locate Me
      </button>
    );
  };

  // Fetch user's location when the component mounts
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation([latitude, longitude]); // Set location once successfully fetched
        },
        (error) => {
          console.error("Geolocation error: ", error); // Handle geolocation error
        }
      );
    }
  }, []);

  // Fetch Points of Interest based on current or search location
  useEffect(() => {
    if (location || searchLocation) {
      setLoading(true);
      const targetLocation = searchLocation || location;
      fetchAttractions(targetLocation[0], targetLocation[1]).then(
        (newAttractions) => {
          setAttractions(newAttractions);
          setLoading(false);
        }
      );
    }
  }, [location, searchLocation]); // Depend on location or searchLocation

  const handleCardClick = (attraction) => {
    setSelectedAttraction(attraction);
    if (mapRef.current) {
      const markerPosition = new L.LatLng(attraction.lat, attraction.lon);
      mapRef.current.flyTo(markerPosition, 15);

      // Fetch and display directions
      if (location) {
        if (routeControlRef.current) {
          mapRef.current.removeControl(routeControlRef.current);
        }
        const routeControl = L.Routing.control({
          waypoints: [
            L.latLng(location[0], location[1]),
            L.latLng(attraction.lat, attraction.lon),
          ],
          lineOptions: {
            styles: [
              {
                color: "#0703fc",
                weight: 5,
                opacity: 0.7,
              },
            ],
          },
          createMarker: function (i, waypoint, n) {
            if (i === 0 || i === n - 1) {
              // show markers
              return L.marker(waypoint.latLng);
            }
            return false;
          },
          routeWhileDragging: false,
          draggleWaypoints: false,
          geocoder: null,
        }).addTo(mapRef.current);
        setDirections(routeControl);
        routeControlRef.current = routeControl;
      }
    }
  };

  // Handle location search
  const handleSearchSelect = (coords) => {
    setSearchLocation(coords);
    // setLoading(true);
  };
  const handleFindDirection = () => {
    setIsFindDirectionMode(!isFindDirectionMode);
    setStartLocation(null);
    setEndLocation(null);
  };

  // Handle start and end point selection for direction
  const handleDirectionSelect = (type, coords) => {
    if (type === "start") {
      setStartLocation(coords);
    } else {
      setEndLocation(coords);
    }
  };

  // Show route between start and end location using Leaflet Routing Machine
  useEffect(() => {
    if (startLocation && endLocation && mapRef.current) {
      if (routeControlRef.current) {
        mapRef.current.removeControl(routeControlRef.current);
      }
      const routeControl = L.Routing.control({
        waypoints: [
          L.latLng(startLocation[0], startLocation[1]),
          L.latLng(endLocation[0], endLocation[1]),
        ],
        lineOptions: {
          styles: [
            {
              color: "#0703fc",
              weight: 5,
              opacity: 0.7,
            },
          ],
        },
        createMarker: function (i, waypoint, n) {
          if (i === 0 || i === n - 1) {
            // show markers
            return L.marker(waypoint.latLng);
          }
          return false;
        },
        routeWhileDragging: false,
        draggableWaypoints: false,
        geocoder: null,
      }).addTo(mapRef.current);
      routeControlRef.current = routeControl;
    }
  }, [startLocation, endLocation]);

  // Reset the map to the user’s location
  const handleReset = () => {
    if (mapRef.current) {
      markersRef.current.forEach((marker) => marker.remove());
      if (routeControlRef.current) {
        mapRef.current.removeControl(routeControlRef.current);
      }
      mapRef.current.setView(location, 13);
      setSearchLocation(null);
      setStartLocation(null);
      setEndLocation(null);
      setSelectedAttraction(null);
    }
  };
  console.log("Loading is " + loading);
  return (
    <div className="map-container">
      <MapContainer
        center={location || [51.505, -0.09]}
        zoom={13}
        ref={mapRef}
        style={{ width: "100%", height: "100%" }}
        whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {location && (
          <Marker position={location} icon={userIcon}>
            <Popup>Your current location</Popup>
          </Marker>
        )}
        {searchLocation && (
          <Marker position={searchLocation} icon={searchIcon}>
            <Popup>Search Location</Popup>
          </Marker>
        )}
        <div className="button-group">
          <button
            onClick={handleReset}
            style={{
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              padding: "10px 15px",
              borderRadius: "5px",
              fontSize: "14px",
              cursor: "pointer",
              zIndex: 1000,
            }}
          >
            Reset Map
          </button>
          <button
            onClick={handleFindDirection}
            style={{
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              padding: "10px 15px",
              borderRadius: "5px",
              fontSize: "14px",
              cursor: "pointer",
              zIndex: 1000,
            }}
          >
            {isFindDirectionMode ? "Cancel" : "Find Direction"}
          </button>

          <MapCenter coords={searchLocation || location} />
        </div>
        {attractions.map((attraction) => (
          <Marker
            key={attraction.id}
            position={[attraction.lat, attraction.lon]}
            icon={
              selectedAttraction && selectedAttraction.id === attraction.id
                ? new L.Icon({
                    iconUrl:
                      "https://cdn-icons-png.flaticon.com/512/3183/3183012.png",
                    iconSize: [40, 40],
                    iconAnchor: [20, 40],
                    popupAnchor: [0, -40],
                  })
                : locationIcon
            }
          >
            <Popup>{attraction.name}</Popup>
          </Marker>
        ))}
        {isFindDirectionMode && (
          <div
            style={{
              position: "absolute",
              top: "100px",
              right: "20px",
              zIndex: 1000,
            }}
          >
            <SearchBar
              onSearchSelect={(coords) =>
                handleDirectionSelect("start", coords)
              }
            />
            <SearchBar
              onSearchSelect={(coords) => handleDirectionSelect("end", coords)}
            />
          </div>
        )}
      </MapContainer>

      {/* List of attractions displayed below the map */}
      <div className="attraction-list-container">
        <SearchBar onSearchSelect={handleSearchSelect} />
        <h1 className="text-2xl font-semibold">Point of Interests</h1>
        {loading && (
          <div className="isLoading">
            <l-ping size="45" speed="2" color="red"></l-ping>
          </div>
        )}
        <AttractionCardList
          attractions={attractions}
          handleCardClick={handleCardClick}
          userLocation={location}
        />
      </div>
    </div>
  );
}

export default MapView;
