import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { manifests, vessels, pilots, portById } from "../data/mock";
import "./CommandPalette.css";

type Item = { id: string; label: string; sub: string; group: string; to: string };

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const nav = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const items: Item[] = useMemo(() => {
    const pages: Item[] = [
      { id: "p-home", label: "Command Center", sub: "System map & fleet overview", group: "Navigate", to: "/" },
      { id: "p-man", label: "Manifests", sub: "All shipments", group: "Navigate", to: "/manifests" },
      { id: "p-fleet", label: "Fleet", sub: "Vessel roster", group: "Navigate", to: "/fleet" },
      { id: "p-pilots", label: "Pilots", sub: "Crew roster", group: "Navigate", to: "/pilots" },
      { id: "p-an", label: "Analytics", sub: "Network performance", group: "Navigate", to: "/analytics" },
    ];
    const m = manifests.map((x): Item => ({
      id: x.id, label: x.id, sub: `${x.cargo} · ${portById(x.origin).code}→${portById(x.destination).code}`, group: "Manifests", to: "/manifests",
    }));
    const v = vessels.map((x): Item => ({
      id: x.id, label: x.name, sub: `${x.class} · ${x.status}`, group: "Vessels", to: "/fleet",
    }));
    const p = pilots.map((x): Item => ({
      id: x.id, label: x.name, sub: `${x.callsign} · ${x.status}`, group: "Pilots", to: "/pilots",
    }));
    return [...pages, ...m, ...v, ...p];
  }, []);

  const filtered = useMemo(() => {
    if (!q.trim()) return items.filter((i) => i.group === "Navigate");
    const s = q.toLowerCase();
    return items.filter((i) => (i.label + i.sub).toLowerCase().includes(s)).slice(0, 8);
  }, [q, items]);

  useEffect(() => { setSel(0); }, [q]);
  useEffect(() => {
    if (open) { setQ(""); setTimeout(() => inputRef.current?.focus(), 20); }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(s + 1, filtered.length - 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
      if (e.key === "Enter" && filtered[sel]) { nav(filtered[sel].to); onClose(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, filtered, sel, nav, onClose]);

  if (!open) return null;

  const groups = [...new Set(filtered.map((f) => f.group))];

  return (
    <div className="cmdk-overlay" onClick={onClose}>
      <div className="cmdk" onClick={(e) => e.stopPropagation()}>
        <div className="cmdk-input-row">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></svg>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search manifests, vessels, pilots…"
          />
          <kbd>ESC</kbd>
        </div>
        <div className="cmdk-list">
          {groups.map((g) => (
            <div key={g}>
              <div className="cmdk-group">{g}</div>
              {filtered.filter((f) => f.group === g).map((f) => {
                const idx = filtered.indexOf(f);
                return (
                  <button
                    key={f.id}
                    className={`cmdk-item ${idx === sel ? "sel" : ""}`}
                    onMouseEnter={() => setSel(idx)}
                    onClick={() => { nav(f.to); onClose(); }}
                  >
                    <div className="cmdk-item-main">{f.label}</div>
                    <div className="cmdk-item-sub">{f.sub}</div>
                  </button>
                );
              })}
            </div>
          ))}
          {filtered.length === 0 && <div className="cmdk-empty">No results for “{q}”</div>}
        </div>
      </div>
    </div>
  );
}
