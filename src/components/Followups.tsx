import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { useBodyshopData, Job } from "./BodyshopDataContext";
import { JobDetailsDialog } from "./JobDetailsDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { 
  Phone, Calendar as CalendarIcon, MessageSquare, 
  Clock, User, ChevronRight, Plus, PhoneCall 
} from "lucide-react";
import { cn } from "./ui/utils";
import { toast } from "sonner@2.0.3";

export function Followups() {
  const { jobs, addCallLog, addActivity } = useBodyshopData();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showCallLogDialog, setShowCallLogDialog] = useState(false);
  const [callJobId, setCallJobId] = useState<string>("");

  // Call log form state
  const [remarks, setRemarks] = useState("");
  const [nextFollowUp, setNextFollowUp] = useState<Date | undefined>(undefined);
  const [customerResponse, setCustomerResponse] = useState("");

  // Filter jobs that need follow-up or have call logs
  const jobsWithFollowups = jobs.filter(job => 
    job.callLogs.length > 0 || job.followUpDate || job.status !== "Completed"
  ).sort((a, b) => {
    // Sort by next follow-up date
    if (a.followUpDate && b.followUpDate) {
      return new Date(a.followUpDate).getTime() - new Date(b.followUpDate).getTime();
    }
    if (a.followUpDate) return -1;
    if (b.followUpDate) return 1;
    return 0;
  });

  const handleAddCallLog = (jobId: string) => {
    setCallJobId(jobId);
    setShowCallLogDialog(true);
  };

  const handleSubmitCallLog = () => {
    if (!remarks || !customerResponse) {
      toast.error("Please fill all required fields");
      return;
    }

    addCallLog(callJobId, {
      callDate: new Date(),
      remarks,
      nextFollowUp,
      calledBy: "Current User",
      customerResponse
    });

    addActivity(callJobId, `Call logged - ${customerResponse}`, "Current User");

    toast.success("Call log added successfully!");
    setShowCallLogDialog(false);
    resetCallForm();
  };

  const resetCallForm = () => {
    setRemarks("");
    setNextFollowUp(undefined);
    setCustomerResponse("");
    setCallJobId("");
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isFollowUpDue = (job: Job) => {
    if (!job.followUpDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const followUp = new Date(job.followUpDate);
    followUp.setHours(0, 0, 0, 0);
    return followUp.getTime() <= today.getTime();
  };

  return (
    <div className="space-y-4">
      {/* Header Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1">Total Follow-ups</p>
                <p className="text-2xl text-gray-900">{jobsWithFollowups.length}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-full">
                <Phone className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1">Due Today</p>
                <p className="text-2xl text-gray-900">
                  {jobsWithFollowups.filter(isFollowUpDue).length}
                </p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-full">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Follow-up List */}
      <div className="space-y-3">
        {jobsWithFollowups.length > 0 ? (
          jobsWithFollowups.map((job) => {
            const lastCall = job.callLogs[job.callLogs.length - 1];
            const isDue = isFollowUpDue(job);

            return (
              <Card 
                key={job.id}
                className={cn(
                  "cursor-pointer hover:shadow-lg transition-shadow border-l-4",
                  isDue ? "border-l-red-500 bg-red-50" : "border-l-blue-900"
                )}
              >
                <CardContent className="p-4">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-blue-900">{job.jobCardNumber}</span>
                        {isDue && (
                          <Badge className="bg-red-500 text-white text-xs">
                            Follow-up Due
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-900">{job.customerName}</p>
                      <p className="text-xs text-gray-500">{job.model}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedJob(job)}
                      className="text-xs"
                    >
                      View Details
                    </Button>
                  </div>

                  {/* Contact Info */}
                  <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{job.customerMobile}</span>
                  </div>

                  {/* Last Call Info */}
                  {lastCall && (
                    <div className="p-3 bg-white rounded-lg mb-3 border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <PhoneCall className="w-4 h-4 text-blue-600" />
                        <span className="text-xs text-gray-900">Last Call</span>
                        <span className="text-xs text-gray-500">
                          {formatDateTime(lastCall.callDate)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{lastCall.remarks}</p>
                      <div className="flex items-center justify-between text-xs">
                        <Badge 
                          variant="outline"
                          className={cn(
                            "text-xs",
                            lastCall.customerResponse === "Interested" ? "bg-green-50 text-green-700 border-green-200" :
                            lastCall.customerResponse === "Not Interested" ? "bg-red-50 text-red-700 border-red-200" :
                            "bg-yellow-50 text-yellow-700 border-yellow-200"
                          )}
                        >
                          {lastCall.customerResponse}
                        </Badge>
                      </div>
                    </div>
                  )}

                  {/* Next Follow-up */}
                  {job.followUpDate && (
                    <div className="flex items-center gap-2 mb-3 p-2 bg-blue-50 rounded-lg">
                      <CalendarIcon className="w-4 h-4 text-blue-600" />
                      <span className="text-xs text-gray-700">
                        Next Follow-up: {formatDate(job.followUpDate)}
                      </span>
                    </div>
                  )}

                  {/* All Call Logs */}
                  {job.callLogs.length > 1 && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-2">
                        Call History ({job.callLogs.length} calls)
                      </p>
                      <div className="space-y-2">
                        {job.callLogs.slice(0, -1).reverse().map((call) => (
                          <div 
                            key={call.id}
                            className="flex items-start gap-2 p-2 bg-gray-50 rounded text-xs"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5" />
                            <div className="flex-1">
                              <p className="text-gray-700">{call.remarks}</p>
                              <div className="flex items-center gap-2 mt-1 text-gray-500">
                                <span>{formatDateTime(call.callDate)}</span>
                                <span>•</span>
                                <span>{call.calledBy}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <Button
                    onClick={() => handleAddCallLog(job.id)}
                    className="w-full bg-blue-900 hover:bg-blue-800"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Log Call
                  </Button>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Phone className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>No follow-ups scheduled</p>
          </div>
        )}
      </div>

      {/* Add Call Log Dialog */}
      <Dialog open={showCallLogDialog} onOpenChange={setShowCallLogDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Log Customer Call</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Call duration removed per requirements */}

            <div>
              <Label>Remarks *</Label>
              <Textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Enter call details and discussion points..."
                className="mt-1"
                rows={3}
              />
            </div>

            <div>
              <Label>Customer Response *</Label>
              <Input
                value={customerResponse}
                onChange={(e) => setCustomerResponse(e.target.value)}
                placeholder="e.g., Interested, Not Interested, Follow-Up Later"
                className="mt-1"
              />
            </div>

            <div>
              <Label>Next Follow-up Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full mt-1 justify-start text-left",
                      !nextFollowUp && "text-gray-500"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {nextFollowUp ? formatDate(nextFollowUp) : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={nextFollowUp}
                    onSelect={setNextFollowUp}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCallLogDialog(false);
                  resetCallForm();
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitCallLog}
                className="flex-1 bg-blue-900 hover:bg-blue-800"
              >
                Save Call Log
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Job Details Dialog */}
      <JobDetailsDialog
        job={selectedJob}
        open={!!selectedJob}
        onClose={() => setSelectedJob(null)}
      />
    </div>
  );
}
