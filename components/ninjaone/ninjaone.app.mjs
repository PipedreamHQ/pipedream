import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "ninjaone",
  propDefinitions: {
    ticketPriority: {
      type: "string",
      label: "Ticket Priority",
      description: "Filter support tickets by priority",
      async options() {
        const priorities = await this.getTicketPriorities();
        return priorities.map((priority) => ({
          label: priority.name,
          value: priority.id,
        }));
      },
    },
    ticketStatus: {
      type: "string",
      label: "Ticket Status",
      description: "Filter support tickets by status",
      async options() {
        const statuses = await this.getTicketStatuses();
        return statuses.map((status) => ({
          label: status.name,
          value: status.id,
        }));
      },
    },
    deviceGroup: {
      type: "string",
      label: "Device Group",
      description: "Specify the device group to monitor",
      async options() {
        const groups = await this.getDeviceGroups();
        return groups.map((group) => ({
          label: group.name,
          value: group.id,
        }));
      },
    },
    deviceType: {
      type: "string",
      label: "Device Type",
      description: "Specify the device type to monitor",
      async options() {
        const types = await this.getDeviceTypes();
        return types.map((type) => ({
          label: type.name,
          value: type.id,
        }));
      },
    },
    sessionType: {
      type: "string",
      label: "Session Type",
      description: "Filter remote access sessions by type",
      optional: true,
      async options() {
        const types = await this.getSessionTypes();
        return types.map((type) => ({
          label: type.name,
          value: type.id,
        }));
      },
    },
    technician: {
      type: "string",
      label: "Technician",
      description: "Filter remote access sessions by technician",
      optional: true,
      async options() {
        const technicians = await this.getTechnicians();
        return technicians.map((tech) => ({
          label: tech.name,
          value: tech.id,
        }));
      },
    },
    title: {
      type: "string",
      label: "Title",
      description: "Title of the support ticket",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the support ticket",
    },
    priority: {
      type: "string",
      label: "Priority",
      description: "Priority level of the support ticket",
    },
    assignedTechnician: {
      type: "string",
      label: "Assigned Technician",
      description: "Technician to assign the ticket to",
      optional: true,
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "Due date for the support ticket",
      optional: true,
    },
    deviceId: {
      type: "string",
      label: "Device ID",
      description: "Identifier of the device to update",
    },
    deviceAttributes: {
      type: "string[]",
      label: "Device Attributes",
      description: "Attributes to update on the device",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.ninjaone.com/v2";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "/", headers, ...otherOpts
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
    async getTicketPriorities() {
      return this._makeRequest({
        path: "/ticketing/ticket-priorities",
      });
    },
    async getTicketStatuses() {
      return this._makeRequest({
        path: "/ticketing/ticket-statuses",
      });
    },
    async getDeviceGroups() {
      return this._makeRequest({
        path: "/device-groups",
      });
    },
    async getDeviceTypes() {
      return this._makeRequest({
        path: "/device-types",
      });
    },
    async getSessionTypes() {
      return this._makeRequest({
        path: "/session-types",
      });
    },
    async getTechnicians() {
      return this._makeRequest({
        path: "/technicians",
      });
    },
    async createSupportTicket({
      title, description, priority, assignedTechnician, dueDate,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/ticketing/ticket",
        data: {
          title,
          description,
          priority,
          assignedTechnician,
          dueDate,
        },
      });
    },
    async updateDevice(deviceId, deviceAttributes) {
      return this._makeRequest({
        method: "PATCH",
        path: `/device/${deviceId}`,
        data: JSON.parse(deviceAttributes),
      });
    },
    async emitNewSupportTicket({
      ticketPriority, ticketStatus,
    }) {
      const response = await this._makeRequest({
        path: "/ticketing/ticket",
        params: {
          priority: ticketPriority,
          status: ticketStatus,
        },
      });
      response.forEach((ticket) => this.$emit(ticket, {
        id: ticket.id,
        summary: `New ticket: ${ticket.title}`,
        ts: new Date().getTime(),
      }));
    },
    async emitDeviceOnline({
      deviceGroup, deviceType,
    }) {
      const response = await this._makeRequest({
        path: "/devices",
        params: {
          group: deviceGroup,
          type: deviceType,
        },
      });
      response.forEach((device) => this.$emit(device, {
        id: device.id,
        summary: `Device online: ${device.name}`,
        ts: new Date().getTime(),
      }));
    },
    async emitRemoteAccessSession({
      sessionType, technician,
    }) {
      const response = await this._makeRequest({
        path: "/device/{id}/activities",
        params: {
          sessionType,
          technician,
        },
      });
      response.forEach((session) => this.$emit(session, {
        id: session.id,
        summary: `Remote session initiated by ${session.technician}`,
        ts: new Date().getTime(),
      }));
    },
  },
  version: `0.0.${Date.now()}`,
};
