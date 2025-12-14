import React, { useState, useEffect } from "react";
import { MobileHeader } from "./components/MobileHeader";
import { BodyshopBottomNav } from "./components/BodyshopBottomNav";
import { BodyshopDashboard } from "./components/BodyshopDashboard";
import { JobListView } from "./components/JobListView";
import { Analytics } from "./components/Analytics";
import { Followups } from "./components/Followups";
import { NewJobRequest } from "./components/NewJobRequest";
import { Settings } from "./components/Settings";
import { ManagerDashboard } from "./components/ManagerDashboard";
import { FloatingQuickMenu } from "./components/FloatingQuickMenu";
import { ExportReportDialog } from "./components/ExportReportDialog";
import { TeamViewDialog } from "./components/TeamViewDialog";
import { RevenueDialog } from "./components/RevenueDialog";
import { Toaster } from "./components/ui/sonner";
import { BodyshopDataProvider } from "./components/BodyshopDataContext";
import { Button } from "./components/ui/button";
import { Plus, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./components/ui/dialog";
import CsvUploader from "./components/CsvUploader";
import Auth from "./components/Auth";
import supabase from "./supabase/client";

function AppContent() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showNewJobDialog, setShowNewJobDialog] = useState(false);
  const [showExportReport, setShowExportReport] = useState(false);
  const [showTeamView, setShowTeamView] = useState(false);
  const [showRevenue, setShowRevenue] = useState(false);

  // CSV upload dialog visibility
  const [showCsvUpload, setShowCsvUpload] = useState(false);

  const getPageTitle = () => {
    switch (activeTab) {
      case "dashboard":
        return "PASCO Bodyshop";
      case "jobs":
        return "Jobs";
      case "manager":
        return "Manager Dashboard";
      case "analytics":
        return "Analytics";
      case "followups":
        return "Follow-ups";
      case "settings":
        return "Settings";
      default:
        return "PASCO Bodyshop";
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <BodyshopDashboard onNewJobClick={() => setShowNewJobDialog(true)} />;
      case "jobs":
        return <JobListView />;
      case "manager":
        return <ManagerDashboard />;
      case "analytics":
        return <Analytics />;
      case "followups":
        return <Followups />;
      case "settings":
        return <Settings />;
      default:
        return <BodyshopDashboard onNewJobClick={() => setShowNewJobDialog(true)} />;
    }
  };

  const handleJobCreated = () => {
    setShowNewJobDialog(false);
    setActiveTab("jobs");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <MobileHeader title={getPageTitle()} />

      {/* Main Content */}
      <main className="px-4 py-4 pb-24 max-w-screen-sm mx-auto">
        {renderContent()}
      </main>

      {/* Floating Action Button (New Job) */}
      {(activeTab === "dashboard" || activeTab === "jobs" || activeTab === "analytics") && (
        <Button
          onClick={() => setShowNewJobDialog(true)}
          className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 shadow-xl z-40 border-0 transition-all duration-300 hover:scale-110"
          size="icon"
          aria-label="New Job"
        >
          <Plus className="w-6 h-6 text-white" />
        </Button>
      )}

      {/* CSV Upload quick button (available across the app) */}
      <Button
        onClick={() => setShowCsvUpload(true)}
        className="fixed bottom-40 right-6 w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg z-40 border-0 transition-all duration-200"
        size="icon"
        aria-label="Upload CSV"
        title="Upload CSV"
      >
        <Upload className="w-5 h-5 text-white" />
      </Button>

      {/* Floating Quick Menu - Available on all tabs */}
      <FloatingQuickMenu
        onExportReport={() => setShowExportReport(true)}
        onManagerDetails={() => setShowTeamView(true)}
        onRevenue={() => setShowRevenue(true)}
      />

      {/* Bottom Navigation */}
      <BodyshopBottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* New Job Dialog */}
      <Dialog open={showNewJobDialog} onOpenChange={setShowNewJobDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] p-0">
          <DialogHeader className="p-6 pb-4 border-b">
            <DialogTitle>New Job Request</DialogTitle>
          </DialogHeader>
          <div className="px-6 pb-6 overflow-y-auto max-h-[calc(90vh-100px)]">
            <NewJobRequest onSuccess={handleJobCreated} />
          </div>
        </DialogContent>
      </Dialog>

      {/* CSV Upload Dialog */}
      <Dialog open={showCsvUpload} onOpenChange={setShowCsvUpload}>
        <DialogContent className="max-w-3xl max-h-[90vh] p-0">
          <DialogHeader className="p-6 pb-4 border-b">
            <DialogTitle>Upload CSV to Supabase</DialogTitle>
          </DialogHeader>
          <div className="px-6 pb-6 overflow-y-auto max-h-[calc(90vh-100px)]">
            {/* CsvUploader is the reusable component that parses, validates and sends CSV rows to your upload API */}
            <CsvUploader apiPath="/api/upload-csv" />
          </div>
        </DialogContent>
      </Dialog>

      {/* Export Report Dialog */}
      <ExportReportDialog open={showExportReport} onOpenChange={setShowExportReport} />

      {/* Team View Dialog */}
      <TeamViewDialog open={showTeamView} onOpenChange={setShowTeamView} />

      {/* Revenue Dialog */}
      <RevenueDialog open={showRevenue} onOpenChange={setShowRevenue} />

      {/* Toast Notifications */}
      <Toaster position="top-center" richColors />
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const session = (data as any)?.session;
        if (mounted) setUser(session?.user ?? null);
      } catch (err) {
        console.warn('Error getting session', err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    const { data: listener } = supabase.auth.onAuthStateChange((event: any, session: any) => {
      setUser(session?.user ?? null);
    });

    return () => {
      try { listener?.subscription?.unsubscribe?.(); } catch (e) {}
      mounted = false;
    };
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Auth />
      </div>
    );
  }

  return (
    <BodyshopDataProvider>
      <AppContent />
    </BodyshopDataProvider>
  );
}