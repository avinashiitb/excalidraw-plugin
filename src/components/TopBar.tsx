import React, { useState } from "react";
import moment from "moment";
import ExcalidrawMenu from "./ExcalidrawMenu.tsx";
import ExportModal from "./ExportModal.tsx";

interface BreadcrumbSegment {
  label: string;
  isFile?: boolean;
}

interface Props {
  fileId: string;
  fileName: string;
  lastEdited: number;
  excalidrawAPI: any;
  fileData: any;
  onRename: (newName: string) => void;
  breadcrumbs?: BreadcrumbSegment[];
}

const TopBar: React.FC<Props> = ({
  fileId,
  fileName,
  lastEdited,
  excalidrawAPI,
  fileData,
  onRename,
  breadcrumbs = [],
}) => {
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
        const sanitizedAppState = {
          ...data.appState,
          collaborators: new Map(),
          isLoading: false,
        };
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
    const blob = new Blob([finalJson], { type: "application/json" });
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
      blocks: [{ type: "excalidraw", data: { elements, appState, files } }],
      createdAt: fileData?.createdAt || Date.now(),
      updatedAt: fileData?.updatedAt || Date.now(),
      fileType: "excalidraw-plugin",
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
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

  // Build display segments
  const displaySegments: BreadcrumbSegment[] = breadcrumbs.length > 0
    ? breadcrumbs
    : [{ label: fileName || "Untitled", isFile: true }];

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 16px",
        backgroundColor: "var(--bg-primary, #ffffff)",
        borderBottom: "1px solid var(--divider-light, #e5e7eb)",
        zIndex: 10,
        height: "40px",
        flexShrink: 0,
        userSelect: "none",
      }}
    >
      {/* LEFT: Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", minWidth: 0 }}>
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: 0,
            fontSize: 12,
            color: "var(--text-secondaryLight, #9ca3af)",
            overflow: "visible",
            flexWrap: "nowrap",
          }}
          aria-label="file path"
        >
          <i className="fa-solid fa-folder" style={{ marginRight: 6, fontSize: 11, opacity: 0.7, color: "var(--text-secondaryLight, #9ca3af)" }}></i>
          {displaySegments.map((seg, idx) => (
            <React.Fragment key={idx}>
              {!seg.isFile && (
                <>
                  <span
                    style={{
                      whiteSpace: "nowrap",
                      display: "inline-flex",
                      alignItems: "center",
                      fontSize: 12,
                      fontWeight: 500,
                      color: "var(--text-secondaryLight, #9ca3af)",
                      cursor: "default",
                    }}
                    title={seg.label}
                  >
                    {seg.label}
                  </span>
                  <span style={{ color: "var(--text-secondaryLight, #9ca3af)", opacity: 0.5, margin: "0 4px", fontSize: 13, userSelect: "none" }}>›</span>
                </>
              )}
              {seg.isFile && (
                <span
                  style={{
                    whiteSpace: "nowrap",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--text-primary, #111827)",
                    cursor: "default",
                  }}
                  title={seg.label}
                >
                  {seg.label}
                </span>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Last edited timestamp */}
        <span
          style={{
            marginLeft: 16,
            fontSize: 11,
            color: "var(--text-secondaryLight, #9ca3af)",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          Last edited {moment(lastEdited).fromNow()}
        </span>
      </div>

      {/* RIGHT: Menu */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
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

