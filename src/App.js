import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import "@excalidraw/excalidraw/index.css";
import { Excalidraw } from "@excalidraw/excalidraw";
import TopBar from './components/TopBar.tsx';
import { useLocation } from 'react-router-dom';

function App() {
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  const [lastEdited, setLastEdited] = useState(Date.now());
  const [fileName, setFileName] = useState("Untitled");
  const [content, setContent] = useState(null);
  const [isContentLoading, setIsContentLoading] = useState(true);


  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const fileId = queryParams.get("fileId");
  const isSaving = useRef(false);
  // alert(id);

  useEffect(() => {
    if (!fileId) return;
    const getFileDetails = async () => {
      try {
        const data = await window.pluginAPI.getFileDetailsById(fileId);
        console.log("Loaded plugin data:", data);
        if (data) {
          setFileName(data.title || "Untitled");
          setLastEdited(data.lastEdited || Date.now());
        }
      } catch (error) {
        console.error("Error fetching file details:", error);
      }
    };

    const getFileContent = async () => {
      try {
        setIsContentLoading(true);
        const data = await window.pluginAPI.getDocumentsByParentFile(fileId);
        console.log("Loaded plugin content data:", data);
        if (data && data.length > 0) {
          setContent(data[0]);
        } else {
          setContent(null);
        }
      } catch (error) {
        console.error("Error fetching file content:", error);
      } finally {
        setIsContentLoading(false);
      }
    };

    getFileDetails();
    getFileContent();
  }, [fileId]);

  const restoreAppState = (appState = {}) => {
    return {
      ...appState,
      collaborators: new Map(), // ✅ FIX crash
      selectedElementIds: appState?.selectedElementIds || {},
      isLoading: false,
    };
  };

  // -------------------- INITIAL DATA --------------------

  const initialDataRaw = content?.blocks?.[0]?.data || null;

  const initialData = {
    elements: initialDataRaw?.elements || [],
    appState: restoreAppState(initialDataRaw?.appState || {}), // ✅ SAFE RESTORE
    files: initialDataRaw?.files || {},
  };

  // -------------------- SAFE HELPERS --------------------

  const sanitizeAppState = (appState) => {
    if (!appState) return {};

    return {
      ...appState,
      collaborators: undefined, // ❌ remove Map
      selectedElementIds: appState.selectedElementIds || {},
      editingGroupId: null,
      editingLinearElement: null,
    };
  };

  // -------------------- AUTO SAVE --------------------

  useEffect(() => {
    if (!fileId || !excalidrawAPI) return;

    const interval = setInterval(async () => {
      if (isSaving.current) return;

      const elements = excalidrawAPI.getSceneElements();
      const appState = excalidrawAPI.getAppState();
      const files = excalidrawAPI.getFiles();

      if (!elements || elements.length === 0) return;

      await saveExcalidrawToDatabase({
        elements,
        appState: sanitizeAppState(appState), // ✅ SAFE SAVE
        files,
      })
    }, 5000);

    return () => clearInterval(interval);
  }, [fileId, excalidrawAPI]);

  // -------------------- SAVE --------------------

  const saveExcalidrawToDatabase = async (sceneData) => {
    if (isSaving.current) return;
    isSaving.current = true;

    try {
      const updatedContents = {
        version: "2.28.2",
        time: Date.now(),
        blocks: [{ type: "excalidraw", data: sceneData }],
        parent_file: fileId,
        _id: content?._id,
      };

      await window.pluginAPI.updateDocument(fileId, [updatedContents]);
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      isSaving.current = false;
    }
  };

  return (
    <div className="App" style={{ height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden", backgroundColor: "#f9fafb" }}>
      <TopBar
        fileId={fileId}
        fileName={fileName}
        lastEdited={lastEdited}
        excalidrawAPI={excalidrawAPI}
        fileData={content}
        onRename={async (newName) => {
          try {
            await window.pluginAPI.updateFileName(fileId, newName);
            setFileName(newName);
          } catch (error) {
            console.error("Rename error:", error);
          }
        }}
      />

      <main style={{ flex: 1, height: "100%", width: "100%", position: "relative", }}>
        <div style={{ height: "100%", width: "100%", overflow: "hidden" }}>
          {!isContentLoading ? (
            <Excalidraw
              excalidrawAPI={(api) => setExcalidrawAPI(api)}
              initialData={initialData}
              UIOptions={{
                canvasActions: {
                  loadScene: false,
                  saveToActiveFile: false,
                  export: false,
                  saveAsImage: false,
                  clearCanvas: false,
                  changeViewBackgroundColor: false,
                  toggleTheme: false,
                },
              }}
            />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              Loading canvas...
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
