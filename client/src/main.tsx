import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { setupErrorSuppression } from "./utils/error-suppression";

// Setup error suppression before rendering
setupErrorSuppression();

createRoot(document.getElementById("root")!).render(<App />);
