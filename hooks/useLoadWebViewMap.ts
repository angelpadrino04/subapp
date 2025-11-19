import { Asset } from "expo-asset";
import { File } from "expo-file-system";
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

        const file = new File(asset.localUri!);
        const htmlContent = await file.text();

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
