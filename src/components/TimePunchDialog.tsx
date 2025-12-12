import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Clock, LogIn, LogOut } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface TimePunchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TimePunchDialog({ open, onOpenChange }: TimePunchDialogProps) {
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [punchInTime, setPunchInTime] = useState<Date | null>(null);
  const [totalHours, setTotalHours] = useState(0);

  const handlePunchIn = () => {
    const now = new Date();
    setPunchInTime(now);
    setIsPunchedIn(true);
    toast.success(`Punched In at ${now.toLocaleTimeString()}`);
  };

  const handlePunchOut = () => {
    if (punchInTime) {
      const now = new Date();
      const diff = now.getTime() - punchInTime.getTime();
      const hours = diff / (1000 * 60 * 60);
      setTotalHours(hours);
      setIsPunchedIn(false);
      toast.success(`Punched Out at ${now.toLocaleTimeString()}`);
      toast.info(`Total time worked: ${hours.toFixed(2)} hours`);
    }
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: true 
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            Time Tracking
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Time Display */}
          <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200 text-center">
            <p className="text-sm text-gray-600 mb-2">Current Time</p>
            <p className="text-4xl font-bold text-gray-900">{getCurrentTime()}</p>
            <p className="text-sm text-gray-600 mt-2">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          </div>

          {/* Status */}
          {isPunchedIn && punchInTime && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700 font-semibold">Currently Working</p>
                  <p className="text-xs text-green-600 mt-1">Punched in at {punchInTime.toLocaleTimeString()}</p>
                </div>
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          )}

          {!isPunchedIn && totalHours > 0 && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-sm text-blue-700 font-semibold">Last Session</p>
              <p className="text-2xl font-bold text-blue-900">{totalHours.toFixed(2)} hours</p>
            </div>
          )}

          {/* Action Buttons */}
          {!isPunchedIn ? (
            <Button
              onClick={handlePunchIn}
              className="w-full h-16 text-lg bg-gradient-to-r from-green-500 to-emerald-600"
            >
              <LogIn className="w-6 h-6 mr-2" />
              Punch In
            </Button>
          ) : (
            <Button
              onClick={handlePunchOut}
              className="w-full h-16 text-lg bg-gradient-to-r from-red-500 to-orange-600"
            >
              <LogOut className="w-6 h-6 mr-2" />
              Punch Out
            </Button>
          )}

          {/* Today's Summary */}
          <div className="p-4 border border-gray-200 rounded-xl space-y-2">
            <p className="font-semibold text-sm">Today's Summary</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-2 bg-gray-50 rounded-lg text-center">
                <p className="text-gray-600 text-xs">Total Hours</p>
                <p className="font-bold">{totalHours.toFixed(2)}</p>
              </div>
              <div className="p-2 bg-gray-50 rounded-lg text-center">
                <p className="text-gray-600 text-xs">Status</p>
                <p className="font-bold">{isPunchedIn ? "Working" : "Off Duty"}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
