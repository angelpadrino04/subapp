import { MapView } from "@/components/MapView";
import { useBusesPosition } from "@/hooks/useBusesPosition";
import { useUserCurrentPosition } from "@/hooks/useUserCurrentPosition";
import React from "react";
import { StyleSheet, View } from "react-native";
import { MapMarker } from "react-native-leaflet-view";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  const { buses } = useBusesPosition();
  const { position } = useUserCurrentPosition();

  const mapMarkersBuses: MapMarker[] | undefined = buses?.map((bus) => ({
    position: bus.coordinate,
    icon: "🚍",
    size: [15, 15],
    id: bus.id,
    title: `Bus ${bus.id}`,
  }));

  const mapMarkers: MapMarker[] | undefined = buses
    ? [
        ...mapMarkersBuses,
        {
          position: position,
          icon: "🥸",
          size: [15, 15],
          id: "user",
          title: "Yo",
        },
      ]
    : undefined;

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
          //TODO: change to array
          mapMarkers={mapMarkers}
          userPosition={position}
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
