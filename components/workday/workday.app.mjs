import { axios } from "@pipedream/platform";
const DEFAULT_LIMIT = 100;

export default {
  type: "app",
  app: "workday",
  propDefinitions: {
    workerId: {
      type: "string",
      label: "Worker ID",
      description: "The ID of a worker",
      async options({ page }) {
        const { data } = await this.listWorkers({
          params: {
            limit: DEFAULT_LIMIT,
            offset: page * DEFAULT_LIMIT,
          },
        });
        return data?.map((worker) => ({
          label: worker.descriptor,
          value: worker.id,
        })) || [];
      },
    },
    supervisoryOrganizationId: {
      type: "string",
      label: "Supervisory Organization ID",
      description: "The ID of a supervisory organization",
      async options({ page }) {
        const { data } = await this.listSupervisoryOrganizations({
          params: {
            limit: DEFAULT_LIMIT,
            offset: page * DEFAULT_LIMIT,
          },
        });
        return data?.map((organization) => ({
          label: organization.descriptor,
          value: organization.id,
        })) || [];
      },
    },
    jobChangeReasonId: {
      type: "string",
      label: "Job Change Reason ID",
      description: "The ID of a job change reason",
      async options({ page }) {
        const { data } = await this.listJobChangeReasons({
          params: {
            limit: DEFAULT_LIMIT,
            offset: page * DEFAULT_LIMIT,
          },
        });
        return data?.map((reason) => ({
          label: reason.descriptor,
          value: reason.id,
        })) || [];
      },
    },
    homeContactInformationChangeId: {
      type: "string",
      label: "Home Contact Information Change ID",
      description: "The ID of a home contact information change event.",
      async options({ page }) {
        const { data } = await this.listHomeContactInformationChanges({
          params: {
            limit: DEFAULT_LIMIT,
            offset: page * DEFAULT_LIMIT,
          },
        });
        return data?.map((change) => ({
          label: change.descriptor || change.id,
          value: change.id,
        })) || [];
      },
    },
    workContactInformationChangeId: {
      type: "string",
      label: "Work Contact Information Change ID",
      description: "The ID of a specific work contact information change event in Workday.",
      async options({ page }) {
        const { data } = await this.listWorkContactInformationChanges({
          params: {
            limit: 50,
            offset: page * 50,
          },
        });
        return (data || []).map((item) => ({
          label: item?.descriptor || item?.id || String(item),
          value: item?.id || String(item),
        }));
      },
    },
    jobPostingId: {
      type: "string",
      label: "Job Posting ID",
      description: "The ID of the job posting.",
      async options({ page }) {
        const res = await this.listJobPostings({
          params: {
            limit: 50,
            offset: 50 * page,
          },
        });
        return (res.data || []).map((posting) => ({
          label: posting?.descriptor || posting?.id || String(posting),
          value: posting?.id || String(posting),
        }));
      },
    },
    prospectId: {
      type: "string",
      label: "Prospect ID",
      description: "The ID of the prospect.",
      async options({ page }) {
        const res = await this.listProspects({
          params: {
            limit: 50,
            offset: 50 * page,
          },
        });
        return (res.data || []).map((prospect) => ({
          label: prospect?.descriptor || prospect?.id || String(prospect),
          value: prospect?.id || String(prospect),
        }));
      },
    },
    personId: {
      type: "string",
      label: "Person ID",
      description: "The ID of a person record in Workday.",
      async options({ page }) {
        const { data } = await this.listPeople({
          params: {
            limit: DEFAULT_LIMIT,
            offset: page * DEFAULT_LIMIT,
          },
        });
        return data?.map((person) => ({
          label: person.descriptor || person.id,
          value: person.id,
        })) || [];
      },
    },
    jobChangeId: {
      type: "string",
      label: "Job Change ID",
      description: "The Workday Job Change ID to retrieve details for.",
      async options({ page }) {
        const { data } = await this.listJobChanges({
          params: {
            limit: 50,
            offset: page * 50,
          },
        });
        return (data || []).map((jobChange) => ({
          label: jobChange?.descriptor || jobChange?.id || String(jobChange),
          value: jobChange?.id || String(jobChange),
        }));
      },
    },
    jobFamilyId: {
      type: "string",
      label: "Job Family ID",
      description: "The Workday Job Family ID.",
      async options({ page }) {
        const res = await this.listJobFamilies({
          params: {
            limit: 50,
            offset: page * 50,
          },
        });
        return (res.data || []).map((jf) => ({
          label: jf?.descriptor || jf?.id || String(jf),
          value: jf?.id || String(jf),
        }));
      },
    },
    jobProfileId: {
      type: "string",
      label: "Job Profile ID",
      description: "The Workday Job Profile ID.",
      async options({ page }) {
        const res = await this.listJobProfiles({
          params: {
            limit: 50,
            offset: page * 50,
          },
        });
        return (res.data || []).map((jp) => ({
          label: jp?.descriptor || jp?.id || String(jp),
          value: jp?.id || String(jp),
        }));
      },
    },
    jobId: {
      type: "string",
      label: "Job ID",
      description: "Workday Job ID.",
      async options({ page }) {
        const res = await this.listJobs({
          params: {
            limit: 50,
            offset: page * 50,
          },
        });
        return (res.data || []).map((j) => ({
          label: j?.descriptor || j?.id,
          value: j?.id,
        }));
      },
    },
    organizationAssignmentChangeId: {
      type: "string",
      label: "Organization Assignment Change ID",
      description: "ID for Organization Assignment Change.",
      async options({ page }) {
        const res = await this.listOrganizationAssignmentChanges({
          params: {
            limit: 50,
            offset: page * 50,
          },
        });
        return (res.data || []).map((c) => ({
          label: c?.descriptor || c?.id,
          value: c?.id,
        }));
      },
    },
    mentorshipId: {
      type: "string",
      label: "Mentorship ID",
      description: "The ID of the mentorship.",
      async options({ page }) {
        const res = await this.listMentorships({
          params: {
            limit: 50,
            offset: page * 50,
          },
        });
        return (res.data || []).map((m) => ({
          label: m?.descriptor || m?.id || String(m),
          value: m?.id || String(m),
        }));
      },
    },
    successionPlanId: {
      type: "string",
      label: "Succession Plan ID",
      description: "The ID of the succession plan.",
      async options({ page }) {
        const res = await this.listSuccessionPlans({
          params: {
            limit: 50,
            offset: page * 50,
          },
        });
        return (res.data || []).map((p) => ({
          label: p?.descriptor || p?.id || String(p),
          value: p?.id || String(p),
        }));
      },
    },
    contentId: {
      type: "string",
      label: "Content ID",
      description: "The ID of the learning content.",
      async options({ page }) {
        const res = await this.listContent({
          params: {
            limit: 50,
            offset: page * 50,
          },
        });
        return (res.data || []).map((c) => ({
          label: c?.descriptor || c?.id || String(c),
          value: c?.id || String(c),
        }));
      },
    },
    minimumWageRateId: {
      type: "string",
      label: "Minimum Wage Rate ID",
      description: "The ID of the minimum wage rate.",
      async options({ page }) {
        const res = await this.listMinimumWageRates({
          params: {
            limit: 50,
            offset: page * 50,
          },
        });
        return (res.data || []).map((rate) => ({
          label: rate?.descriptor || rate?.id || String(rate),
          value: rate?.id || String(rate),
        }));
      },
    },
    payGroupDetailId: {
      type: "string",
      label: "Pay Group Detail ID",
      description: "The ID of the pay group detail.",
      async options({ page }) {
        const res = await this.listPayGroupDetails({
          params: {
            limit: 50,
            offset: page * 50,
          },
        });
        return (res.data || []).map((pg) => ({
          label: pg?.descriptor || pg?.id || String(pg),
          value: pg?.id || String(pg),
        }));
      },
    },
    payrollInputId: {
      type: "string",
      label: "Payroll Input ID",
      description: "The ID of the payroll input.",
      async options({ page }) {
        const res = await this.listPayrollInputs({
          params: {
            limit: 50,
            offset: page * 50,
          },
        });
        return (res.data || []).map((input) => ({
          label: input?.descriptor || input?.id || String(input),
          value: input?.id || String(input),
        }));
      },
    },
    payGroupId: {
      type: "string",
      label: "Pay Group ID",
      description: "The ID of the pay group.",
      async options({ page }) {
        const res = await this.listPayGroups({
          params: {
            limit: 50,
            offset: page * 50,
          },
        });
        return (res.data || []).map((pg) => ({
          label: pg?.descriptor || pg?.id || String(pg),
          value: pg?.id || String(pg),
        }));
      },
    },
    feedbackBadgeId: {
      type: "string",
      label: "Feedback Badge ID",
      description: "The ID of the feedback badge.",
      async options({ page }) {
        const res = await this.listFeedbackBadges({
          params: {
            limit: 50,
            offset: 50 * page,
          },
        });
        return (res.data || []).map((badge) => ({
          label: badge?.descriptor || badge?.id || String(badge),
          value: badge?.id || String(badge),
        }));
      },
    },
    giveRequestedFeedbackEventId: {
      type: "string",
      label: "Requested Feedback Event ID",
      description: "The ID of the give requested feedback event.",
      async options({ page }) {
        const res = await this.listGiveRequestedFeedbackEvents({
          params: {
            limit: 50,
            offset: 50 * page,
          },
        });
        return (res.data || []).map((event) => ({
          label: event?.descriptor || event?.id || String(event),
          value: event?.id || String(event),
        }));
      },
    },
    interviewId: {
      type: "string",
      label: "Interview ID",
      description: "The ID of the interview.",
      async options({ page }) {
        const res = await this.listInterviews?.({
          params: {
            limit: 50,
            offset: 50 * page,
          },
        }) || {
          data: [],
        };
        return (res.data || []).map((i) => ({
          label: i.descriptor || i.id,
          value: i.id,
        }));
      },
    },

    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of results to return",
      optional: true,
      default: 100,
    },
  },
  methods: {
    _baseUrl() {
      return this.$auth.rest_api_endpoint;
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
        ...opts,
      });
    },
    getWorker({
      workerId, ...opts
    }) {
      return this._makeRequest({
        path: `/workers/${workerId}`,
        ...opts,
      });
    },
    listWorkers(opts = {}) {
      return this._makeRequest({
        path: "/workers",
        ...opts,
      });
    },
    listOrganizationTypes(opts = {}) {
      return this._makeRequest({
        path: "/organizationTypes",
        ...opts,
      });
    },
    listSupervisoryOrganizations(opts = {}) {
      return this._makeRequest({
        path: "/supervisoryOrganizations",
        ...opts,
      });
    },
    listJobChangeReasons(opts = {}) {
      return this._makeRequest({
        path: "/jobChangeReasons",
        ...opts,
      });
    },
    listWorkerPayslips({
      workerId, ...opts
    }) {
      return this._makeRequest({
        path: `/workers/${workerId}/paySlips`,
        ...opts,
      });
    },
    createJobChange({
      workerId, ...opts
    }) {
      return this._makeRequest({
        path: `/workers/${workerId}/jobChanges`,
        method: "POST",
        ...opts,
      });
    },
    changeBusinessTitle({
      workerId, ...opts
    }) {
      return this._makeRequest({
        path: `/workers/${workerId}/businessTitleChanges`,
        method: "POST",
        ...opts,
      });
    },
    listHomeContactInformationChanges(opts = {}) {
      return this._makeRequest({
        path: "/homeContactInformationChanges",
        ...opts,
      });
    },
    getHomeContactInformationChange({
      homeContactInformationChangeId, ...opts
    }) {
      return this._makeRequest({
        path: `/homeContactInformationChanges/${homeContactInformationChangeId}`,
        ...opts,
      });
    },

    async createHomeContactInformationChange({
      workerId, ...opts
    }) {
      return this._makeRequest({
        path: `/workers/${workerId}/homeContactInformationChanges`,
        method: "POST",
        ...opts,
      });
    },

    listPeople(opts = {}) {
      return this._makeRequest({
        path: "/people",
        ...opts,
      });
    },

    getPerson({
      id, ...opts
    }) {
      return this._makeRequest({
        path: `/people/${id}`,
        ...opts,
      });
    },

    getPersonPhoto({
      id, ...opts
    }) {
      return this._makeRequest({
        path: `/people/${id}/photos`,
        ...opts,
      });
    },

    validatePhoneNumber(opts = {}) {
      return this._makeRequest({
        path: "/phoneValidation/validate",
        method: "POST",
        ...opts,
      });
    },
    listWorkContactInformationChanges(opts = {}) {
      return this._makeRequest({
        path: "/workContactInformationChanges",
        method: "GET",
        ...opts,
      });
    },
    getWorkContactInformationChange({
      id, ...opts
    }) {
      return this._makeRequest({
        path: `/workContactInformationChanges/${id}`,
        method: "GET",
        ...opts,
      });
    },

    async createWorkContactInformationChange({
      workerId, ...opts
    }) {
      return this._makeRequest({
        path: `/workers/${workerId}/workContactInformationChanges`,
        method: "POST",
        ...opts,
      });
    },

    updateWorkContactInformationChange({
      id, ...opts
    }) {
      return this._makeRequest({
        path: `/workContactInformationChanges/${id}`,
        method: "PATCH",
        ...opts,
      });
    },
    listInterviews(opts = {}) {
      return this._makeRequest({
        path: "/interviews",
        method: "GET",
        ...opts,
      });
    },
    getInterview({
      id, ...opts
    }) {
      return this._makeRequest({
        path: `/interviews/${id}`,
        method: "GET",
        ...opts,
      });
    },
    async listJobPostings(opts = {}) {
      return this._makeRequest({
        path: "/jobPostings",
        method: "GET",
        ...opts,
      });
    },

    async getJobPosting({
      id, ...opts
    }) {
      return this._makeRequest({
        path: `/jobPostings/${id}`,
        method: "GET",
        ...opts,
      });
    },
    getProspect({
      id, ...opts
    }) {
      return this._makeRequest({
        path: `/prospects/${id}`,
        method: "GET",
        ...opts,
      });
    },
    createProspect(opts = {}) {
      return this._makeRequest({
        path: "/prospects",
        method: "POST",
        ...opts,
      });
    },
    async listProspects(opts = {}) {
      return this._makeRequest({
        path: "/prospects",
        method: "GET",
        ...opts,
      });
    },

    getJobChangeDetails({
      id, ...opts
    }) {
      return this._makeRequest({
        path: `/jobChanges/${id}`,
        method: "GET",
        ...opts,
      });
    },
    listJobChanges(opts = {}) {
      return this._makeRequest({
        path: "/jobChanges",
        method: "GET",
        ...opts,
      });
    },
    listJobFamilies(opts = {}) {
      return this._makeRequest({
        path: "/jobFamilies",
        method: "GET",
        ...opts,
      });
    },

    getJobFamily({
      id, ...opts
    }) {
      return this._makeRequest({
        path: `/jobFamilies/${id}`,
        method: "GET",
        ...opts,
      });
    },
    listJobProfiles(opts = {}) {
      return this._makeRequest({
        path: "/jobProfiles",
        method: "GET",
        ...opts,
      });
    },
    getJobProfile({
      id, ...opts
    }) {
      return this._makeRequest({
        path: `/jobProfiles/${id}`,
        method: "GET",
        ...opts,
      });
    },
    listJobs(opts = {}) {
      return this._makeRequest({
        path: "/jobs",
        method: "GET",
        ...opts,
      });
    },
    getJob({
      id, ...opts
    }) {
      return this._makeRequest({
        path: `/jobs/${id}`,
        method: "GET",
        ...opts,
      });
    },

    listOrganizationAssignmentChanges(opts = {}) {
      return this._makeRequest({
        path: "/organizationAssignmentChanges",
        method: "GET",
        ...opts,
      });
    },
    getOrganizationAssignmentChange({
      id, ...opts
    }) {
      return this._makeRequest({
        path: `/organizationAssignmentChanges/${id}`,
        method: "GET",
        ...opts,
      });
    },
    createOrganizationAssignmentChange(opts = {}) {
      return this._makeRequest({
        path: "/organizationAssignmentChanges",
        method: "POST"
        , ...opts,
      });
    },
    getSupervisoryOrganization({
      id, ...opts
    }) {
      return this._makeRequest({
        path: `/supervisoryOrganizations/${id}`,
        method: "GET",
        ...opts,
      });
    },
    getSupervisoryOrganizationMembers({
      id, ...opts
    }) {
      return this._makeRequest({
        path: `/supervisoryOrganizations/${id}/members`,
        method: "GET",
        ...opts,
      });
    },
    async getWorkerGoals({
      id, ...opts
    }) {
      return this._makeRequest({
        path: `/workers/${id}/goals`,
        method: "GET",
        ...opts,
      });
    },

    async getWorkerAnytimeFeedbackEvents({
      id, ...opts
    }) {
      return this._makeRequest({
        path: `/workers/${id}/anytimeFeedbackEvents`,
        method: "GET",
        ...opts,
      });
    },
    async createMentorshipForMe(opts = {}) {
      return this._makeRequest({
        path: "/createMentorshipForMe",
        method: "POST",
        ...opts,
      });
    },
    async createMentorshipForWorker(opts = {}) {
      return this._makeRequest({
        path: "/createMentorshipForWorker",
        method: "POST",
        ...opts,
      });
    },
    async listMentorships(opts = {}) {
      return this._makeRequest({
        path: "/mentorships",
        method: "GET",
        ...opts,
      });
    },
    async getMentorship({
      id, ...opts
    }) {
      return this._makeRequest({
        path: `/mentorships/${id}`,
        method: "GET",
        ...opts,
      });
    },
    async updateMentorship({
      id, data, ...opts
    }) {
      return this._makeRequest({
        path: `/mentorships/${id}/edit`,
        method: "POST",
        data,
        ...opts,
      });
    },
    async closeMentorship({
      id, data, ...opts
    }) {
      return this._makeRequest({
        path: `/mentorships/${id}/close`,
        method: "POST",
        data,
        ...opts,
      });
    },
    async createSuccessionPlan(opts = {}) {
      return this._makeRequest({
        path: "/successionPlans",
        method: "POST",
        ...opts,
      });
    },
    async listSuccessionPlans(opts = {}) {
      return this._makeRequest({
        path: "/successionPlans",
        method: "GET",
        ...opts,
      });
    },
    async getSuccessionPlan({
      id, ...opts
    }) {
      return this._makeRequest({
        path: `/successionPlans/${id}`,
        method: "GET",
        ...opts,
      });
    },
    async listHolidayEvents(opts = {}) {
      return this._makeRequest({
        path: "/holidayEvents",
        method: "GET",
        ...opts,
      });
    },
    async listContent(opts = {}) {
      return this._makeRequest({
        path: "/content",
        method: "GET",
        ...opts,
      });
    },

    async getContent({
      id, ...opts
    }) {
      return this._makeRequest({
        path: `/content/${id}`,
        method: "GET",
        ...opts,
      });
    },
    async createDigitalCourse(opts = {}) {
      return this._makeRequest({
        path: "/manageDigitalCourses",
        method: "POST",
        ...opts,
      });
    },
    async getJobPayGroup({
      id, ...opts
    }) {
      return this._makeRequest({
        path: `/jobs/${id}/payGroup`,
        method: "GET",
        ...opts,
      });
    },
    async listMinimumWageRates(opts = {}) {
      return this._makeRequest({
        path: "/minimumWageRates",
        method: "GET",
        ...opts,
      });
    },

    async getMinimumWageRate({
      id, ...opts
    }) {
      return this._makeRequest({
        path: `/minimumWageRates/${id}`,
        method: "GET",
        ...opts,
      });
    },
    async listPayGroupDetails(opts = {}) {
      return this._makeRequest({
        path: "/payGroupDetails",
        method: "GET",
        ...opts,
      });
    },

    async getPayGroupDetail({
      id, ...opts
    }) {
      return this._makeRequest({
        path: `/payGroupDetails/${id}`,
        method: "GET",
        ...opts,
      });
    },
    async listPayGroups(opts = {}) {
      return this._makeRequest({
        path: "/payGroups",
        method: "GET",
        ...opts,
      });
    },

    async getPayGroup({
      id, ...opts
    }) {
      return this._makeRequest({
        path: `/payGroups/${id}`,
        method: "GET",
        ...opts,
      });
    },
    async createPayrollInput(opts = {}) {
      return this._makeRequest({
        path: "/payrollInputs",
        method: "POST",
        ...opts,
      });
    },
    async listPayrollInputs(opts = {}) {
      return this._makeRequest({
        path: "/payrollInputs",
        method: "GET",
        ...opts,
      });
    },

    async getPayrollInput({
      id, ...opts
    }) {
      return this._makeRequest({
        path: `/payrollInputs/${id}`,
        method: "GET",
        ...opts,
      });
    },
    async updatePayrollInput({
      id, data, ...opts
    }) {
      return this._makeRequest({
        path: `/payrollInputs/${id}`,
        method: "PATCH",
        data,
        ...opts,
      });
    },
    async deletePayrollInput({
      id, ...opts
    }) {
      return this._makeRequest({
        path: `/payrollInputs/${id}`,
        method: "DELETE",
        ...opts,
      });
    },
    async createTaxRate(opts = {}) {
      return this._makeRequest({
        path: "/taxRates",
        method: "POST",
        ...opts,
      });
    },
    async listTaxRates(opts = {}) {
      return this._makeRequest({
        path: "/taxRates",
        method: "GET",
        ...opts,
      });
    },
    async listFeedbackBadges(opts = {}) {
      return this._makeRequest({
        path: "/feedbackBadges",
        method: "GET",
        ...opts,
      });
    },

    async getFeedbackBadge({
      id, ...opts
    }) {
      return this._makeRequest({
        path: `/feedbackBadges/${id}`,
        method: "GET",
        ...opts,
      });
    },
    async listGiveRequestedFeedbackEvents(opts = {}) {
      return this._makeRequest({
        path: "/giveRequestedFeedbackEvents",
        method: "GET",
        ...opts,
      });
    },

    async getGiveRequestedFeedbackEvent({
      id, ...opts
    }) {
      return this._makeRequest({
        path: `/giveRequestedFeedbackEvents/${id}`,
        method: "GET",
        ...opts,
      });
    },

    async *paginate({
      fn, args = {}, max,
    }) {
      args = {
        ...args,
        params: {
          ...args?.params,
          limit: DEFAULT_LIMIT,
          offset: 0,
        },
      };
      let hasMore, count = 0;
      do {
        const {
          data, total,
        } = await fn(args);
        if (!data?.length) {
          return;
        }
        for (const item of data) {
          yield item;
          count++;
          if (max && count >= max) {
            return;
          }
        }
        hasMore = count < total;
        args.params.offset += args.params.limit;
      } while (hasMore);
    },
  },
};
