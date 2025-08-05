import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

if (window.Kakao && !window.Kakao.isInitialized()) {
  window.Kakao.init(import.meta.env.VITE_KAKAO_JS_KEY);
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);