// GET /user/repos 422s on `type` + `visibility`/`affiliation`; send `type` as its equivalent.
const USER_REPO_TYPE_PARAMS = {
  all: {},
  owner: {
    affiliation: "owner",
  },
  member: {
    affiliation: "collaborator",
  },
  public: {
    visibility: "public",
  },
  private: {
    visibility: "private",
  },
};

export default {
  PER_PAGE_MAX: 100,
  DEFAULT_MAX_RESULTS: 100,
  MAX_RESULTS_MAX: 1000,
  USER_REPO_TYPE_PARAMS,
};
