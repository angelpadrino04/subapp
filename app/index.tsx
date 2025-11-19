import { MapView } from "@/components/MapView";
import { useBusesPosition } from "@/hooks/useBusesPosition";
import { useUserCurrentPosition } from "@/hooks/useUserCurrentPosition";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import {
  AnimationType,
  MapMarker,
  OwnPositionMarker,
} from "react-native-leaflet-view";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  const { buses } = useBusesPosition();
  const { position, errorMsg } = useUserCurrentPosition();

  if (errorMsg) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={{ color: "red" }}>Error de ubicación: {errorMsg}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!position) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Obteniendo ubicación actual</Text>
        </View>
      </SafeAreaView>
    );
  }

  const mapMarkersBuses: MapMarker[] | undefined = buses?.map((bus) => ({
    position: bus.coordinate,
    icon: "https://cdn-icons-png.flaticon.com/128/741/741411.png",
    size: [20, 20],
    id: bus.id,
    iconAnchor: [10, 10],
    title: `Bus ${bus.id}`,
  }));

  const mapMarkers: MapMarker[] | undefined = [...mapMarkersBuses];
  const ownPositionMarker: OwnPositionMarker = {
    position: position,
    icon: "👤",
    size: [15, 15],
    id: "user",
    title: "Yo",
    animation: {
      type: AnimationType.PULSE,
    },
  };

  // const mapShapes = [
  //   {
  //     shapeType: MapShapeType.POLYLINE,
  //     color: "#000",
  //     id: "1",
  //     positions: routeCoordinates,
  //   },
  // ];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <MapView
          mapMarkers={mapMarkers}
          ownPositionMarker={ownPositionMarker}
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
