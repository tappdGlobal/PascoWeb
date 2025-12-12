import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Camera, FileText, Shield } from "lucide-react";
import { Job } from "./BodyshopDataContext";
import { cn } from "./ui/utils";

interface JobCardProps {
  job: Job;
  onClick: () => void;
}

export function JobCard({ job, onClick }: JobCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Service":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "In-Progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Card 
      className="p-4 cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-l-blue-900"
      onClick={onClick}
    >
      <div className="flex flex-col gap-3">
        {/* Header Row */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-blue-900">{job.jobCardNumber}</span>
              {job.jobType === "Insurance" && (
                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 text-xs">
                  <Shield className="w-3 h-3 mr-1" />
                  INSURANCE
                </Badge>
              )}
            </div>
            <p className="text-gray-900">{job.model}</p>
          </div>
          <Badge className={cn("px-2 py-1", getStatusColor(job.status))}>
            {job.status}
          </Badge>
        </div>

        {/* Vehicle & Customer Info */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-gray-500">Reg No:</span>
            <p className="text-gray-900">{job.regNo}</p>
          </div>
          <div>
            <span className="text-gray-500">Customer:</span>
            <p className="text-gray-900">{job.customerName}</p>
          </div>
        </div>

        {/* Contact */}
        <div className="text-sm">
          <span className="text-gray-500">Mobile: </span>
          <span className="text-gray-900">{job.customerMobile}</span>
        </div>

        {/* Current Stage */}
        <div className="text-sm">
          <span className="text-gray-500">Current Stage: </span>
          <span className="text-blue-900">{job.currentStage}</span>
        </div>

        {/* Icons Row */}
        <div className="flex items-center gap-4 pt-2 border-t">
          {job.photos.length > 0 && (
            <div className="flex items-center gap-1 text-gray-600">
              <Camera className="w-4 h-4" />
              <span className="text-xs">{job.photos.length}</span>
            </div>
          )}
          {job.notes.length > 0 && (
            <div className="flex items-center gap-1 text-gray-600">
              <FileText className="w-4 h-4" />
              <span className="text-xs">{job.notes.length}</span>
            </div>
          )}
          {job.jobType === "Insurance" && job.insuranceCompany && (
            <div className="text-xs text-gray-600">
              {job.insuranceCompany}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
