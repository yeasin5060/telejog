import React, { useEffect } from "react";
import { Platform } from "react-native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { store } from "@/store";
import { useAppSelector } from "@/store/hooks";

// Bulletproof global outline reset for Web to eliminate default browser focus rings & outlines
if (Platform.OS === "web" && typeof document !== "undefined") {
  const styleId = "telejog-web-outline-reset";
  let style = document.getElementById(styleId) as HTMLStyleElement | null;
  if (!style) {
    style = document.createElement("style");
    style.id = styleId;
    document.head.appendChild(style);
  }
  style.textContent = `
    *, *::before, *::after {
      outline: none !important;
      outline-style: none !important;
      outline-width: 0px !important;
      outline-color: transparent !important;
      -webkit-tap-highlight-color: transparent !important;
    }
    input, textarea, select, button, a, div, span, [tabindex], [role="button"],
    input:focus, input:focus-visible, input:active,
    textarea:focus, textarea:focus-visible, textarea:active,
    button:focus, button:focus-visible, button:active,
    [tabindex]:focus, [tabindex]:focus-visible,
    *:focus, *:focus-visible, *:active,
    [data-focusable="true"]:focus, [data-focusable="true"]:focus-visible {
      outline: none !important;
      outline-style: none !important;
      outline-width: 0px !important;
      outline-color: transparent !important;
      box-shadow: none !important;
      -webkit-box-shadow: none !important;
    }
  `;
}

function AuthNavigationGuard() {
  const isSignedIn = useAppSelector((state) => state.auth.isSignedIn);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";

    if (!isSignedIn && !inAuthGroup) {
      router.replace("/(auth)");
    } else if (isSignedIn && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [isSignedIn, segments]);

  return null;
}

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS === "web" && typeof document !== "undefined") {
      const styleId = "telejog-web-outline-reset";
      let style = document.getElementById(styleId) as HTMLStyleElement | null;
      if (!style) {
        style = document.createElement("style");
        style.id = styleId;
        document.head.appendChild(style);
      }
      style.textContent = `
        *, *::before, *::after {
          outline: none !important;
          outline-style: none !important;
          outline-width: 0px !important;
          outline-color: transparent !important;
          -webkit-tap-highlight-color: transparent !important;
        }
        input, textarea, select, button, a, div, span, [tabindex], [role="button"],
        input:focus, input:focus-visible, input:active,
        textarea:focus, textarea:focus-visible, textarea:active,
        button:focus, button:focus-visible, button:active,
        [tabindex]:focus, [tabindex]:focus-visible,
        *:focus, *:focus-visible, *:active,
        [data-focusable="true"]:focus, [data-focusable="true"]:focus-visible {
          outline: none !important;
          outline-style: none !important;
          outline-width: 0px !important;
          outline-color: transparent !important;
          box-shadow: none !important;
          -webkit-box-shadow: none !important;
        }
      `;
      // Push to bottom of head so it takes top priority
      if (document.head.lastElementChild !== style) {
        document.head.appendChild(style);
      }
    }
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Provider store={store}>
          <AuthNavigationGuard />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="chat/[id]" options={{ animation: "slide_from_right" }} />
            <Stack.Screen name="devices" options={{ animation: "slide_from_right" }} />
          </Stack>
          <StatusBar style="light" />
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
