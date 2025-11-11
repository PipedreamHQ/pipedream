import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "ashby",
  propDefinitions: {
    candidateId: {
      type: "string",
      label: "Candidate ID",
      description: "The ID of the candidate",
      async options({ prevContext: { cursor } }) {
        if (cursor === null) {
          return [];
        }
        const {
          results,
          nextCursor,
        } = await this.listCandidates({
          data: {
            cursor,
          },
        });
        return {
          options: results.map(({
            id: value,
            name: label,
          }) => ({
            label,
            value,
          })),
          context: {
            cursor: nextCursor || null,
          },
        };
      },
    },
    applicationId: {
      type: "string",
      label: "Application ID",
      description: "The ID of the application",
      async options({ prevContext: { cursor } }) {
        if (cursor === null) {
          return [];
        }
        const {
          results,
          nextCursor,
        } = await this.listApplications({
          data: {
            cursor,
          },
        });
        return {
          options: results.map(({
            id: value,
            candidate,
            job,
          }) => ({
            label: candidate?.name && job?.title
              ? `${candidate.name} - ${job.title}`
              : value,
            value,
          })),
          context: {
            cursor: nextCursor || null,
          },
        };
      },
    },
    jobId: {
      type: "string",
      label: "Job ID",
      description: "The ID of the job",
      async options({ prevContext: { cursor } }) {
        if (cursor === null) {
          return [];
        }
        const {
          results,
          nextCursor,
        } = await this.listJobs({
          data: {
            cursor,
          },
        });
        return {
          options: results.map(({
            id: value,
            title: label,
          }) => ({
            label,
            value,
          })),
          context: {
            cursor: nextCursor || null,
          },
        };
      },
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "The first and last name of the candidate to be created.",
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "Number of results to return",
      optional: true,
    },
    interviewPlanId: {
      type: "string",
      label: "Interview Plan ID",
      description: "The ID of the interview plan to place the application in. If none is provided, the default interview plan is used.",
      async options({ prevContext: { cursor } }) {
        if (cursor === null) {
          return [];
        }
        const {
          results,
          nextCursor,
        } = await this.listInterviewPlans({
          data: {
            cursor,
          },
        });
        return {
          options: results.map(({
            id: value,
            title: label,
          }) => ({
            label,
            value,
          })),
          context: {
            cursor: nextCursor || null,
          },
        };
      },
    },
    interviewStageId: {
      type: "string",
      label: "Interview Stage ID",
      description: "The interview stage of the interview plan to place the application in. If none is provided, the application is placed in the first 'Lead' stage. You can also use the special string 'FirstPreInterviewScreen' to choose the first pre-interview-screen stage.",
      async options({ interviewPlanId }) {
        if (!interviewPlanId) {
          return [];
        }
        const { results } = await this.listInterviewStages({
          data: {
            interviewPlanId,
          },
        });
        return results.map(({
          id: value,
          title: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    sourceId: {
      type: "string",
      label: "Source ID",
      description: "The source to set on the application being created",
      async options({ prevContext: { cursor } }) {
        if (cursor === null) {
          return [];
        }
        const {
          results,
          nextCursor,
        } = await this.listSources({
          data: {
            cursor,
          },
        });
        return {
          options: results.map(({
            id: value,
            title: label,
          }) => ({
            label,
            value,
          })),
          context: {
            cursor: nextCursor || null,
          },
        };
      },
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The ID of the user",
      async options({ prevContext: { cursor } }) {
        if (cursor === null) {
          return [];
        }
        const {
          results,
          nextCursor,
        } = await this.listUsers({
          data: {
            cursor,
          },
        });
        return {
          options: results.map(({
            id: value,
            firstName,
            lastName,
            email,
          }) => ({
            label: `${firstName} ${lastName} (${email})`,
            value,
          })),
          context: {
            cursor: nextCursor || null,
          },
        };
      },
    },
    offerProcessId: {
      type: "string",
      label: "Offer Process ID",
      description: "The ID of the offer process associated with the offer you're creating. This ID is included in the response of the [offerProcess.start API](https://developers.ashbyhq.com/reference/offerprocessstart).",
    },
  },
  methods: {
    getAuth() {
      const { api_key: apiKey } = this.$auth;
      return {
        username: apiKey,
        password: "",
      };
    },
    getHeaders() {
      return {
        "accept": "application/json; version=1",
        "content-type": "application/json",
      };
    },
    async makeRequest({
      $ = this, path = "", ...args
    } = {}) {
      try {
        const response = await axios($, {
          url: `https://api.ashbyhq.com${path}`,
          headers: this.getHeaders(),
          auth: this.getAuth(),
          ...args,
        });

        if (!response.success) {
          throw new Error(JSON.stringify(response, null, 2));
        }

        return response;
      } catch (error) {
        throw error.response?.data?.message || error;
      }
    },
    post(args = {}) {
      return this.makeRequest({
        method: "POST",
        ...args,
      });
    },
    createCandidate(args = {}) {
      return this.post({
        path: "/candidate.create",
        ...args,
      });
    },
    listApplications(args = {}) {
      return this.post({
        path: "/application.list",
        ...args,
      });
    },
    listCandidates(args = {}) {
      return this.post({
        path: "/candidate.list",
        ...args,
      });
    },
    listJobs(args = {}) {
      return this.post({
        path: "/job.list",
        ...args,
      });
    },
    createInterviewSchedule(args = {}) {
      return this.post({
        path: "/interviewSchedule.create",
        ...args,
      });
    },
    createOffer(args = {}) {
      return this.post({
        path: "/offer.create",
        ...args,
      });
    },
    startOffer(args = {}) {
      return this.post({
        path: "/offer.start",
        ...args,
      });
    },
    startOfferProcess(args = {}) {
      return this.post({
        path: "/offerProcess.start",
        ...args,
      });
    },
    createApplication(args = {}) {
      return this.post({
        path: "/application.create",
        ...args,
      });
    },
    listInterviewPlans(args = {}) {
      return this.post({
        path: "/interviewPlan.list",
        ...args,
      });
    },
    listInterviewStages(args = {}) {
      return this.post({
        path: "/interviewStage.list",
        ...args,
      });
    },
    listSources(args = {}) {
      return this.post({
        path: "/source.list",
        ...args,
      });
    },
    listUsers(args = {}) {
      return this.post({
        path: "/user.list",
        ...args,
      });
    },
    async paginate({
      max = 600, fn, fnArgs, keyField = "results",
    } = {}) {
      const results = [];
      let cursor;
      let collected = 0;

      while (collected < max) {
        const remainingToFetch = Math.min(max - collected, 100);

        const response = await fn({
          ...fnArgs,
          data: {
            limit: remainingToFetch,
            cursor,
            ...fnArgs?.data,
          },
        });

        const items = response[keyField] || [];
        results.push(...items);
        collected += items.length;

        // Check if there are more results
        cursor = response.nextCursor;
        if (!cursor || items.length === 0) {
          break;
        }
      }

      return results;
    },
  },
};
