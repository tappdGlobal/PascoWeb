import React from "react";
import { Button } from "./ui/button";
import { DownloadCloud, Users, BarChart2, Upload } from "lucide-react";

type Props = {
  onExportReport: () => void;
  onManagerDetails: () => void;
  onRevenue: () => void;
  onCsvUpload?: () => void; // optional for backward compatibility
};

/**
 * FloatingQuickMenu
 * Small vertical floating action menu with actions:
 * - Export Report
 * - Manager Details
 * - Revenue
 * - CSV Upload (optional)
 */
export const FloatingQuickMenu: React.FC<Props> = ({
  onExportReport,
  onManagerDetails,
  onRevenue,
  onCsvUpload,
}) => {
  return (
    <div
      aria-label="Quick actions"
      className="fixed right-6 bottom-6 z-40 flex flex-col gap-3 items-center"
    >
      {/* CSV Upload */}
      {onCsvUpload && (
        <Button
          onClick={onCsvUpload}
          size="icon"
          aria-label="Upload CSV"
          title="Upload CSV"
          className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg border-0"
        >
          <Upload className="w-5 h-5" />
        </Button>
      )}

      {/* Export Report */}
      <Button
        onClick={onExportReport}
        size="icon"
        aria-label="Export Report"
        title="Export Report"
        className="w-12 h-12 rounded-full bg-violet-600 hover:bg-violet-700 text-white shadow-lg border-0"
      >
        <DownloadCloud className="w-5 h-5" />
      </Button>

      {/* Manager / Team Details */}
      <Button
        onClick={onManagerDetails}
        size="icon"
        aria-label="Manager Details"
        title="Manager / Team"
        className="w-12 h-12 rounded-full bg-amber-500 hover:bg-amber-600 text-white shadow-lg border-0"
      >
        <Users className="w-5 h-5" />
      </Button>

      {/* Revenue */}
      <Button
        onClick={onRevenue}
        size="icon"
        aria-label="Revenue"
        title="Revenue"
        className="w-12 h-12 rounded-full bg-green-600 hover:bg-green-700 text-white shadow-lg border-0"
      >
        <BarChart2 className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default FloatingQuickMenu;
