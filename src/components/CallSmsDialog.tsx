import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Phone, MessageSquare, User, Car } from "lucide-react";
import { Job } from "./BodyshopDataContext";
import { toast } from "sonner@2.0.3";
import { useState } from "react";

interface CallSmsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: Job | null;
  mode: "call" | "sms";
}

export function CallSmsDialog({ open, onOpenChange, job, mode }: CallSmsDialogProps) {
  const [message, setMessage] = useState("");

  const handleAction = () => {
    if (mode === "call") {
      toast.success(`Calling ${job?.customerName}...`);
    } else {
      if (!message.trim()) {
        toast.error("Please enter a message");
        return;
      }
      toast.success(`SMS sent to ${job?.customerName}`);
      setMessage("");
    }
    onOpenChange(false);
  };

  const quickMessages = [
    "Your vehicle is ready for pickup",
    "Work in progress, will update soon",
    "Please visit for approval",
    "Payment pending, please clear dues",
  ];

  if (!job) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === "call" ? (
              <>
                <Phone className="w-5 h-5 text-green-600" />
                Call Customer
              </>
            ) : (
              <>
                <MessageSquare className="w-5 h-5 text-blue-600" />
                Send SMS
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Job Card Info */}
          <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Car className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold">{job.jobCardNumber}</p>
                <p className="text-sm text-gray-600">{job.vehicleModel} • {job.vehicleRegNo}</p>
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="p-4 border border-gray-200 rounded-xl space-y-3">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-600">Customer Name:</span>
              <span className="font-semibold">{job.customerName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-600">Phone Number:</span>
              <span className="font-semibold text-blue-600">{job.customerPhone}</span>
            </div>
          </div>

          {mode === "sms" && (
            <>
              {/* Quick Messages */}
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-700">Quick Messages:</p>
                <div className="grid grid-cols-1 gap-2">
                  {quickMessages.map((msg, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="justify-start text-left h-auto py-2"
                      onClick={() => setMessage(msg)}
                    >
                      {msg}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Custom Message */}
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-700">Custom Message:</p>
                <Textarea
                  placeholder="Type your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                />
                <p className="text-xs text-gray-500">{message.length}/160 characters</p>
              </div>
            </>
          )}

          {/* Action Button */}
          <Button
            onClick={handleAction}
            className={`w-full ${
              mode === "call"
                ? "bg-gradient-to-r from-green-500 to-emerald-600"
                : "bg-gradient-to-r from-blue-500 to-blue-600"
            }`}
          >
            {mode === "call" ? (
              <>
                <Phone className="w-4 h-4 mr-2" />
                Call Now
              </>
            ) : (
              <>
                <MessageSquare className="w-4 h-4 mr-2" />
                Send SMS
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
