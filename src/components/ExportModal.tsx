import React, { useState } from "react";
import { createPortal } from "react-dom";
import { exportToBlob } from "@excalidraw/excalidraw";
import "./excalidraw-menu.css";

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

  return (
    <>
      {createPortal(
        <div className="modal-overlay">
          <div className="modal dropdown-menu">
            <h3>Export image</h3>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <div className="setting">
                <label>Background</label>
                <div
                  className={`Switch ${withBg ? "toggled" : ""}`}
                  onClick={() => setWithBg(!withBg)}
                >
                  <div className="thumb" />
                </div>
              </div>

              <div className="setting">
                <label>Dark mode</label>
                <div
                  className={`Switch ${darkMode ? "toggled" : ""}`}
                  onClick={() => setDarkMode(!darkMode)}
                >
                  <div className="thumb" />
                </div>
              </div>

              <div className="setting">
                <label>Embed scene</label>
                <div
                  className={`Switch ${embedScene ? "toggled" : ""}`}
                  onClick={() => setEmbedScene(!embedScene)}
                >
                  <div className="thumb" />
                </div>
              </div>

              <div className="modal-actions">
                <button
                  className="btn-primary"
                  onClick={() => exportImage("png")}
                >
                  PNG
                </button>
                <button
                  className="btn-primary"
                  onClick={() => exportImage("svg")}
                >
                  SVG
                </button>
                <button className="btn-secondary" onClick={copyToClipboard}>
                  Copy to Clipboard
                </button>
              </div>
              <button
                className="btn-secondary"
                style={{ marginTop: "8px" }}
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
};

export default ExportModal;
