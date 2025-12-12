import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useBodyshopData, JobStatus, Job } from "./BodyshopDataContext";
import { JobCard } from "./JobCard";
import { JobDetailsDialog } from "./JobDetailsDialog";
import { Input } from "./ui/input";
import { Search, Filter } from "lucide-react";
import { Badge } from "./ui/badge";

export function JobListView() {
  const { getJobsByStatus, jobs } = useBodyshopData();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<JobStatus>("Service");

  const filterJobs = (jobs: Job[]) => {
    if (!searchQuery) return jobs;
    const query = searchQuery.toLowerCase();
    return jobs.filter(job =>
      job.jobCardNumber.toLowerCase().includes(query) ||
      job.regNo.toLowerCase().includes(query) ||
      job.model.toLowerCase().includes(query) ||
      job.customerName.toLowerCase().includes(query) ||
      job.customerMobile.includes(query)
    );
  };

  const serviceJobs = filterJobs(getJobsByStatus("Service"));
  const inProgressJobs = filterJobs(getJobsByStatus("In-Progress"));
  const completedJobs = filterJobs(getJobsByStatus("Completed"));

  const getTabCount = (status: JobStatus) => {
    switch (status) {
      case "Service":
        return serviceJobs.length;
      case "In-Progress":
        return inProgressJobs.length;
      case "Completed":
        return completedJobs.length;
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="text"
          placeholder="Search jobs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-4 py-6 text-base"
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as JobStatus)}>
        <TabsList className="grid w-full grid-cols-3 bg-gray-100">
          <TabsTrigger value="Service" className="relative">
            Service
            {getTabCount("Service") > 0 && (
              <Badge className="ml-2 bg-blue-600 text-white text-xs px-2 py-0">
                {getTabCount("Service")}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="In-Progress" className="relative">
            In-Progress
            {getTabCount("In-Progress") > 0 && (
              <Badge className="ml-2 bg-yellow-600 text-white text-xs px-2 py-0">
                {getTabCount("In-Progress")}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="Completed" className="relative">
            Completed
            {getTabCount("Completed") > 0 && (
              <Badge className="ml-2 bg-green-600 text-white text-xs px-2 py-0">
                {getTabCount("Completed")}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="Service" className="mt-4 space-y-3">
          {serviceJobs.length > 0 ? (
            serviceJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onClick={() => setSelectedJob(job)}
              />
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p className="mb-2">No service requests found</p>
              {searchQuery && (
                <p className="text-sm">Try adjusting your search</p>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="In-Progress" className="mt-4 space-y-3">
          {inProgressJobs.length > 0 ? (
            inProgressJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onClick={() => setSelectedJob(job)}
              />
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p className="mb-2">No jobs in progress</p>
              {searchQuery && (
                <p className="text-sm">Try adjusting your search</p>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="Completed" className="mt-4 space-y-3">
          {completedJobs.length > 0 ? (
            completedJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onClick={() => setSelectedJob(job)}
              />
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p className="mb-2">No completed jobs</p>
              {searchQuery && (
                <p className="text-sm">Try adjusting your search</p>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Job Details Dialog */}
      <JobDetailsDialog
        job={selectedJob}
        open={!!selectedJob}
        onClose={() => setSelectedJob(null)}
      />
    </div>
  );
}
