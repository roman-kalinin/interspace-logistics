import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { CommandCenter } from "./pages/CommandCenter";
import { Manifests } from "./pages/Manifests";
import { Fleet } from "./pages/Fleet";
import { Pilots } from "./pages/Pilots";
import { Analytics } from "./pages/Analytics";

export default function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<CommandCenter />} />
          <Route path="/manifests" element={<Manifests />} />
          <Route path="/fleet" element={<Fleet />} />
          <Route path="/pilots" element={<Pilots />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}
