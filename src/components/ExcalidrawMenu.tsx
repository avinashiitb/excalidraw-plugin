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
  onExportDS: () => void;
  onClear: () => void;
  onBackgroundChange: (color: string) => void;
}

const COLORS = ["#ffffff", "#f8f9fa", "#f5faff", "#fffce8", "#fdf8f6"];

const ExcalidrawMenu: React.FC<Props> = ({
  onExportClick,
  onLoad,
  onSaveJSON,
  onExportDS,
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
        <div className="absolute right-4 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
          <div className="py-1">
            <div className="px-3 py-2 text-xs font-medium text-gray-500">
              Canvas Options
            </div>
            <button
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
              style={{
                display: "flex",
                width: "100%",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                borderRadius: "0px",
              }}
              onClick={() => {
                onLoad();
                setOpen(false);
              }}
            >
              <i className="fas fa-folder-open text-blue-500"></i>
              <span>Open</span>
            </button>
            <button
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
              style={{
                display: "flex",
                width: "100%",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                borderRadius: "0px",
              }}
              onClick={() => {
                onSaveJSON();
                setOpen(false);
              }}
            >
              <i className="fas fa-save text-green-600"></i>
              <span>Save to...</span>
            </button>

            <div
              style={{
                borderTop: "1px solid rgb(229, 231, 235)",
                margin: "4px auto",
                width: "85%",
              }}
            ></div>

            <div className="px-3 py-2 text-xs font-medium text-gray-500">
              Export Options
            </div>
            <button
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
              style={{
                display: "flex",
                width: "100%",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                borderRadius: "0px",
              }}
              onClick={() => {
                onExportDS();
                setOpen(false);
              }}
            >
              <i className="fas fa-file-alt text-blue-600"></i>
              <span>Devscribe(.ds)</span>
            </button>
            <button
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
              style={{
                display: "flex",
                width: "100%",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                borderRadius: "0px",
              }}
              onClick={() => {
                onExportClick();
                setOpen(false);
              }}
            >
              <i className="fas fa-image text-purple-600"></i>
              <span>Export Image</span>
            </button>

            <div
              style={{
                borderTop: "1px solid rgb(229, 231, 235)",
                margin: "4px auto",
                width: "85%",
              }}
            ></div>

            <button
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 flex items-center space-x-2"
              style={{
                display: "flex",
                width: "100%",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                borderRadius: "0px",
                color: "rgb(220, 38, 38)",
              }}
              onClick={() => {
                onClear();
                setOpen(false);
              }}
            >
              <i className="fas fa-trash-alt"></i>
              <span>Clear Canvas</span>
            </button>

            <div
              style={{
                borderTop: "1px solid rgb(229, 231, 235)",
                margin: "4px auto",
                width: "85%",
              }}
            ></div>

            <div className="px-3 py-2 text-xs font-medium text-gray-500">
              Canvas Background
            </div>
            <div className="px-4 py-2 flex gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  title={`Background: ${c}`}
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    border: "1px solid rgb(209, 213, 219)",
                    background: c,
                    cursor: "pointer",
                  }}
                  onClick={() => onBackgroundChange(c)}
                ></button>
              ))}
            </div>

            <div
              style={{
                borderTop: "1px solid rgb(229, 231, 235)",
                margin: "4px auto",
                width: "85%",
              }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExcalidrawMenu;
