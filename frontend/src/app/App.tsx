import { RouterProvider } from "react-router";
import { ClerkProvider } from "@clerk/clerk-react";
import { router } from "./routes";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error("Missing Clerk Publishable Key");
}

export default function App() {
  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      signInFallbackRedirectUrl="https://pandctexfab.qzz.io/"
      signUpFallbackRedirectUrl="https://pandctexfab.qzz.io/"
      afterSignOutUrl="https://pandctexfab.qzz.io/"
    >
      <RouterProvider router={router} />
    </ClerkProvider>
  );
}