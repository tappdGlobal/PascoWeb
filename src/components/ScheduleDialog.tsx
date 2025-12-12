import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Calendar, Clock, UserCheck, ChevronRight } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface ScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ScheduleDialog({ open, onOpenChange }: ScheduleDialogProps) {
  const todaySchedule = [
    { 
      time: "09:00 AM", 
      endTime: "11:00 AM",
      task: "Honda City - Paint Job", 
      technician: "Amit Sharma", 
      status: "in-progress",
      customer: "Mr. Patel",
      bay: "Bay 2"
    },
    { 
      time: "10:30 AM", 
      endTime: "12:30 PM",
      task: "Maruti Swift - Dent Repair", 
      technician: "Rajesh Kumar", 
      status: "completed",
      customer: "Mrs. Sharma",
      bay: "Bay 1"
    },
    { 
      time: "12:00 PM", 
      endTime: "03:00 PM",
      task: "Hyundai Creta - Full Service", 
      technician: "Vijay Patel", 
      status: "pending",
      customer: "Mr. Singh",
      bay: "Bay 3"
    },
    { 
      time: "02:00 PM", 
      endTime: "04:30 PM",
      task: "Tata Nexon - Insurance Claim", 
      technician: "Priya Singh", 
      status: "in-progress",
      customer: "Ms. Reddy",
      bay: "Reception"
    },
    { 
      time: "04:00 PM", 
      endTime: "06:00 PM",
      task: "Toyota Fortuner - Detailing", 
      technician: "Rajesh Kumar", 
      status: "scheduled",
      customer: "Mr. Verma",
      bay: "Bay 1"
    },
    { 
      time: "04:30 PM", 
      endTime: "06:30 PM",
      task: "Mahindra XUV700 - Wheel Alignment", 
      technician: "Vijay Patel", 
      status: "scheduled",
      customer: "Mr. Kumar",
      bay: "Bay 3"
    },
  ];

  const upcomingDays = [
    { date: "Tomorrow", count: 12, slots: "6 available" },
    { date: "Day After", count: 8, slots: "10 available" },
    { date: "This Week", count: 45, slots: "32 available" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "in-progress":
        return "bg-blue-100 text-blue-700";
      case "pending":
      case "scheduled":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleViewDetails = (task: string) => {
    toast.success(`Opening details for ${task}`);
  };

  const statsData = [
    { label: "Today's Jobs", value: todaySchedule.length, color: "blue" },
    { label: "In Progress", value: todaySchedule.filter(s => s.status === "in-progress").length, color: "purple" },
    { label: "Completed", value: todaySchedule.filter(s => s.status === "completed").length, color: "green" },
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
