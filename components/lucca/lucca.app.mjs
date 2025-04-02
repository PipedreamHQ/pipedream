import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "lucca",
  propDefinitions: {
    leaveType: {
      type: "string",
      label: "Leave Type",
      description: "Filter by leave type",
      optional: true,
      async options() {
        const leaveTypes = await this.listLeaveTypes();
        return leaveTypes.map((type) => ({
          label: type.name,
          value: type.id,
        }));
      },
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The ID of the user",
      async options() {
        const users = await this.listUsers();
        return users.map((user) => ({
          label: user.displayName,
          value: user.id,
        }));
      },
    },
    leaveRequestId: {
      type: "string",
      label: "Leave Request ID",
      description: "The ID of the leave request to approve",
      async options() {
        const leaveRequests = await this.listLeaveRequests();
        return leaveRequests.map((request) => ({
          label: `${request.id} - ${request.status}`,
          value: request.id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.account}.ilucca.net/api/v3`;
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
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async listLeaveTypes(opts = {}) {
      return this._makeRequest({
        path: "/leaveperiods/leavetypes",
        ...opts,
      });
    },
    async listUsers(opts = {}) {
      const response = await this._makeRequest({
        path: "/users",
        ...opts,
      });
      return response.items;
    },
    async listLeaveRequests(opts = {}) {
      const response = await this._makeRequest({
        path: "/leaveRequests",
        ...opts,
      });
      return response.items;
    },
    async approveLeaveRequest({
      leaveRequestId, approved = true, comment = "",
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/leaveRequests/${leaveRequestId}/approvals`,
        data: {
          approved,
          comment,
        },
      });
    },
    async updateUserProfile({
      userId, firstname, lastname, mail, login, legalentityid, cspid, calendarid,
      employeenumber, birthdate, userworkcycles, departmentid, managerid,
      roleprincipalid, habilitedroles, cultureid, address, bankname,
      directline, jobtitle, gender, nationality, personalemail, personalmobile,
      professionalmobile, quote,
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/users/${userId}`,
        data: {
          firstName: firstname,
          lastName: lastname,
          mail,
          login,
          legalEntityId: legalentityid,
          cspId: cspid,
          calendarId: calendarid,
          employeeNumber: employeenumber,
          birthDate: birthdate,
          userWorkCycles: userworkcycles
            ? userworkcycles.map(JSON.parse)
            : [],
          departmentId: departmentid,
          managerId: managerid,
          rolePrincipalId: roleprincipalid,
          habilitedRoles: habilitedroles
            ? habilitedroles.map(JSON.parse)
            : [],
          cultureId: cultureid,
          address,
          bankName: bankname,
          directLine: directline,
          jobTitle: jobtitle,
          gender,
          nationality,
          personalEmail: personalemail,
          personalMobile: personalmobile,
          professionalMobile: professionalmobile,
          quote,
        },
      });
    },
    async listExpenseClaims(opts = {}) {
      return this._makeRequest({
        path: "/expenseClaims",
        ...opts,
      });
    },
  },
  version: "0.0.{{ts}}",
};
