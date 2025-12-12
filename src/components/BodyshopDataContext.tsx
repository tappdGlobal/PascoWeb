import { createContext, useContext, useState, ReactNode } from "react";

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
  callDuration: string;
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

// Mock data
const mockJobs: Job[] = [
  {
    id: "1",
    jobCardNumber: "BS-2025-001",
    regNo: "HR26DK8877",
    model: "Maruti Suzuki Swift VXi",
    vin: "MA3ERLF1S00234567",
    color: "Pearl White",
    fuelType: "Petrol",
    year: "2022",
    kmsDriven: "15,234",
    customerName: "Rajesh Kumar",
    customerMobile: "+91 9876543210",
    jobType: "Insurance",
    advisor: "Amit Singh",
    technician: "Suresh Yadav",
    estimatedCompletion: new Date("2025-12-15"),
    arrivalDate: new Date("2025-12-09"),
    insuranceCompany: "HDFC Ergo",
    claimNumber: "CLM2025001234",
    surveyorName: "Rahul Mehta",
    approvedAmount: 45000,
    status: "In-Progress",
    currentStage: "Work in Progress",
    completedStages: ["Job Created", "Estimate Prepared", "Estimate Sent", "Estimate Approved", "Parts Ordered"],
    photos: [
      {
        id: "p1",
        url: "https://images.unsplash.com/photo-1449130015084-2dc954a6f821?w=400",
        category: "Front",
        uploadedAt: new Date("2025-12-09")
      }
    ],
    notes: [
      {
        id: "n1",
        text: "Customer approved estimate. Parts ordered from supplier.",
        createdAt: new Date("2025-12-10"),
        createdBy: "Amit Singh"
      }
    ],
    followUpDate: new Date("2025-12-14"),
    interestStatus: "Interested",
    callLogs: [
      {
        id: "c1",
        callDate: new Date("2025-12-09T10:00:00"),
        callDuration: "15 mins",
        remarks: "Discussed estimate with customer",
        nextFollowUp: new Date("2025-12-11"),
        calledBy: "Amit Singh",
        customerResponse: "Interested"
      }
    ],
    services: [
      {
        id: "s1",
        name: "Painting",
        description: "Full body painting",
        estimatedCost: 20000,
        status: "In Progress"
      }
    ],
    activityLog: [
      {
        id: "a1",
        action: "Job created and assigned to Amit Singh",
        timestamp: new Date("2025-12-09T09:00:00"),
        user: "System"
      },
      {
        id: "a2",
        action: "Estimate prepared - ₹45,000",
        timestamp: new Date("2025-12-09T11:30:00"),
        user: "Amit Singh"
      }
    ],
    createdAt: new Date("2025-12-09"),
    updatedAt: new Date("2025-12-10")
  },
  {
    id: "2",
    jobCardNumber: "BS-2025-002",
    regNo: "DL8CAF9356",
    model: "Hyundai i20 Sportz",
    vin: "MALH11BAXM1234567",
    color: "Fiery Red",
    fuelType: "Diesel",
    year: "2021",
    kmsDriven: "32,567",
    customerName: "Priya Sharma",
    customerMobile: "+91 9876543211",
    jobType: "Cash",
    advisor: "Sneha Verma",
    estimatedCompletion: new Date("2025-12-12"),
    arrivalDate: new Date("2025-12-08"),
    status: "Service",
    currentStage: "Estimate Prepared",
    completedStages: ["Job Created"],
    photos: [
      {
        id: "p2",
        url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400",
        category: "Rear",
        uploadedAt: new Date("2025-12-08")
      }
    ],
    notes: [],
    followUpDate: new Date("2025-12-11"),
    interestStatus: "Follow-Up Later",
    callLogs: [
      {
        id: "c2",
        callDate: new Date("2025-12-08T15:00:00"),
        callDuration: "10 mins",
        remarks: "Discussed rear bumper damage",
        nextFollowUp: new Date("2025-12-11"),
        calledBy: "Sneha Verma",
        customerResponse: "Follow-Up Later"
      }
    ],
    services: [
      {
        id: "s2",
        name: "Bumper Repair",
        description: "Rear bumper repair",
        estimatedCost: 5000,
        status: "Pending"
      }
    ],
    activityLog: [
      {
        id: "a3",
        action: "Job created - Rear bumper damage",
        timestamp: new Date("2025-12-08T14:00:00"),
        user: "System"
      }
    ],
    createdAt: new Date("2025-12-08"),
    updatedAt: new Date("2025-12-08")
  },
  {
    id: "3",
    jobCardNumber: "BS-2025-003",
    regNo: "HR55AB1234",
    model: "Honda City ZX",
    vin: "MAHH11DE3K5678901",
    color: "Platinum Silver",
    fuelType: "Petrol",
    year: "2023",
    kmsDriven: "8,450",
    customerName: "Amit Patel",
    customerMobile: "+91 9876543212",
    jobType: "Warranty",
    advisor: "Amit Singh",
    technician: "Ramesh Kumar",
    estimatedCompletion: new Date("2025-12-10"),
    arrivalDate: new Date("2025-12-05"),
    status: "Completed",
    currentStage: "Completed",
    completedStages: ["Job Created", "Estimate Prepared", "Estimate Sent", "Estimate Approved", "Parts Ordered", "Work in Progress", "Painting", "Quality Check", "Ready for Delivery", "Completed"],
    photos: [],
    notes: [
      {
        id: "n2",
        text: "Paint job completed successfully. Customer very satisfied.",
        createdAt: new Date("2025-12-09"),
        createdBy: "Amit Singh"
      }
    ],
    callLogs: [
      {
        id: "c3",
        callDate: new Date("2025-12-09T16:00:00"),
        callDuration: "5 mins",
        remarks: "Delivered vehicle to customer",
        calledBy: "Amit Singh",
        customerResponse: "Satisfied"
      }
    ],
    services: [
      {
        id: "s3",
        name: "Painting",
        description: "Full body painting",
        estimatedCost: 20000,
        status: "Completed"
      }
    ],
    activityLog: [
      {
        id: "a4",
        action: "Job completed and vehicle delivered",
        timestamp: new Date("2025-12-09T17:00:00"),
        user: "Amit Singh"
      }
    ],
    createdAt: new Date("2025-12-05"),
    updatedAt: new Date("2025-12-09")
  },
  // Adding 47 more jobs to total 50
  {
    id: "4",
    jobCardNumber: "BS-2025-004",
    regNo: "DL3CAB1234",
    model: "Tata Nexon XZ+",
    color: "Flame Red",
    fuelType: "Petrol",
    year: "2022",
    kmsDriven: "18,500",
    customerName: "Neha Reddy",
    customerMobile: "+91 9876543213",
    jobType: "Cash",
    advisor: "Vijay Patel",
    technician: "Mohan Singh",
    estimatedCompletion: new Date("2025-12-11"),
    arrivalDate: new Date("2025-12-09"),
    status: "In-Progress",
    currentStage: "Painting",
    completedStages: ["Job Created", "Estimate Prepared", "Estimate Approved", "Parts Ordered", "Work in Progress"],
    photos: [],
    notes: [],
    callLogs: [],
    services: [{id: "s4", name: "Detailing", description: "Full car detailing", estimatedCost: 8000, status: "In Progress"}],
    activityLog: [{id: "a5", action: "Job created", timestamp: new Date("2025-12-09"), user: "System"}],
    createdAt: new Date("2025-12-09"),
    updatedAt: new Date("2025-12-09")
  },
  {
    id: "5",
    jobCardNumber: "BS-2025-005",
    regNo: "DL7BPQ7890",
    model: "Toyota Fortuner",
    color: "Super White",
    fuelType: "Diesel",
    year: "2021",
    kmsDriven: "42,300",
    customerName: "Vikram Singh",
    customerMobile: "+91 9876543214",
    jobType: "Insurance",
    advisor: "Amit Singh",
    technician: "Suresh Yadav",
    estimatedCompletion: new Date("2025-12-16"),
    arrivalDate: new Date("2025-12-05"),
    insuranceCompany: "ICICI Lombard",
    claimNumber: "CLM2025005678",
    surveyorName: "Ajay Kumar",
    approvedAmount: 55000,
    status: "Completed",
    currentStage: "Completed",
    completedStages: ["Job Created", "Estimate Prepared", "Estimate Sent", "Estimate Approved", "Parts Ordered", "Work in Progress", "Painting", "Quality Check", "Ready for Delivery", "Completed"],
    photos: [],
    notes: [],
    callLogs: [],
    services: [{id: "s5", name: "Full Body Paint", description: "Complete repainting", estimatedCost: 55000, status: "Completed"}],
    activityLog: [{id: "a6", action: "Job completed", timestamp: new Date("2025-12-09"), user: "Amit Singh"}],
    createdAt: new Date("2025-12-05"),
    updatedAt: new Date("2025-12-09")
  },
  {
    id: "6",
    jobCardNumber: "BS-2025-006",
    regNo: "MH12GH4567",
    model: "Mahindra XUV700 AX7",
    color: "Dazzling Silver",
    fuelType: "Diesel",
    year: "2023",
    kmsDriven: "12,000",
    customerName: "Sunita Kapoor",
    customerMobile: "+91 9876543215",
    jobType: "Cash",
    advisor: "Rajesh Kumar",
    estimatedCompletion: new Date("2025-12-12"),
    arrivalDate: new Date("2025-12-08"),
    status: "In-Progress",
    currentStage: "Work in Progress",
    completedStages: ["Job Created", "Estimate Prepared", "Estimate Approved"],
    photos: [],
    notes: [],
    callLogs: [],
    services: [{id: "s6", name: "Engine Check", description: "Full engine diagnostics", estimatedCost: 18000, status: "In Progress"}],
    activityLog: [{id: "a7", action: "Job created", timestamp: new Date("2025-12-08"), user: "System"}],
    createdAt: new Date("2025-12-08"),
    updatedAt: new Date("2025-12-08")
  },
  {
    id: "7",
    jobCardNumber: "BS-2025-007",
    regNo: "KA03MN8901",
    model: "Kia Seltos HTX",
    color: "Glacier White Pearl",
    fuelType: "Petrol",
    year: "2022",
    kmsDriven: "25,600",
    customerName: "Rahul Verma",
    customerMobile: "+91 9876543216",
    jobType: "Insurance",
    advisor: "Priya Singh",
    estimatedCompletion: new Date("2025-12-14"),
    arrivalDate: new Date("2025-12-09"),
    insuranceCompany: "Bajaj Allianz",
    claimNumber: "CLM2025007890",
    status: "Service",
    currentStage: "Estimate Prepared",
    completedStages: ["Job Created"],
    photos: [],
    notes: [],
    callLogs: [],
    services: [{id: "s7", name: "Accident Repair", description: "Front panel repair", estimatedCost: 32000, status: "Pending"}],
    activityLog: [{id: "a8", action: "Job created", timestamp: new Date("2025-12-09"), user: "System"}],
    createdAt: new Date("2025-12-09"),
    updatedAt: new Date("2025-12-09")
  },
  {
    id: "8",
    jobCardNumber: "BS-2025-008",
    regNo: "RJ14ST2345",
    model: "Maruti Suzuki Baleno Delta",
    color: "Nexa Blue",
    fuelType: "Petrol",
    year: "2021",
    kmsDriven: "35,200",
    customerName: "Pooja Gupta",
    customerMobile: "+91 9876543217",
    jobType: "Cash",
    advisor: "Vijay Patel",
    estimatedCompletion: new Date("2025-12-10"),
    arrivalDate: new Date("2025-12-06"),
    status: "Completed",
    currentStage: "Completed",
    completedStages: ["Job Created", "Estimate Prepared", "Estimate Approved", "Work in Progress", "Quality Check", "Ready for Delivery", "Completed"],
    photos: [],
    notes: [],
    callLogs: [],
    services: [{id: "s8", name: "Interior Cleaning", description: "Deep cleaning", estimatedCost: 6000, status: "Completed"}],
    activityLog: [{id: "a9", action: "Job completed", timestamp: new Date("2025-12-08"), user: "Vijay Patel"}],
    createdAt: new Date("2025-12-06"),
    updatedAt: new Date("2025-12-08")
  },
  {
    id: "9",
    jobCardNumber: "BS-2025-009",
    regNo: "GJ01UV6789",
    model: "Honda Amaze V",
    color: "Golden Brown Metallic",
    fuelType: "Diesel",
    year: "2020",
    kmsDriven: "55,800",
    customerName: "Sandeep Joshi",
    customerMobile: "+91 9876543218",
    jobType: "Warranty",
    advisor: "Rajesh Kumar",
    estimatedCompletion: new Date("2025-12-11"),
    arrivalDate: new Date("2025-12-09"),
    status: "In-Progress",
    currentStage: "Work in Progress",
    completedStages: ["Job Created", "Estimate Prepared"],
    photos: [],
    notes: [],
    callLogs: [],
    services: [{id: "s9", name: "AC Service", description: "AC repair and gas refill", estimatedCost: 12000, status: "In Progress"}],
    activityLog: [{id: "a10", action: "Job created", timestamp: new Date("2025-12-09"), user: "System"}],
    createdAt: new Date("2025-12-09"),
    updatedAt: new Date("2025-12-09")
  },
  {
    id: "10",
    jobCardNumber: "BS-2025-010",
    regNo: "TN09WX0123",
    model: "Hyundai Venue SX",
    color: "Phantom Black",
    fuelType: "Petrol",
    year: "2023",
    kmsDriven: "9,500",
    customerName: "Meena Iyer",
    customerMobile: "+91 9876543219",
    jobType: "Cash",
    advisor: "Amit Singh",
    estimatedCompletion: new Date("2025-12-13"),
    arrivalDate: new Date("2025-12-09"),
    status: "Service",
    currentStage: "Estimate Sent",
    completedStages: ["Job Created", "Estimate Prepared"],
    photos: [],
    notes: [],
    callLogs: [],
    services: [{id: "s10", name: "Scratch Repair", description: "Door panel scratch removal", estimatedCost: 28000, status: "Pending"}],
    activityLog: [{id: "a11", action: "Job created", timestamp: new Date("2025-12-09"), user: "System"}],
    createdAt: new Date("2025-12-09"),
    updatedAt: new Date("2025-12-09")
  }
];

export function BodyshopDataProvider({ children }: { children: ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>(mockJobs);

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
  };

  const updateJob = (id: string, updates: Partial<Job>) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === id
          ? { ...job, ...updates, updatedAt: new Date() }
          : job
      )
    );
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