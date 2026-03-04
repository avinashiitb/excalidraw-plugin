import React, { useState } from 'react';
import './App.css';
import "@excalidraw/excalidraw/index.css";
import { Excalidraw } from "@excalidraw/excalidraw";
import TopBar from './components/TopBar.tsx';

function App() {
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  const [lastEdited] = useState(Date.now());

  return (
    <div className="App" style={{ height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <TopBar
        fileName="My Design"
        lastEdited={lastEdited}
        excalidrawAPI={excalidrawAPI}
      />

      <main style={{ flex: 1, height: "100%", width: "100%", position: "relative" }}>
        <Excalidraw
          excalidrawAPI={(api) => setExcalidrawAPI(api)}
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
      </main>
    </div>
  );
}

export default App;
