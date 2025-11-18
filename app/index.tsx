import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system/legacy";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";
import {
  LeafletView,
  MapMarker,
  MapShapeType,
} from "react-native-leaflet-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { io } from "socket.io-client";

const initialPosition = { lat: 8.271148, lng: -62.759505 };
const destinationPosition = { lat: 8.293182, lng: -62.7368 };

const OSRM_URL = "http://192.168.10.135:5001";

async function fetchRoute(positionA, positionB, setRouteCoordinates) {
  const coordsQuery = `${positionA.lng},${positionA.lat};${positionB.lng},${positionB.lat}`;

  const url = `${OSRM_URL}/route/v1/driving/${coordsQuery}?geometries=geojson&overview=full`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`OSRM error: ${res.status}`);
    const data = await res.json();

    if (data.routes && data.routes.length > 0) {
      const routeGeometry = data.routes[0].geometry.coordinates;

      const leafletCoords = routeGeometry.map(([lon, lat]) => ({
        lat: lat,
        lng: lon,
      }));

      setRouteCoordinates(leafletCoords);
    } else {
      console.warn("OSRM no encontró rutas");
      setRouteCoordinates([]);
    }
  } catch (error) {
    console.error("Error OSRM: ", error);
    setRouteCoordinates([]);
  }
}

const socket = io("ws://192.168.10.135:3000", {});

export default function App() {
  const [busPosition, setBusPosition] = useState(initialPosition);
  const [userPosition, setUserPosition] = useState(initialPosition);
  const [errorMsg, setErrorMsg] = useState("");
  const [webViewContent, setWebViewContent] = useState<string | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [mapCenter, setMapCenter] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadHtml = async () => {
      try {
        const path = require("../assets/leaflet.html");
        const asset = Asset.fromModule(path);
        await asset.downloadAsync();

        if (!asset.localUri) throw new Error("Not found leaflet.html");
        const htmlContent = await FileSystem.readAsStringAsync(asset.localUri);

        if (!htmlContent) throw new Error("Empty leaflet.html");
        if (isMounted) {
          setWebViewContent(htmlContent);
        }
      } catch (error) {
        Alert.alert("Error loading HTML leaflet.html");
        console.error("Error loading HTML:", error);
      }
    };

    loadHtml();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    socket.on("message", (message) => {
      const result = JSON.parse(message);
      setBusPosition({
        lat: result.latitude,
        lng: result.longitude,
      });
    });

    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserPosition({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
    }

    getCurrentLocation();

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (busPosition.lat && destinationPosition.lat) {
      fetchRoute(busPosition, destinationPosition, setRouteCoordinates);
    }
  }, [busPosition, destinationPosition]);

  if (!webViewContent) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Cargando mapa...</Text>
      </View>
    );
  }

  const mapMarkers: MapMarker[] = [
    {
      position: busPosition,
      icon: "🚍",
      size: [15, 15],
      id: "bus",
      title: "Bus",
    },
    {
      position: userPosition,
      icon: "🥸",
      size: [15, 15],
      id: "user",
      title: "Yo",
    },
  ];

  const mapShapes = [
    {
      shapeType: MapShapeType.POLYLINE,
      color: "#000",
      id: "1",
      positions: routeCoordinates,
    },
  ];
  const enableRoutesShapes = false;
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <LeafletView
          source={{ html: webViewContent }}
          mapCenterPosition={userPosition}
          androidHardwareAccelerationDisabled={false}
          zoom={14}
          mapMarkers={mapMarkers}
          mapShapes={enableRoutesShapes ? mapShapes : undefined}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    padding: 10,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
});
