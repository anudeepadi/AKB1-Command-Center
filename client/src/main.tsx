import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import { queryClient } from "./lib/queryClient";
import "./index.css";

// Ensure hash routing works in sandboxed iframes
try {
  if (!window.location.hash || window.location.hash === "") {
    window.location.hash = "#/";
  }
} catch {
  // silently ignore if sandbox blocks hash assignment
}

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
