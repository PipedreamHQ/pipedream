import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "connecteam",
  propDefinitions: {
    schedulerId: {
      type: "string",
      label: "Scheduler ID",
      description: "The ID of the scheduler",
      async options() {
        const schedulers = await this.getSchedulers();
        return schedulers.map((scheduler) => ({
          label: scheduler.name,
          value: scheduler.schedulerId,
        }));
      },
    },
    jobId: {
      type: "string",
      label: "Job ID",
      description: "The ID of the job",
      async options() {
        const jobs = await this.getJobs();
        return jobs.map((job) => ({
          label: job.title,
          value: job.jobId,
        }));
      },
    },
    assignedUserIds: {
      type: "string[]",
      label: "Assigned User IDs",
      description: "The IDs of the assigned users",
      async options() {
        const users = await this.getUsers();
        return users.map((user) => ({
          label: `${user.firstName} ${user.lastName}`,
          value: user.userId,
        }));
      },
    },
    userType: {
      type: "string",
      label: "User Type",
      description: "The type of the user",
      options: [
        "user",
        "manager",
        "owner",
      ],
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.connecteam.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path, headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async getSchedulers() {
      return this._makeRequest({
        path: "/scheduler/v1/schedulers",
      });
    },
    async getJobs() {
      return this._makeRequest({
        path: "/jobs/v1/jobs",
      });
    },
    async getUsers() {
      return this._makeRequest({
        path: "/users/v1/users",
      });
    },
    async createShift(data) {
      const {
        schedulerId, ...otherData
      } = data;
      return this._makeRequest({
        method: "POST",
        path: `/scheduler/v1/schedulers/${schedulerId}/shifts`,
        data: otherData,
      });
    },
    async deleteShift({
      schedulerId, shiftId,
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/scheduler/v1/schedulers/${schedulerId}/shifts/${shiftId}`,
      });
    },
    async createUser(data) {
      return this._makeRequest({
        method: "POST",
        path: "/users/v1/users",
        data,
      });
    },
    async emitNewFormSubmission() {
      // Implementation for emitting new form submission event
    },
    async emitNewUser() {
      // Implementation for emitting new user event
    },
    async emitNewShifts(schedulerId) {
      // Implementation for emitting new shifts event
    },
  },
};
