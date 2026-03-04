import React, { useState } from "react";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import EditIcon from "@mui/icons-material/Edit";
import moment from "moment";
import ExcalidrawMenu from "./ExcalidrawMenu.tsx";
import ExportModal from "./ExportModal.tsx";

interface Props {
  fileName: string;
  lastEdited: number;
  excalidrawAPI: any;
}

const TopBar: React.FC<Props> = ({ fileName, lastEdited, excalidrawAPI }) => {
  const [showExportModal, setShowExportModal] = useState(false);

  const handleLoad = () => {
    if (!excalidrawAPI) return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".excalidraw,.json";
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        excalidrawAPI.updateScene({
          elements: data.elements || data,
          appState: data.appState,
          files: data.files,
        });
      } catch (err) {
        console.error("Failed to load file", err);
        alert("Error loading file.");
      }
    };
    input.click();
  };

  const handleSaveJSON = () => {
    if (!excalidrawAPI) return;
    const elements = excalidrawAPI.getSceneElements();
    const appState = excalidrawAPI.getAppState();
    const files = excalidrawAPI.getFiles();
    const exportData = { elements, appState, files };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.excalidraw`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    if (!excalidrawAPI) return;
    excalidrawAPI.updateScene({ elements: [] });
  };

  const handleBackground = (color: string) => {
    if (!excalidrawAPI) return;
    excalidrawAPI.updateScene({
      appState: { ...excalidrawAPI.getAppState(), viewBackgroundColor: color },
    });
  };

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0.75rem 1.5rem",
        backgroundColor: "white",
        borderBottom: "1px solid #e5e7eb",
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        zIndex: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <h1
          style={{
            fontSize: "1.125rem",
            fontWeight: 600,
            color: "#111827",
            margin: 0,
          }}
        >
          {fileName}
        </h1>
        <button
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#9ca3af",
            padding: "4px",
            display: "flex",
            alignItems: "center",
            borderRadius: "4px",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#f3f4f6")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
        >
          <EditIcon style={{ fontSize: "1rem" }} />
        </button>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            fontSize: "0.875rem",
            color: "#6b7280",
            marginLeft: "8px",
          }}
        >
          <AccessTimeFilledIcon style={{ fontSize: "0.9rem" }} />
          <span>Last edited {moment(lastEdited).fromNow()}</span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <ExcalidrawMenu
          excalidrawAPI={excalidrawAPI}
          onExportClick={() => setShowExportModal(true)}
          onLoad={handleLoad}
          onSaveJSON={handleSaveJSON}
          onClear={handleClear}
          onBackgroundChange={handleBackground}
        />
      </div>

      {showExportModal && (
        <ExportModal
          excalidrawAPI={excalidrawAPI}
          onClose={() => setShowExportModal(false)}
        />
      )}
    </header>
  );
};

export default TopBar;
