import { useLoadWebViewMap } from "@/hooks/useLoadWebViewMap";
import { ActivityIndicator, Text, View } from "react-native";
import { LeafletView, LeafletViewProps } from "react-native-leaflet-view";

export function MapView({
  mapMarkers,
  userPosition,
}: LeafletViewProps & { userPosition: any }) {
  const { webViewContent } = useLoadWebViewMap();

  if (!webViewContent) {
    return (
      <View>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Cargando mapa...</Text>
      </View>
    );
  }

  return (
    <LeafletView
      source={{ html: webViewContent }}
      mapCenterPosition={userPosition || undefined}
      //   androidHardwareAccelerationDisabled={false}
      //   zoom={14}
      mapMarkers={mapMarkers}
      //   mapShapes={enableRoutesShapes ? mapShapes : undefined}
    />
  );
}
