import React, { useState } from "react";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import EditIcon from "@mui/icons-material/Edit";
import moment from "moment";
import ExcalidrawMenu from "./ExcalidrawMenu.tsx";
import ExportModal from "./ExportModal.tsx";

interface Props {
  fileId: string;
  fileName: string;
  lastEdited: number;
  excalidrawAPI: any;
  fileData: any;
  onRename: (newName: string) => void;
}

const TopBar: React.FC<Props> = ({
  fileId,
  fileName,
  lastEdited,
  excalidrawAPI,
  fileData,
  onRename,
}) => {
  const [showExportModal, setShowExportModal] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(fileName);

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

        // Sanitize appState: Excalidraw expects collaborators to be a Map
        const sanitizedAppState = {
          ...data.appState,
          collaborators: new Map(),
          isLoading: false,
        };

        // Handle case where data might be just elements or a full export
        const elements = Array.isArray(data) ? data : data.elements || [];

        excalidrawAPI.updateScene({
          elements,
          appState: sanitizedAppState,
          files: data.files || {},
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
    const finalJson = JSON.stringify(exportData, null, 2);
    const blob = new Blob([finalJson], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.excalidraw`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportDS = () => {
    if (!excalidrawAPI) return;
    const elements = excalidrawAPI.getSceneElements();
    const appState = excalidrawAPI.getAppState();
    const files = excalidrawAPI.getFiles();

    const exportData = {
      _id: fileData?._id || "",
      version: 1,
      time: Date.now(),
      parent_file: fileId,
      blocks: [
        {
          type: "excalidraw",
          data: { elements, appState, files },
        },
      ],
      createdAt: fileData?.createdAt || Date.now(),
      updatedAt: fileData?.updatedAt || Date.now(),
      fileType: "excalidraw-plugin",
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.ds`;
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

  const submitRename = () => {
    if (tempName.trim() && tempName !== fileName) {
      onRename(tempName);
    }
    setIsEditingName(false);
  };

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0rem 0rem 0rem 1.5rem",
        backgroundColor: "white",
        borderBottom: "1px solid #e5e7eb",
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        zIndex: 10,
        height: "64px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {isEditingName ? (
          <input
            autoFocus
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            onBlur={submitRename}
            onKeyDown={(e) => e.key === "Enter" && submitRename()}
            style={{
              fontSize: "1.125rem",
              fontWeight: 600,
              color: "#111827",
              border: "1px solid #6965db",
              borderRadius: "4px",
              padding: "2px 8px",
              outline: "none",
            }}
          />
        ) : (
          <h1
            style={{
              fontSize: "1.125rem",
              fontWeight: 600,
              color: "#111827",
              margin: 0,
              cursor: "pointer",
            }}
            onClick={() => {
              setTempName(fileName);
              setIsEditingName(true);
            }}
          >
            {fileName}
          </h1>
        )}
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
          onClick={() => {
            setTempName(fileName);
            setIsEditingName(true);
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
          onExportDS={handleExportDS}
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
