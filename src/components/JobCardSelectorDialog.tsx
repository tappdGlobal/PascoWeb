import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Search, Car } from "lucide-react";
import { useBodyshopData } from "./BodyshopDataContext";
import { Job } from "./BodyshopDataContext";

interface JobCardSelectorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectJob: (job: Job) => void;
  title: string;
}

export function JobCardSelectorDialog({ open, onOpenChange, onSelectJob, title }: JobCardSelectorDialogProps) {
  const { jobs } = useBodyshopData();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredJobs = jobs.filter(job =>
    job.jobCardNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.vehicleRegNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.vehicleModel.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectJob = (job: Job) => {
    onSelectJob(job);
    onOpenChange(false);
    setSearchQuery("");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "in-progress":
        return "bg-blue-100 text-blue-700";
      case "open":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by job card, reg no, customer, vehicle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Job Cards List */}
          <div className="space-y-2 overflow-y-auto flex-1">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                onClick={() => handleSelectJob(job)}
                className="p-4 border border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <Car className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold">{job.jobCardNumber}</p>
                      <p className="text-sm text-gray-600">{job.vehicleModel}</p>
                      <p className="text-xs text-gray-500">{job.vehicleRegNo}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(job.status)}>
                    {job.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Customer: </span>
                    <span className="font-semibold">{job.customerName}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Type: </span>
                    <span className="font-semibold">{job.jobType}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
