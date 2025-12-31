import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
<<<<<<< HEAD
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router";
=======
import { BrowserRouter } from "react-router";
import * as Sentry from "@sentry/react";
import App from "./App.tsx";
import "./index.css";

>>>>>>> 46ee7d0fde035dd37b3349bc6eddd3de5911bde6
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

const queryClient = new QueryClient();

<<<<<<< HEAD
=======
Sentry.init({
  dsn: "https://88c8585b2fd07d0ac4e64bb1b68eaf58@o4510152714485760.ingest.de.sentry.io/4510630520815696",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});

>>>>>>> 46ee7d0fde035dd37b3349bc6eddd3de5911bde6
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </ClerkProvider>
    </BrowserRouter>
  </StrictMode>
);
