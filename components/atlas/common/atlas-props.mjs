// Reusable prop definitions
export const atlasProps = {
  apiKey: {
    type: "string",
    label: "ATLAS API Key",
    description: "Your ATLAS API key from atlas.workland.com dashboard (leave empty to use username/password)",
    secret: true,
    optional: true,
  },
  username: {
    type: "string", 
    label: "Username",
    description: "Your ATLAS username (required if no API key provided)",
    optional: true,
  },
  password: {
    type: "string",
    label: "Password", 
    description: "Your ATLAS password (required if no API key provided)",
    secret: true,
    optional: true,
  },
  baseUrl: {
    type: "string",
    label: "Base URL",
    description: "ATLAS API base URL",
    default: "https://public-apis-prod.workland.com/api",
    optional: true,
  },
  authUrl: {
    type: "string",
    label: "Auth URL",
    description: "ATLAS Auth base URL",
    default: "https://user-accounts-prod.workland.com/api/v1",
    optional: true,
  },
};

// Job-specific props
export const jobProps = {
  limit: {
    type: "integer",
    label: "Limit",
    description: "Maximum number of jobs to retrieve",
    default: 500,
    optional: true,
  },
  offset: {
    type: "integer",
    label: "Offset",
    description: "Number of jobs to skip (for pagination)",
    default: 0,
    optional: true,
  },
  status: {
    type: "string",
    label: "Job Status",
    description: "Filter jobs by status",
    optional: true,
    options: [
      "active",
      "inactive", 
      "draft",
      "closed",
    ],
  },
};

// Candidate-specific props
export const candidateProps = {
  limit: {
    type: "integer",
    label: "Limit",
    description: "Maximum number of candidates to retrieve",
    default: 100,
    optional: true,
  },
  stage: {
    type: "string",
    label: "Candidate Stage",
    description: "Filter candidates by stage",
    optional: true,
    options: [
      "applied",
      "screening",
      "interview",
      "offer",
      "hired",
      "rejected",
    ],
  },
};