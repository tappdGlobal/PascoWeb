import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Job, StatusStage, useBodyshopData } from "./BodyshopDataContext";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { 
  User, Phone, Car, Calendar, CheckCircle2, Circle, 
  Image as ImageIcon, FileText, Clock, Shield, X, Upload
} from "lucide-react";
import { cn } from "./ui/utils";
import { useState } from "react";
import { toast } from "sonner@2.0.3";

interface JobDetailsDialogProps {
  job: Job | null;
  open: boolean;
  onClose: () => void;
}

const statusStages: StatusStage[] = [
  "Job Created",
  "Estimate Prepared",
  "Estimate Sent",
  "Estimate Approved",
  "Parts Ordered",
  "Work in Progress",
  "Painting",
  "Quality Check",
  "Ready for Delivery",
  "Completed"
];

export function JobDetailsDialog({ job, open, onClose }: JobDetailsDialogProps) {
  const { updateJobStage, addNote, addActivity, updateJob } = useBodyshopData();
  const [newNote, setNewNote] = useState("");
  const [interestStatus, setInterestStatus] = useState(job?.interestStatus || "");

  if (!job) return null;

  const handleStageClick = (stage: StatusStage) => {
    updateJobStage(job.id, stage);
    addActivity(job.id, `Status updated to: ${stage}`, "Current User");
    toast.success(`Job stage updated to ${stage}`);
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      addNote(job.id, newNote, "Current User");
      addActivity(job.id, "Added a note", "Current User");
      setNewNote("");
      toast.success("Note added successfully");
    }
  };

  const handleInterestStatusChange = (value: string) => {
    setInterestStatus(value);
    updateJob(job.id, { interestStatus: value as any });
    addActivity(job.id, `Interest status changed to: ${value}`, "Current User");
    toast.success("Interest status updated");
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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl">{job.jobCardNumber}</DialogTitle>
              <p className="text-sm text-gray-500 mt-1">{job.model}</p>
            </div>
            <div className="flex gap-2">
              <Badge className={cn(
                "px-3 py-1",
                job.status === "Service" ? "bg-blue-100 text-blue-800" :
                job.status === "In-Progress" ? "bg-yellow-100 text-yellow-800" :
                "bg-green-100 text-green-800"
              )}>
                {job.status}
              </Badge>
              {job.jobType === "Insurance" && (
                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                  <Shield className="w-3 h-3 mr-1" />
                  INSURANCE
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-100px)]">
          <div className="px-6 pb-6 space-y-6">
            
            {/* Customer & Vehicle Information */}
            <section>
              <h3 className="flex items-center gap-2 text-blue-900 mb-3">
                <User className="w-4 h-4" />
                Customer & Vehicle Information
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-gray-500">Registration Number</Label>
                  <p className="text-gray-900 mt-1">{job.regNo}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Model</Label>
                  <p className="text-gray-900 mt-1">{job.model}</p>
                </div>
                {job.vin && (
                  <div>
                    <Label className="text-gray-500">VIN</Label>
                    <p className="text-gray-900 mt-1">{job.vin}</p>
                  </div>
                )}
                {job.color && (
                  <div>
                    <Label className="text-gray-500">Color</Label>
                    <p className="text-gray-900 mt-1">{job.color}</p>
                  </div>
                )}
                <div>
                  <Label className="text-gray-500">Fuel Type</Label>
                  <p className="text-gray-900 mt-1">{job.fuelType}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Year</Label>
                  <p className="text-gray-900 mt-1">{job.year}</p>
                </div>
                {job.kmsDriven && (
                  <div>
                    <Label className="text-gray-500">KMs Driven</Label>
                    <p className="text-gray-900 mt-1">{job.kmsDriven} km</p>
                  </div>
                )}
                <div>
                  <Label className="text-gray-500">Customer Name</Label>
                  <p className="text-gray-900 mt-1">{job.customerName}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-gray-500">Customer Mobile</Label>
                  <p className="text-gray-900 mt-1">{job.customerMobile}</p>
                </div>
              </div>
            </section>

            <Separator />

            {/* Job Information */}
            <section>
              <h3 className="flex items-center gap-2 text-blue-900 mb-3">
                <Car className="w-4 h-4" />
                Job Information
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-gray-500">Job Card Number</Label>
                  <p className="text-gray-900 mt-1">{job.jobCardNumber}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Job Type</Label>
                  <p className="text-gray-900 mt-1">{job.jobType}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Advisor</Label>
                  <p className="text-gray-900 mt-1">{job.advisor}</p>
                </div>
                {job.technician && (
                  <div>
                    <Label className="text-gray-500">Technician</Label>
                    <p className="text-gray-900 mt-1">{job.technician}</p>
                  </div>
                )}
                {job.estimatedCompletion && (
                  <div>
                    <Label className="text-gray-500">Estimated Completion</Label>
                    <p className="text-gray-900 mt-1">{formatDate(job.estimatedCompletion)}</p>
                  </div>
                )}
                <div>
                  <Label className="text-gray-500">Arrival Date</Label>
                  <p className="text-gray-900 mt-1">{formatDate(job.arrivalDate)}</p>
                </div>
              </div>
            </section>

            {/* Insurance Information - Only if Insurance Job */}
            {job.jobType === "Insurance" && (
              <>
                <Separator />
                <section>
                  <h3 className="flex items-center gap-2 text-blue-900 mb-3">
                    <Shield className="w-4 h-4" />
                    Insurance Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {job.insuranceCompany && (
                      <div>
                        <Label className="text-gray-500">Insurance Company</Label>
                        <p className="text-gray-900 mt-1">{job.insuranceCompany}</p>
                      </div>
                    )}
                    {job.claimNumber && (
                      <div>
                        <Label className="text-gray-500">Claim Number</Label>
                        <p className="text-gray-900 mt-1">{job.claimNumber}</p>
                      </div>
                    )}
                    {job.surveyorName && (
                      <div>
                        <Label className="text-gray-500">Surveyor Name</Label>
                        <p className="text-gray-900 mt-1">{job.surveyorName}</p>
                      </div>
                    )}
                    {job.approvedAmount && (
                      <div>
                        <Label className="text-gray-500">Approved Amount</Label>
                        <p className="text-gray-900 mt-1">₹{job.approvedAmount.toLocaleString('en-IN')}</p>
                      </div>
                    )}
                    {job.surveySheetUrl && (
                      <div className="col-span-2">
                        <Label className="text-gray-500">Survey Sheet</Label>
                        <Button variant="outline" size="sm" className="mt-1">
                          <Upload className="w-4 h-4 mr-2" />
                          View Survey Sheet
                        </Button>
                      </div>
                    )}
                  </div>
                </section>
              </>
            )}

            <Separator />

            {/* Services & Estimated Bill */}
            <section>
              <h3 className="flex items-center gap-2 text-blue-900 mb-3">
                <Car className="w-4 h-4" />
                Services Requested & Estimated Bill
              </h3>
              {job.services && job.services.length > 0 ? (
                <div className="space-y-3">
                  {job.services.map((service) => (
                    <div 
                      key={service.id}
                      className="p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{service.name}</p>
                          <p className="text-xs text-gray-600 mt-1">{service.description}</p>
                        </div>
                        <Badge 
                          className={cn(
                            "ml-2",
                            service.status === "Completed" ? "bg-green-100 text-green-800" :
                            service.status === "In Progress" ? "bg-yellow-100 text-yellow-800" :
                            "bg-blue-100 text-blue-800"
                          )}
                        >
                          {service.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Estimated Cost</span>
                        <span className="text-gray-900">₹{service.estimatedCost.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  ))}
                  
                  {/* Total Estimated Bill */}
                  <div className="p-4 bg-blue-900 text-white rounded-lg">
                    <div className="flex items-center justify-between">
                      <span>Total Estimated Bill</span>
                      <span className="text-xl">
                        ₹{job.services.reduce((sum, s) => sum + s.estimatedCost, 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">No services added yet</p>
                </div>
              )}
            </section>

            <Separator />

            {/* Photo Upload Section - Before & After Images */}
            <section>
              <h3 className="flex items-center gap-2 text-blue-900 mb-3">
                <ImageIcon className="w-4 h-4" />
                Before & After Images
              </h3>
              
              {/* Before Images */}
              <div className="mb-4">
                <Label className="text-sm text-gray-700 mb-2 block">Before Images</Label>
                {job.photos.filter(p => p.category === "Before" || ["Front", "Rear", "Left", "Right", "Damage"].includes(p.category)).length > 0 ? (
                  <div className="grid grid-cols-3 gap-3">
                    {job.photos
                      .filter(p => p.category === "Before" || ["Front", "Rear", "Left", "Right", "Damage"].includes(p.category))
                      .map((photo) => (
                        <div key={photo.id} className="relative aspect-square">
                          <img
                            src={photo.url}
                            alt={photo.category}
                            className="w-full h-full object-cover rounded-lg border-2 border-gray-200"
                          />
                          <Badge className="absolute top-2 left-2 text-xs bg-black/60 text-white">
                            {photo.category}
                          </Badge>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">No before images</p>
                  </div>
                )}
              </div>

              {/* After Images */}
              <div>
                <Label className="text-sm text-gray-700 mb-2 block">After Images</Label>
                {job.photos.filter(p => p.category === "After").length > 0 ? (
                  <div className="grid grid-cols-3 gap-3">
                    {job.photos
                      .filter(p => p.category === "After")
                      .map((photo) => (
                        <div key={photo.id} className="relative aspect-square">
                          <img
                            src={photo.url}
                            alt={photo.category}
                            className="w-full h-full object-cover rounded-lg border-2 border-green-500"
                          />
                          <Badge className="absolute top-2 left-2 text-xs bg-green-600 text-white">
                            After
                          </Badge>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">No after images</p>
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <Button variant="outline" size="sm" className="w-full mt-3">
                <Upload className="w-4 h-4 mr-2" />
                Upload Photos
              </Button>
            </section>

            <Separator />

            {/* Status Timeline */}
            <section>
              <h3 className="flex items-center gap-2 text-blue-900 mb-3">
                <Calendar className="w-4 h-4" />
                Status Timeline
              </h3>
              <div className="space-y-2">
                {statusStages.map((stage, index) => {
                  const isCompleted = job.completedStages.includes(stage);
                  const isCurrent = job.currentStage === stage;
                  
                  return (
                    <div
                      key={stage}
                      onClick={() => handleStageClick(stage)}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all",
                        isCurrent ? "bg-blue-50 border-2 border-blue-900" : 
                        isCompleted ? "bg-green-50" : "bg-gray-50 hover:bg-gray-100"
                      )}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      )}
                      <span className={cn(
                        "text-sm",
                        isCurrent ? "text-blue-900" : 
                        isCompleted ? "text-gray-900" : "text-gray-500"
                      )}>
                        {stage}
                      </span>
                      {isCurrent && (
                        <Badge className="ml-auto bg-blue-900 text-white">Current</Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            <Separator />

            {/* Notes & Follow-Up */}
            <section>
              <h3 className="flex items-center gap-2 text-blue-900 mb-3">
                <FileText className="w-4 h-4" />
                Notes & Follow-Up
              </h3>
              
              <div className="space-y-4">
                {/* Interest Status */}
                <div>
                  <Label>Customer Interest Status</Label>
                  <Select value={interestStatus} onValueChange={handleInterestStatusChange}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select interest status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Interested">Interested</SelectItem>
                      <SelectItem value="Not Interested">Not Interested</SelectItem>
                      <SelectItem value="Follow-Up Later">Follow-Up Later</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Add New Note */}
                <div>
                  <Label>Add Note</Label>
                  <Textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Enter note..."
                    className="mt-1"
                    rows={3}
                  />
                  <Button 
                    onClick={handleAddNote}
                    disabled={!newNote.trim()}
                    className="mt-2 bg-blue-900 hover:bg-blue-800"
                  >
                    Add Note
                  </Button>
                </div>

                {/* Notes List */}
                {job.notes.length > 0 && (
                  <div className="space-y-3">
                    <Label>Previous Notes</Label>
                    {job.notes.map((note) => (
                      <div key={note.id} className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-900">{note.text}</p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                          <span>{note.createdBy}</span>
                          <span>•</span>
                          <span>{formatDateTime(note.createdAt)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            <Separator />

            {/* Activity Log */}
            <section>
              <h3 className="flex items-center gap-2 text-blue-900 mb-3">
                <Clock className="w-4 h-4" />
                Activity Log
              </h3>
              <div className="space-y-3">
                {job.activityLog.map((activity) => (
                  <div key={activity.id} className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-900 mt-2 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.action}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <span>{activity.user}</span>
                        <span>•</span>
                        <span>{formatDateTime(activity.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}