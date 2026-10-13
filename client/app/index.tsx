import { Redirect } from "expo-router";
import { useAppSelector } from "@/store/hooks";

export default function Index() {
  const isSignedIn = useAppSelector((state) => state.auth.isSignedIn);
  return <Redirect href={isSignedIn ? "/(tabs)" : "/(auth)"} />;
}
