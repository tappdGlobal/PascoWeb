import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Calendar, Clock, UserCheck, ChevronRight } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { useBodyshopData } from "./BodyshopDataContext";

interface ScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ScheduleDialog({ open, onOpenChange }: ScheduleDialogProps) {
  const { jobs } = useBodyshopData();
  const today = new Date(); today.setHours(0,0,0,0);
  const todaySchedule = jobs.filter(j => {
    const d = j.arrivalDate ? new Date(j.arrivalDate) : j.createdAt ? new Date(j.createdAt) : null;
    if (!d) return false;
    d.setHours(0,0,0,0);
    return d.getTime() === today.getTime();
  }).map(j => ({
    time: j.arrivalDate ? new Date(j.arrivalDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-',
    endTime: '-',
    task: `${j.model ?? ''} - ${j.jobCardNumber}`,
    technician: j.technician ?? 'Unassigned',
    status: j.status,
    customer: j.customerName ?? '-',
    bay: j.pickupLocation ?? '-'
  }));

  const upcomingDays = [
    { date: "Tomorrow", count: jobs.length, slots: "auto" },
    { date: "This Week", count: jobs.length, slots: "auto" },
  ];

  const getStatusColor = (status: string) => {
    const s = String(status || '').toLowerCase();
    if (s === 'completed') return 'bg-green-100 text-green-700';
    if (s === 'in-progress' || s === 'in progress') return 'bg-blue-100 text-blue-700';
    if (s === 'pending' || s === 'scheduled') return 'bg-orange-100 text-orange-700';
    return 'bg-gray-100 text-gray-700';
  };

  const handleViewDetails = (task: string) => {
    toast.success(`Opening details for ${task}`);
  };

  const statsData = [
  { label: "Today's Jobs", value: todaySchedule.length, color: "blue" },
  { label: "In Progress", value: todaySchedule.filter(s => String(s.status || '').toLowerCase() === 'in-progress' || String(s.status || '').toLowerCase() === 'in progress').length, color: "purple" },
  { label: "Completed", value: todaySchedule.filter(s => String(s.status || '').toLowerCase() === 'completed').length, color: "green" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Work Schedule
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {statsData.map((stat) => {
              const bgColor = stat.color === "blue" ? "bg-blue-50" :
                             stat.color === "purple" ? "bg-purple-50" :
                             "bg-green-50";
              const textColor = stat.color === "blue" ? "text-blue-600" :
                               stat.color === "purple" ? "text-purple-600" :
                               "text-green-600";
              
              return (
                <div key={stat.label} className={`p-3 ${bgColor} rounded-xl text-center`}>
                  <p className={`text-2xl font-bold ${textColor}`}>{stat.value}</p>
                  <p className={`text-xs ${textColor}`}>{stat.label}</p>
                </div>
              );
            })}
          </div>

          {/* Today's Schedule */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm text-gray-700">Today's Schedule</h3>
              <p className="text-xs text-gray-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
            </div>

            {todaySchedule.map((item, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                onClick={() => handleViewDetails(item.task)}
              >
                <div className="flex gap-3">
                  {/* Time */}
                  <div className="flex flex-col items-center min-w-[80px] pt-1">
                    <div className="flex items-center gap-1 text-gray-700">
                      <Clock className="w-3 h-3" />
                      <p className="text-xs font-semibold">{item.time}</p>
                    </div>
                    <p className="text-[10px] text-gray-500">{item.endTime}</p>
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-sm mb-1">{item.task}</p>
                        <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                          <span className="flex items-center gap-1">
                            <UserCheck className="w-3 h-3" />
                            {item.technician}
                          </span>
                          <span>•</span>
                          <span>{item.bay}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Customer: {item.customer}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Upcoming Schedule */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-gray-700">Upcoming Schedule</h3>
            {upcomingDays.map((day) => (
              <div
                key={day.date}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors cursor-pointer"
                onClick={() => toast.success(`Opening schedule for ${day.date}`)}
              >
                <div>
                  <p className="font-semibold text-sm">{day.date}</p>
                  <p className="text-xs text-gray-600">{day.count} jobs scheduled</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-green-600 font-semibold">{day.slots}</p>
                  <ChevronRight className="w-4 h-4 text-gray-400 ml-auto mt-1" />
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={() => toast.success("Opening booking form...")}>
              Add Booking
            </Button>
            <Button variant="outline" onClick={() => toast.success("Opening calendar view...")}>
              Full Calendar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
