import timing from "../../timing.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "timing-start-timer",
  name: "Start Timer",
  description: "Starts a new ongoing timer as per the current timestamp. No props required.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    timing,
    userCredentials: {
      type: "object",
      label: "User Credentials",
      description: "User credentials",
      required: true,
    },
    timerInfo: {
      type: "object",
      label: "Timer Info",
      description: "Information about the timer",
      optional: true,
    },
    timeEntryInfo: {
      type: "object",
      label: "Time Entry Info",
      description: "Information about the time entry",
      optional: true,
    },
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The ID of the project",
      optional: true,
    },
    startTime: {
      type: "string",
      label: "Start Time",
      description: "The start time for the time entry",
      optional: true,
    },
    endTime: {
      type: "string",
      label: "End Time",
      description: "The end time for the time entry",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Additional details for the time entry",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://web.timingapp.com/api/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.userCredentials.token}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      });
    },
    async emitNewProjectEvent() {
      this.$emit(this.userCredentials, {
        summary: "New project created",
      });
    },
    async emitNewTimerEvent() {
      this.$emit({
        ...this.userCredentials,
        ...this.timerInfo,
      }, {
        summary: "New timer started",
      });
    },
    async emitNewTimeEntryEvent() {
      this.$emit({
        ...this.userCredentials,
        ...this.timeEntryInfo,
      }, {
        summary: "New time entry created",
      });
    },
    async startNewTimer() {
      const response = await this._makeRequest({
        method: "POST",
        path: "/time-entries/start",
      });
      return response;
    },
    async stopActiveTimer() {
      const response = await this._makeRequest({
        method: "PUT",
        path: "/time-entries/stop",
      });
      return response;
    },
    async createNewTimeEntry() {
      const response = await this._makeRequest({
        method: "POST",
        path: "/time-entries",
        data: {
          project: this.projectId,
          start_date: this.startTime,
          end_date: this.endTime,
          description: this.description,
        },
      });
      return response;
    },
  },
  async run({ $ }) {
    const response = await this.timing.startNewTimer();
    $.export("$summary", "Successfully started new timer");
    return response;
  },
};
