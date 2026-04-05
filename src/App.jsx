import "./App.css";
import LandingPage from "./LandingPage";
import InvoiceGenerator from "./InvoiceGenerator";
import History from "./History";
import { ThemeProvider } from "./components/theme-provider";

import { useState } from "react";

function App() {
  const [view, setView] = useState("landing"); // views: landing, generator, history
  const [editData, setEditData] = useState(null);

  const handleOpenGenerator = (data = null) => {
    setEditData(data);
    setView("generator");
  };

  const handleBackToLanding = () => {
    setEditData(null);
    setView("landing");
  };

  const handleOpenHistory = () => {
    setView("history");
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="invoice-theme">
      {view === "generator" ? (
        <InvoiceGenerator onBack={handleBackToLanding} initialData={editData} />
      ) : view === "history" ? (
        <History onBack={handleBackToLanding} onEdit={handleOpenGenerator} />
      ) : (
        <LandingPage
          onOpen={() => handleOpenGenerator()}
          onOpenHistory={handleOpenHistory}
        />
      )}
    </ThemeProvider>
  );
}

export default App;
