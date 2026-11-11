// Job types accepted by POST /projects/{projectKey}/jobs
// https://doc.dataiku.com/dss/api/15/rest/#jobs-jobs-post
export const BUILD_TYPES = [
  "RECURSIVE_BUILD",
  "NON_RECURSIVE_FORCED_BUILD",
  "RECURSIVE_FORCED_BUILD",
  "RECURSIVE_MISSING_ONLY_BUILD",
];
