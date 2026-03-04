import React, { useState, useRef, useEffect } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import SaveIcon from "@mui/icons-material/Save";
import ImageIcon from "@mui/icons-material/Image";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

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
  excalidrawAPI,
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

  const menuButtonStyle = {
    display: "flex",
    alignItems: "center",
    padding: "8px 16px",
    backgroundColor: "white",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "0.875rem",
    color: "#374151",
    cursor: "pointer",
    fontWeight: 500,
    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    transition: "all 0.2s",
  };

  const itemStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    width: "100%",
    padding: "8px 12px",
    border: "none",
    backgroundColor: "transparent",
    textAlign: "left" as const,
    cursor: "pointer",
    fontSize: "0.875rem",
    color: "#4b5563",
    borderRadius: "6px",
  };

  return (
    <div style={{ position: "relative" }} ref={ref}>
      <button style={menuButtonStyle} onClick={() => setOpen(!open)}>
        Options
        <ArrowDropDownIcon style={{ marginLeft: "4px" }} />
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            marginTop: "8px",
            width: "200px",
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            border: "1px solid #e5e7eb",
            zIndex: 1000,
            padding: "4px",
          }}
        >
          <div
            style={{
              padding: "8px 12px",
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "#9ca3af",
              textTransform: "uppercase",
            }}
          >
            Canvas Options
          </div>
          <button
            style={itemStyle}
            onClick={() => {
              onLoad();
              setOpen(false);
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#f3f4f6")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            <FolderOpenIcon style={{ fontSize: "1.2rem", color: "#3b82f6" }} />
            Open
          </button>
          <button
            style={itemStyle}
            onClick={() => {
              onSaveJSON();
              setOpen(false);
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#f3f4f6")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            <SaveIcon style={{ fontSize: "1.2rem", color: "#10b981" }} />
            Save to...
          </button>

          <div
            style={{
              height: "1px",
              backgroundColor: "#e5e7eb",
              margin: "4px 0",
            }}
          />

          <div
            style={{
              padding: "8px 12px",
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "#9ca3af",
              textTransform: "uppercase",
            }}
          >
            Export
          </div>
          <button
            style={itemStyle}
            onClick={() => {
              onExportClick();
              setOpen(false);
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#f3f4f6")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            <ImageIcon style={{ fontSize: "1.2rem", color: "#8b5cf6" }} />
            Export Image
          </button>

          <div
            style={{
              height: "1px",
              backgroundColor: "#e5e7eb",
              margin: "4px 0",
            }}
          />

          <button
            style={{ ...itemStyle, color: "#dc2626" }}
            onClick={() => {
              onClear();
              setOpen(false);
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#fef2f2")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            <DeleteIcon style={{ fontSize: "1.2rem" }} />
            Clear Canvas
          </button>

          <div
            style={{
              height: "1px",
              backgroundColor: "#e5e7eb",
              margin: "4px 0",
            }}
          />

          <div
            style={{
              padding: "8px 12px",
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "#9ca3af",
              textTransform: "uppercase",
            }}
          >
            Background
          </div>
          <div style={{ display: "flex", gap: "8px", padding: "8px 12px" }}>
            {COLORS.map((c) => (
              <button
                key={c}
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  border: "1px solid #d1d5db",
                  background: c,
                  cursor: "pointer",
                }}
                onClick={() => onBackgroundChange(c)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExcalidrawMenu;
