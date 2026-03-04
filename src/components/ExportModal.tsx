import React, { useState } from "react";
import { createPortal } from "react-dom";
import { exportToBlob } from "@excalidraw/excalidraw";

interface Props {
  excalidrawAPI: any;
  onClose: () => void;
}

const ExportModal = ({ excalidrawAPI, onClose }: Props) => {
  const [withBg, setWithBg] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [embedScene, setEmbedScene] = useState(false);

  const exportImage = async (type: "png" | "svg") => {
    const elements = excalidrawAPI.getSceneElements();
    const appState = excalidrawAPI.getAppState();
    const files = excalidrawAPI.getFiles();

    const blob = await exportToBlob({
      elements,
      appState: {
        ...appState,
        exportBackground: withBg,
        exportWithDarkMode: darkMode,
        exportEmbedScene: embedScene,
        viewBackgroundColor: withBg
          ? appState.viewBackgroundColor
          : "transparent",
        theme: darkMode ? "dark" : "light",
      },
      files,
      mimeType: type === "png" ? "image/png" : "image/svg+xml",
      exportPadding: 10,
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `exported-image.${type}`;
    a.click();
    URL.revokeObjectURL(url);
    onClose();
  };

  const copyToClipboard = async () => {
    const elements = excalidrawAPI.getSceneElements();
    const appState = excalidrawAPI.getAppState();
    const files = excalidrawAPI.getFiles();

    const blob = await exportToBlob({
      elements,
      appState: {
        ...appState,
        exportBackground: withBg,
        exportWithDarkMode: darkMode,
        exportEmbedScene: embedScene,
        viewBackgroundColor: withBg
          ? appState.viewBackgroundColor
          : "transparent",
        theme: darkMode ? "dark" : "light",
      },
      files,
      mimeType: "image/png",
    });

    try {
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
      onClose();
    } catch (err) {
      console.error("Failed to copy image to clipboard", err);
      alert("Failed to copy image to clipboard.");
    }
  };

  return createPortal(
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999999,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.6)",
        }}
        onClick={onClose}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1001,
          width: "100%",
          maxWidth: "400px",
          padding: "24px",
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          color: "#111827",
          fontFamily:
            'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        <h3
          style={{
            marginTop: 0,
            fontSize: "1.25rem",
            fontWeight: 600,
            marginBottom: "20px",
          }}
        >
          Export image
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <label style={{ fontSize: "0.95rem", fontWeight: 500 }}>
              Background
            </label>
            <div
              style={{
                width: "36px",
                height: "20px",
                backgroundColor: withBg ? "#6965db" : "#d1d5db",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                padding: "2px",
                transition: "all 0.2s",
              }}
              onClick={() => setWithBg(!withBg)}
            >
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  backgroundColor: "white",
                  borderRadius: "50%",
                  transform: withBg ? "translateX(16px)" : "translateX(0)",
                  transition: "transform 0.2s",
                }}
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <label style={{ fontSize: "0.95rem", fontWeight: 500 }}>
              Dark mode
            </label>
            <div
              style={{
                width: "36px",
                height: "20px",
                backgroundColor: darkMode ? "#6965db" : "#d1d5db",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                padding: "2px",
                transition: "all 0.2s",
              }}
              onClick={() => setDarkMode(!darkMode)}
            >
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  backgroundColor: "white",
                  borderRadius: "50%",
                  transform: darkMode ? "translateX(16px)" : "translateX(0)",
                  transition: "transform 0.2s",
                }}
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <label style={{ fontSize: "0.95rem", fontWeight: 500 }}>
              Embed scene
            </label>
            <div
              style={{
                width: "36px",
                height: "20px",
                backgroundColor: embedScene ? "#6965db" : "#d1d5db",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                padding: "2px",
                transition: "all 0.2s",
              }}
              onClick={() => setEmbedScene(!embedScene)}
            >
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  backgroundColor: "white",
                  borderRadius: "50%",
                  transform: embedScene ? "translateX(16px)" : "translateX(0)",
                  transition: "transform 0.2s",
                }}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
            <button
              style={{
                flex: 1,
                padding: "10px",
                backgroundColor: "#e3e2fe",
                color: "#6965db",
                border: "none",
                borderRadius: "8px",
                fontWeight: 600,
                cursor: "pointer",
              }}
              onClick={() => exportImage("png")}
            >
              PNG
            </button>
            <button
              style={{
                flex: 1,
                padding: "10px",
                backgroundColor: "#e3e2fe",
                color: "#6965db",
                border: "none",
                borderRadius: "8px",
                fontWeight: 600,
                cursor: "pointer",
              }}
              onClick={() => exportImage("svg")}
            >
              SVG
            </button>
            <button
              style={{
                flex: 1,
                padding: "10px",
                backgroundColor: "#f3f4f6",
                color: "#374151",
                border: "none",
                borderRadius: "8px",
                fontWeight: 600,
                cursor: "pointer",
              }}
              onClick={copyToClipboard}
            >
              Copy
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default ExportModal;
