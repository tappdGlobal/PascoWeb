import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import {
  Phone,
  MessageSquare,
  Camera,
  FileText,
  Clock,
  CheckCircle2,
  Calculator,
  Printer,
  Mail,
  Share2,
  FolderOpen,
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { useBodyshopData } from "./BodyshopDataContext";
import { JobCardSelectorDialog } from "./JobCardSelectorDialog";
import { CallSmsDialog } from "./CallSmsDialog";
import { PhotoUploadDialog } from "./PhotoUploadDialog";
import { EstimateDialog } from "./EstimateDialog";
import { TimePunchDialog } from "./TimePunchDialog";
import { Job } from "./BodyshopDataContext";

export function QuickAccessPanel() {
  const { jobs } = useBodyshopData();
  const [showJobSelector, setShowJobSelector] = useState(false);
  const [showCallDialog, setShowCallDialog] = useState(false);
  const [showSmsDialog, setShowSmsDialog] = useState(false);
  const [showPhotoDialog, setShowPhotoDialog] = useState(false);
  const [showEstimateDialog, setShowEstimateDialog] = useState(false);
  const [showTimePunch, setShowTimePunch] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [actionType, setActionType] = useState<string>("");

  const handleJobCardAction = (action: string) => {
    setActionType(action);
    setShowJobSelector(true);
  };

  const handleJobSelected = (job: Job) => {
    setSelectedJob(job);
    
    switch (actionType) {
      case "call":
        setShowCallDialog(true);
        break;
      case "sms":
        setShowSmsDialog(true);
        break;
      case "photo":
        setShowPhotoDialog(true);
        break;
      case "estimate":
        setShowEstimateDialog(true);
        break;
      case "print":
        toast.success(`Printing invoice for ${job.jobCardNumber}...`);
        break;
      case "email":
        toast.success(`Opening email for ${job.customerName}...`);
        break;
      case "mark-complete":
        toast.success(`Job ${job.jobCardNumber} marked as complete!`);
        break;
      case "open-job":
        toast.success(`Opening job card ${job.jobCardNumber}...`);
        break;
      case "report":
        toast.success(`Generating report for ${job.jobCardNumber}...`);
        break;
      case "share":
        toast.success(`Sharing status for ${job.jobCardNumber}...`);
        break;
    }
  };

  const quickActions = [
    {
      id: "call",
      icon: Phone,
      label: "Call Customer",
      color: "blue",
      action: () => handleJobCardAction("call")
    },
    {
      id: "sms",
      icon: MessageSquare,
      label: "Send SMS",
      color: "green",
      action: () => handleJobCardAction("sms")
    },
    {
      id: "photo",
      icon: Camera,
      label: "Take Photo",
      color: "purple",
      action: () => handleJobCardAction("photo")
    },
  ];

  // derived quick stats from jobs
  const openJobs = jobs.filter(j => String(j.status || '').toLowerCase() !== 'completed').length;
  const today = new Date().toLocaleDateString();
  const todaysJobs = jobs.filter(j => new Date(j.createdAt).toLocaleDateString() === today).length;
  const followups = jobs.filter(j => Boolean((j as any).callbackDate || (j as any).nextFollowUp || (j as any).followUpDate)).length;

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; hover: string }> = {
      blue: { bg: "bg-blue-100", text: "text-blue-600", hover: "hover:bg-blue-200" },
      green: { bg: "bg-green-100", text: "text-green-600", hover: "hover:bg-green-200" },
      purple: { bg: "bg-purple-100", text: "text-purple-600", hover: "hover:bg-purple-200" },
      orange: { bg: "bg-orange-100", text: "text-orange-600", hover: "hover:bg-orange-200" },
      red: { bg: "bg-red-100", text: "text-red-600", hover: "hover:bg-red-200" },
      indigo: { bg: "bg-indigo-100", text: "text-indigo-600", hover: "hover:bg-indigo-200" },
      yellow: { bg: "bg-yellow-100", text: "text-yellow-600", hover: "hover:bg-yellow-200" },
    };
    return colors[color] || colors.blue;
  };

  return (
    <>
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-3 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              const colorClasses = getColorClasses(action.color);
              
              return (
                <button
                  key={action.id}
                  onClick={action.action}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl ${colorClasses.bg} ${colorClasses.hover} transition-all duration-200 hover:scale-105 active:scale-95`}
                >
                  <Icon className={`w-6 h-6 ${colorClasses.text}`} />
                  <span className={`text-[10px] text-center font-medium leading-tight ${colorClasses.text}`}>
                    {action.label}
                  </span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <JobCardSelectorDialog
        open={showJobSelector}
        onOpenChange={setShowJobSelector}
        onSelectJob={handleJobSelected}
        title="Select Job Card"
      />
      <CallSmsDialog
        open={showCallDialog}
        onOpenChange={setShowCallDialog}
        job={selectedJob}
        mode="call"
      />
      <CallSmsDialog
        open={showSmsDialog}
        onOpenChange={setShowSmsDialog}
        job={selectedJob}
        mode="sms"
      />
      <PhotoUploadDialog
        open={showPhotoDialog}
        onOpenChange={setShowPhotoDialog}
        job={selectedJob}
      />
      <EstimateDialog
        open={showEstimateDialog}
        onOpenChange={setShowEstimateDialog}
        job={selectedJob}
      />
      <TimePunchDialog
        open={showTimePunch}
        onOpenChange={setShowTimePunch}
      />
    </>
  );
}