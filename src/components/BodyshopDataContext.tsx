import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import supabase from "../supabase/client";
import { toast } from "sonner@2.0.3";

export type JobType = "Insurance" | "Cash" | "Warranty";
export type JobStatus = "Service" | "In-Progress" | "Completed";
export type InterestStatus = "Interested" | "Not Interested" | "Follow-Up Later";

export type StatusStage = 
  | "Job Created"
  | "Estimate Prepared"
  | "Estimate Sent"
  | "Estimate Approved"
  | "Parts Ordered"
  | "Work in Progress"
  | "Painting"
  | "Quality Check"
  | "Ready for Delivery"
  | "Completed";

export interface Photo {
  id: string;
  url: string;
  category: "Front" | "Rear" | "Left" | "Right" | "Interior" | "Damage" | "Before" | "After";
  uploadedAt: Date;
}

export interface Note {
  id: string;
  text: string;
  createdAt: Date;
  createdBy: string;
}

export interface CallLog {
  id: string;
  callDate: Date;
  remarks: string;
  nextFollowUp?: Date;
  calledBy: string;
  customerResponse: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  estimatedCost: number;
  status: "Pending" | "In Progress" | "Completed";
}

export interface ActivityLog {
  id: string;
  action: string;
  timestamp: Date;
  user: string;
}

export interface Job {
  id: string;
  jobCardNumber: string;
  
  // Vehicle Information
  regNo: string;
  model: string;
  vin?: string;
  color?: string;
  fuelType: string;
  year: string;
  kmsDriven?: string;
  
  // Customer Information
  customerName: string;
  customerMobile: string;
  
  // Job Information
  jobType: JobType;
  advisor: string;
  technician?: string;
  estimatedCompletion?: Date;
  arrivalDate: Date;
  
  // Insurance Information (only if jobType is Insurance)
  insuranceCompany?: string;
  claimNumber?: string;
  surveyorName?: string;
  approvedAmount?: number;
  surveySheetUrl?: string;
  
  // Status and Timeline
  status: JobStatus;
  currentStage: StatusStage;
  completedStages: StatusStage[];
  
  // Photos
  photos: Photo[];
  
  // Notes and Follow-up
  notes: Note[];
  followUpDate?: Date;
  interestStatus?: InterestStatus;
  callLogs: CallLog[];
  services: Service[];
  activityLog: ActivityLog[];
  // Additional fields from CSV / Billing
  groupName?: string;
  callbackDate?: Date;
  labourAmt?: number;
  partAmt?: number;
  billAmount?: number;
  profit?: number;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

interface BodyshopDataContextType {
  jobs: Job[];
  addJob: (job: Omit<Job, "id" | "createdAt" | "updatedAt" | "activityLog" | "completedStages" | "currentStage">) => void;
  updateJob: (id: string, updates: Partial<Job>) => void;
  updateJobStatus: (id: string, status: JobStatus) => void;
  updateJobStage: (id: string, stage: StatusStage) => void;
  addPhoto: (jobId: string, photo: Omit<Photo, "id" | "uploadedAt">) => void;
  addNote: (jobId: string, text: string, user: string) => void;
  addCallLog: (jobId: string, callLog: Omit<CallLog, "id">) => void;
  addService: (jobId: string, service: Omit<Service, "id">) => void;
  addActivity: (jobId: string, action: string, user: string) => void;
  getJobsByStatus: (status: JobStatus) => Job[];
  searchJobs: (query: string) => Job[];
  getTodayJobsCount: () => number;
  getInProgressCount: () => number;
  getCompletedCount: () => number;
  getApprovalPendingCount: () => number;
  getFollowUpReminders: () => Job[];
}

const BodyshopDataContext = createContext<BodyshopDataContextType | undefined>(undefined);

// No in-file mock data. Load jobs from Supabase on mount. If Supabase isn't available or empty,
// the app will start with an empty list and components can handle that gracefully.

export function BodyshopDataProvider({ children }: { children: ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>([]);

  // Helper to convert Date objects to ISO strings so Supabase receives stable values.
  const serialize = (obj: any) =>
    JSON.parse(
      JSON.stringify(obj, (_key, value) => {
        if (value instanceof Date) return value.toISOString();
        return value;
      })
    );

  // Revive ISO date strings into Date objects for known date fields (recursively)
  const reviveDates = (v: any): any => {
    if (v === null || v === undefined) return v;
    if (typeof v === "string") {
      // ISO datetime or date detection
      const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
      if (isoRegex.test(v)) return new Date(v);
      const dateOnlyRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (dateOnlyRegex.test(v)) return new Date(v);
      return v;
    }
    if (Array.isArray(v)) return v.map(reviveDates);
    if (typeof v === "object") {
      const out: any = {};
      for (const k of Object.keys(v)) {
        out[k] = reviveDates(v[k]);
      }
      return out;
    }
    return v;
  };

  const parseJobRow = (row: any): Job => {
    // If the row stores full job in a `payload` column, use it; otherwise use the row directly.
    const raw = row?.payload ?? row;
    const revived = reviveDates(raw) as Job;
    // Derive numeric billing fields and profit if possible - use flexible keys from CSV by indexing as any
    const r: any = revived as any;
    // normalize status strings to canonical JobStatus values
    if (r.status) {
      const s = String(r.status).toLowerCase();
      if (s.includes('completed')) r.status = 'Completed';
      else if (s.includes('in-progress') || s.includes('in progress')) r.status = 'In-Progress';
      else r.status = 'Service';
    } else {
      r.status = 'Service';
    }
    // provide compatibility aliases used in some components
    r.vehicleModel = r.vehicleModel ?? r.model ?? '';
    r.vehicleRegNo = r.vehicleRegNo ?? r.regNo ?? '';
    const labour = Number(r.labourAmt ?? r.labour_amt ?? r["labour amount"] ?? 0) || 0;
    const part = Number(r.partAmt ?? r.part_amt ?? r["part amount"] ?? 0) || 0;
    const bill = Number(r.billAmount ?? r.bill_amount ?? r["bill amount"] ?? 0) || 0;
    const profit = bill - (labour + part);
    r.labourAmt = labour;
    r.partAmt = part;
    r.billAmount = bill;
    r.profit = profit;
    return r as Job;
  };

  // Helper to compute profit for a job object (mutates job)
  const computeProfitForJob = (job: any) => {
    const j: any = job;
    const labour = Number(j.labourAmt ?? j.labour_amt ?? j["labour amount"] ?? 0) || 0;
    const part = Number(j.partAmt ?? j.part_amt ?? j["part amount"] ?? 0) || 0;
    const bill = Number(j.billAmount ?? j.bill_amount ?? j["bill amount"] ?? 0) || 0;
    j.labourAmt = labour;
    j.partAmt = part;
    j.billAmount = bill;
    j.profit = bill - (labour + part);
    return j;
  };

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const { data, error } = await supabase.from("jobs").select("*");
        if (error) {
          console.error("Failed to fetch jobs from Supabase:", error);
          return;
        }
        if (!data) {
          setJobs([]);
          return;
        }
        // Normalize DB snake_case keys to camelCase, then map rows to Job objects
        const snakeToCamel = (s: string) => s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
        const normalizeKeys = (obj: any): any => {
          if (obj === null || obj === undefined) return obj;
          if (Array.isArray(obj)) return obj.map(normalizeKeys);
          if (typeof obj !== 'object') return obj;
          const out: any = {};
          for (const k of Object.keys(obj)) {
            const v = obj[k];
            const nk = snakeToCamel(k);
            out[nk] = normalizeKeys(v);
          }
          return out;
        };

        const normalized = data.map((row: any) => normalizeKeys(row));
        // Map rows to Job objects, handling `payload` if present and converting dates
        const parsed: Job[] = normalized.map(parseJobRow);
        setJobs(parsed);
      } catch (err) {
        console.error("Supabase loadJobs error:", err);
      }
    };

    loadJobs();
  }, []);

  const addJob = (job: Omit<Job, "id" | "createdAt" | "updatedAt" | "activityLog" | "completedStages" | "currentStage">) => {
    const jobNumber = `BS-2025-${String(jobs.length + 1).padStart(3, '0')}`;
    const newJob: Job = {
      ...job,
      id: Date.now().toString(),
      jobCardNumber: jobNumber,
      currentStage: "Job Created",
      completedStages: [],
      activityLog: [{
        id: Date.now().toString(),
        action: `Job created - ${job.jobType} type`,
        timestamp: new Date(),
        user: "System"
      }],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setJobs((prev) => [newJob, ...prev]);

    // Persist to server via secure API (adds server-side verification & profit computation)
    (async () => {
      try {
        computeProfitForJob(newJob);
        const payload = serialize(newJob);
        // get session to forward Authorization
        const sess = await supabase.auth.getSession();
        const token = (sess as any)?.data?.session?.access_token || (sess as any)?.access_token || null;
        await fetch('/api/jobs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ job: payload })
        });
      } catch (err) {
        console.error("Persist new job error:", err);
        toast.error("Failed to save job to server. It will be retried later.");
      }
    })();
  };

  const updateJob = (id: string, updates: Partial<Job>) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === id
          ? { ...job, ...updates, updatedAt: new Date() }
          : job
      )
    );

    // Persist updates via secure server API
    (async () => {
      try {
        const up = computeProfitForJob({ id, ...updates, updatedAt: new Date() });
        const payload = serialize(up);
        const sess = await supabase.auth.getSession();
        const token = (sess as any)?.data?.session?.access_token || (sess as any)?.access_token || null;
        await fetch('/api/jobs', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ id, updates: payload })
        });
      } catch (err) {
        console.error("Persist update job error:", err);
        toast.error("Failed to update job on server.");
      }
    })();
  };

  const updateJobStatus = (id: string, status: JobStatus) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === id
          ? { ...job, status, updatedAt: new Date() }
          : job
      )
    );
  };

  const updateJobStage = (id: string, stage: StatusStage) => {
    setJobs((prev) =>
      prev.map((job) => {
        if (job.id === id) {
          const completedStages = job.completedStages.includes(stage)
            ? job.completedStages
            : [...job.completedStages, stage];
          return {
            ...job,
            currentStage: stage,
            completedStages,
            updatedAt: new Date()
          };
        }
        return job;
      })
    );
  };

  const addPhoto = (jobId: string, photo: Omit<Photo, "id" | "uploadedAt">) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId
          ? {
              ...job,
              photos: [...job.photos, { ...photo, id: Date.now().toString(), uploadedAt: new Date() }],
              updatedAt: new Date()
            }
          : job
      )
    );

    // Persist photos array in background by upserting the whole job object
    (async () => {
      try {
        const job = jobs.find((j) => j.id === jobId);
        if (!job) return;
        const updatedJob = {
          ...job,
          photos: [...job.photos, { ...photo, id: Date.now().toString(), uploadedAt: new Date() }],
          updatedAt: new Date()
        };
        computeProfitForJob(updatedJob);
        const payload = serialize(updatedJob);
        const sess = await supabase.auth.getSession();
        const token = (sess as any)?.data?.session?.access_token || (sess as any)?.access_token || null;
        await fetch('/api/jobs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ job: payload })
        });
      } catch (err) {
        console.error("Supabase addPhoto error:", err);
      }
    })();
  };

  const addNote = (jobId: string, text: string, user: string) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId
          ? {
              ...job,
              notes: [...job.notes, { id: Date.now().toString(), text, createdAt: new Date(), createdBy: user }],
              updatedAt: new Date()
            }
          : job
      )
    );

    (async () => {
      try {
        const job = jobs.find((j) => j.id === jobId);
        if (!job) return;
        const updatedJob = {
          ...job,
          notes: [...job.notes, { id: Date.now().toString(), text, createdAt: new Date(), createdBy: user }],
          updatedAt: new Date()
        };
        computeProfitForJob(updatedJob);
        const payload = serialize(updatedJob);
        const sess = await supabase.auth.getSession();
        const token = (sess as any)?.data?.session?.access_token || (sess as any)?.access_token || null;
        await fetch('/api/jobs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ job: payload })
        });
      } catch (err) {
        console.error("Supabase addNote error:", err);
      }
    })();
  };

  const addCallLog = (jobId: string, callLog: Omit<CallLog, "id">) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId
          ? {
              ...job,
              callLogs: [...job.callLogs, { ...callLog, id: Date.now().toString() }],
              updatedAt: new Date()
            }
          : job
      )
    );

    (async () => {
      try {
        const job = jobs.find((j) => j.id === jobId);
        if (!job) return;
        const updatedJob = {
          ...job,
          callLogs: [...job.callLogs, { ...callLog, id: Date.now().toString() }],
          updatedAt: new Date()
        };
        computeProfitForJob(updatedJob);
        const payload = serialize(updatedJob);
        const sess = await supabase.auth.getSession();
        const token = (sess as any)?.data?.session?.access_token || (sess as any)?.access_token || null;
        await fetch('/api/jobs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ job: payload })
        });
      } catch (err) {
        console.error("Supabase addCallLog error:", err);
      }
    })();
  };

  const addService = (jobId: string, service: Omit<Service, "id">) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId
          ? {
              ...job,
              services: [...job.services, { ...service, id: Date.now().toString() }],
              updatedAt: new Date()
            }
          : job
      )
    );

    (async () => {
      try {
        const job = jobs.find((j) => j.id === jobId);
        if (!job) return;
        const updatedJob = {
          ...job,
          services: [...job.services, { ...service, id: Date.now().toString() }],
          updatedAt: new Date()
        };
        computeProfitForJob(updatedJob);
        const payload = serialize(updatedJob);
        const sess = await supabase.auth.getSession();
        const token = (sess as any)?.data?.session?.access_token || (sess as any)?.access_token || null;
        await fetch('/api/jobs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ job: payload })
        });
      } catch (err) {
        console.error("Supabase addService error:", err);
      }
    })();
  };

  const addActivity = (jobId: string, action: string, user: string) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId
          ? {
              ...job,
              activityLog: [...job.activityLog, { id: Date.now().toString(), action, timestamp: new Date(), user }],
              updatedAt: new Date()
            }
          : job
      )
    );

    (async () => {
      try {
        const job = jobs.find((j) => j.id === jobId);
        if (!job) return;
        const updatedJob = {
          ...job,
          activityLog: [...job.activityLog, { id: Date.now().toString(), action, timestamp: new Date(), user }],
          updatedAt: new Date()
        };
        const payload = serialize(updatedJob);
        const sess = await supabase.auth.getSession();
        const token = (sess as any)?.data?.session?.access_token || (sess as any)?.access_token || null;
        await fetch('/api/jobs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ job: payload })
        });
      } catch (err) {
        console.error("Supabase addActivity error:", err);
      }
    })();
  };

  const getJobsByStatus = (status: JobStatus) => {
    return jobs.filter((job) => job.status === status);
  };

  const searchJobs = (query: string) => {
    const lowerQuery = query.toLowerCase();
    return jobs.filter((job) =>
      job.jobCardNumber.toLowerCase().includes(lowerQuery) ||
      job.regNo.toLowerCase().includes(lowerQuery) ||
      job.model.toLowerCase().includes(lowerQuery) ||
      job.customerName.toLowerCase().includes(lowerQuery) ||
      job.customerMobile.includes(query)
    );
  };

  const getTodayJobsCount = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return jobs.filter((job) => {
      const jobDate = new Date(job.createdAt);
      jobDate.setHours(0, 0, 0, 0);
      return jobDate.getTime() === today.getTime();
    }).length;
  };

  const getInProgressCount = () => {
    return jobs.filter((job) => job.status === "In-Progress").length;
  };

  const getCompletedCount = () => {
    return jobs.filter((job) => job.status === "Completed").length;
  };

  const getApprovalPendingCount = () => {
    return jobs.filter(
      (job) => job.jobType === "Insurance" && job.currentStage === "Estimate Sent"
    ).length;
  };

  const getFollowUpReminders = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return jobs.filter((job) => {
      if (!job.followUpDate) return false;
      const followUp = new Date(job.followUpDate);
      followUp.setHours(0, 0, 0, 0);
      return followUp.getTime() <= today.getTime() && job.status !== "Completed";
    });
  };

  return (
    <BodyshopDataContext.Provider
      value={{
        jobs,
        addJob,
        updateJob,
        updateJobStatus,
        updateJobStage,
        addPhoto,
        addNote,
        addCallLog,
        addService,
        addActivity,
        getJobsByStatus,
        searchJobs,
        getTodayJobsCount,
        getInProgressCount,
        getCompletedCount,
        getApprovalPendingCount,
        getFollowUpReminders,
      }}
    >
      {children}
    </BodyshopDataContext.Provider>
  );
}

export function useBodyshopData() {
  const context = useContext(BodyshopDataContext);
  if (context === undefined) {
    throw new Error("useBodyshopData must be used within a BodyshopDataProvider");
  }
  return context;
}