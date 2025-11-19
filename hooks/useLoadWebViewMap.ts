import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system/legacy";
import { useEffect, useState } from "react";

export function useLoadWebViewMap() {
  const [webViewContent, setWebViewContent] = useState<string | null>(null);

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
        console.error("Error loading HTML:", error);
      }
    };
    loadHtml();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    webViewContent,
  };
}
