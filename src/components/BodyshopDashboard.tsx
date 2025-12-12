import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useBodyshopData } from "./BodyshopDataContext";
import { 
  Wrench, Clock, CheckCircle2, AlertCircle, 
  Bell, Search, TrendingUp 
} from "lucide-react";
import { JobCard } from "./JobCard";
import { JobDetailsDialog } from "./JobDetailsDialog";
import { QuickAccessPanel } from "./QuickAccessPanel";
import { useState } from "react";
import { Job } from "./BodyshopDataContext";

interface BodyshopDashboardProps {
  onNewJobClick: () => void;
}

export function BodyshopDashboard({ onNewJobClick }: BodyshopDashboardProps) {
  const { 
    jobs,
    searchJobs,
    getTodayJobsCount,
    getInProgressCount,
    getCompletedCount,
    getApprovalPendingCount,
    getFollowUpReminders
  } = useBodyshopData();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const displayedJobs = searchQuery ? searchJobs(searchQuery) : jobs.slice(0, 5);
  const followUpReminders = getFollowUpReminders();

  const stats = [
    {
      title: "Today's Jobs",
      value: getTodayJobsCount(),
      icon: Wrench,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      title: "In Progress",
      value: getInProgressCount(),
      icon: Clock,
      color: "text-yellow-600",
      bg: "bg-yellow-50"
    },
    {
      title: "Completed",
      value: getCompletedCount(),
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-50"
    },
    {
      title: "Approval Pending",
      value: getApprovalPendingCount(),
      icon: AlertCircle,
      color: "text-orange-600",
      bg: "bg-orange-50"
    }
  ];

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="text"
          placeholder="Search by job card, reg no, customer..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-4 py-6 text-base"
        />
      </div>

      {/* Quick Access Panel */}
      <QuickAccessPanel />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">{stat.title}</p>
                    <p className="text-2xl text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`${stat.bg} p-3 rounded-full`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Follow-Up Reminders */}
      {followUpReminders.length > 0 && (
        <Card className="border-l-4 border-l-red-500 bg-red-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-red-900">
              <Bell className="w-4 h-4" />
              Follow-Up Reminders ({followUpReminders.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {followUpReminders.slice(0, 3).map((job) => (
              <div 
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className="p-3 bg-white rounded-lg cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-900">{job.jobCardNumber}</p>
                    <p className="text-xs text-gray-500">{job.customerName}</p>
                  </div>
                  <Button size="sm" variant="outline" className="text-xs">
                    View
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Job Details Dialog */}
      <JobDetailsDialog
        job={selectedJob}
        open={!!selectedJob}
        onClose={() => setSelectedJob(null)}
      />
    </div>
  );
}