import React, { useState, useRef, useEffect } from "react";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import SaveIcon from "@mui/icons-material/Save";
import ImageIcon from "@mui/icons-material/Image";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import LockIcon from "@mui/icons-material/LockOutlined"; // Used as substitute for the missing custom LockIcon
import "./excalidraw-menu.css";

interface Props {
  excalidrawAPI: any;
  onExportClick: () => void;
  onLoad: () => void;
  onSaveJSON: () => void;
  onClear: () => void;
  onBackgroundChange: (color: string) => void;
}

const COLORS = ["#ffffff", "#f8f9fa", "#f5faff", "#fffce8", "#fdf8f6"];

const ExcalidrawMenu: React.FC<Props> = ({
  onExportClick,
  onLoad,
  onSaveJSON,
  onClear,
  onBackgroundChange,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div style={{ position: "relative" }} ref={ref} className="dropdown-menu">
      <button
        style={{
          display: "flex",
          alignItems: "center",
          padding: "8px 16px",
          backgroundColor: "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "0.875rem",
          color: "#374151",
          cursor: "pointer",
          fontWeight: 500,
        }}
        onClick={() => setOpen(!open)}
      >
        <LockIcon
          style={{ fontSize: "1.1rem", marginRight: "8px", color: "#6b7280" }}
        />
        Options
        <ArrowDropDownIcon style={{ marginLeft: "4px", color: "#6b7280" }} />
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            marginTop: "8px",
            width: "220px",
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "var(--modal-shadow)",
            border: "1px solid #e5e7eb",
            zIndex: 1000,
            padding: "4px",
          }}
        >
          <div className="menu-section">
            <div className="menu-label">Canvas Options</div>
            <button
              className="dropdown-item"
              onClick={() => {
                onLoad();
                setOpen(false);
              }}
            >
              <FolderOpenIcon
                style={{ fontSize: "1.1rem", color: "#3b82f6" }}
              />
              Open
            </button>
            <button
              className="dropdown-item"
              onClick={() => {
                onSaveJSON();
                setOpen(false);
              }}
            >
              <SaveIcon style={{ fontSize: "1.1rem", color: "#10b981" }} />
              Save to...
            </button>
          </div>

          <div
            style={{
              height: "1px",
              backgroundColor: "#f3f4f6",
              margin: "4px 8px",
            }}
          />

          <div className="menu-section">
            <div className="menu-label">Export</div>
            <button
              className="dropdown-item"
              onClick={() => {
                onExportClick();
                setOpen(false);
              }}
            >
              <ImageIcon style={{ fontSize: "1.1rem", color: "#8b5cf6" }} />
              Export Image
            </button>
          </div>

          <div
            style={{
              height: "1px",
              backgroundColor: "#f3f4f6",
              margin: "4px 8px",
            }}
          />

          <div className="menu-section">
            <div className="menu-label">Background</div>
            <div className="color-row">
              {COLORS.map((c) => (
                <button
                  key={c}
                  className="color-btn"
                  style={{ background: c }}
                  onClick={() => onBackgroundChange(c)}
                  title={`Background: ${c}`}
                />
              ))}
            </div>
          </div>

          <div
            style={{
              height: "1px",
              backgroundColor: "#f3f4f6",
              margin: "4px 8px",
            }}
          />

          <div className="menu-section">
            <button
              className="dropdown-item"
              style={{ color: "#dc2626" }}
              onClick={() => {
                onClear();
                setOpen(false);
              }}
            >
              <DeleteIcon style={{ fontSize: "1.1rem" }} />
              Clear Canvas
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExcalidrawMenu;
