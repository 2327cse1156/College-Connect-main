export const API_ROUTES = {
  AUTH: {
    LOGIN: "/auth/login",
    SIGNUP: "/auth/signup",
    LOGOUT: "/auth/logout",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
  },
  PROFILE: "/profile",
  ADMIN: {
    PENDING_USERS: "/admin/pending-users",
    APPROVE: (userId: string) => `/admin/approve/${userId}`,
    REJECT: (userId: string) => `/admin/reject/${userId}`,
    STATS: "/admin/stats",
    USERS: "/admin/users",
  },
  HACKATHONS: {
    LIST: "/hackathons",
    DETAIL: (id: string) => `/hackathons/${id}`,
    REGISTER: (id: string) => `/hackathons/${id}/register`,
    UNREGISTER: (id: string) => `/hackathons/${id}/unregister`,
  },
  RESOURCES: {
    LIST: "/resources",
    DETAIL: (id: string) => `/resources/${id}`,
    LIKE: (id: string) => `/resources/${id}/like`,
    DOWNLOAD: (id: string) => `/resources/${id}/download`,
    COMMENT: (id: string) => `/resources/${id}/comment`,
    STATS: "/resources/stats",
  },
  TEAM_BUILDER: {
    LIST: "/team-builder",
    DETAIL: (id: string) => `/team-builder/${id}`,
    APPLY: (id: string) => `/team-builder/${id}/apply`,
    MY_REQUESTS: "/team-builder/my/requests",
    MY_APPLICATIONS: "/team-builder/my/applications",
  },
  NETWORK: {
    ALUMNI: "/network/alumni",
    SENIORS: "/network/seniors",
    MENTORS: "/network/mentors",
    STATS: "/network/stats",
    USER_PROFILE: (userId: string) => `/network/user/${userId}`,
  },
};

export const FILE_CONSTRAINTS = {
  RESOURCE: {
    MAX_SIZE_MB: 50,
    MAX_SIZE_BYTES: 50 * 1024 * 1024,
    ALLOWED_TYPES: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
      "image/jpg",
      "application/zip",
    ],
    ALLOWED_EXTENSIONS: ["pdf", "doc", "docx", "jpg", "jpeg", "png", "zip"],
  },
  IMAGE: {
    MAX_SIZE_MB: 5,
    MAX_SIZE_BYTES: 5 * 1024 * 1024,
    ALLOWED_TYPES: ["image/jpeg", "image/png", "image/jpg", "image/webp"],
    ALLOWED_EXTENSIONS: ["jpg", "jpeg", "png", "webp"],
  },
  STUDENT_ID: {
    MAX_SIZE_MB: 5,
    MAX_SIZE_BYTES: 5 * 1024 * 1024,
    ALLOWED_TYPES: ["image/jpeg", "image/png", "image/jpg", "application/pdf"],
    ALLOWED_EXTENSIONS: ["jpg", "jpeg", "png", "pdf"],
  },
};

export const RESOURCE_CATEGORIES = [
  "Notes",
  "Books",
  "Projects",
  "Tutorials",
  "Interview Prep",
  "Research Papers",
  "Other",
] as const;

export type ResourceCategory = (typeof RESOURCE_CATEGORIES)[number];

export const EVENT_TYPES = [
  "hackathon",
  "project",
  "competition",
  "other",
] as const;

export type EventType = (typeof EVENT_TYPES)[number];

export const USER_ROLES = {
  STUDENT: "student",
  SENIOR: "senior",
  ALUMNI: "alumni",
  ADMIN: "admin",
} as const;

export const VERIFICATION_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const;

export const HACKATHON_TYPES = ["In-Person", "Online", "Hybrid"] as const;

export type HackathonType = (typeof HACKATHON_TYPES)[number];

export const SORT_OPTIONS = {
  RECENT: "recent",
  POPULAR: "popular",
  LIKED: "liked",
  CLOSING: "closing",
} as const;

export const ALLOWED_COLLEGE_DOMAINS = [
  'kiet.edu',
  'students.kiet.edu',
  'iit.edu',
  'nit.edu',
  'college.edu',
  'students.college.edu',
];

export const TOAST_CONFIG = {
  SUCCESS_DURATION: 3000,
  ERROR_DURATION: 4000,
  LOADING_DURATION: 2000,
};

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
};

export const STORAGE_KEYS = {
  TEAM_BUILDER_BOOKMARKS: 'teamBuilderBookmarks',
  THEME: 'theme',
  LAST_VISITED: 'lastVisited',
}