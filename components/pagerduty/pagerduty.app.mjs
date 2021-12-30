import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "pagerduty",
  propDefinitions: {
    incidentTitle: {
      type: "string",
      label: "Incident Title",
      description: "A succinct description of the nature, symptoms, cause, or effect of the incident.",
    },
    incidentUrgency: {
      type: "string",
      label: "Incident Urgency",
      description: "The urgency of the incident. Allowed values: `high` and `low`",
      options: constants.INCIDENT_URGENCIES,
      optional: true,
    },
    incidenKey: {
      type: "string",
      label: "Incident Key",
      description: "A string which identifies the incident. Sending subsequent requests referencing the same service and with the same *Incident Key* will result in those requests being rejected if an open incident matches that *Incident Key*.",
      optional: true,
    },
    incidentBodyDetails: {
      type: "string",
      label: "Incident Details",
      description: "Additional incident details.",
      optional: true,
    },
    incidentConferenceBridgeNumber: {
      type: "string",
      label: "Incident Conference Bridge Number",
      description: "The phone number of the conference call for the conference bridge. Phone numbers should be formatted like `+1 415-555-1212,,,,1234#`, where a comma (`,`) represents a one-second wait and pound (`#`) completes access code input.",
      optional: true,
    },
    incidentConferenceBridgeUrl: {
      type: "string",
      label: "Incident Conference Bridge URL",
      description: "An URL for the conference bridge. This could be a link to a web conference or Slack channel.",
      optional: true,
    },
    escalationPolicyId: {
      type: "string",
      label: "Escalation Policy ID",
      description: "The ID of the escalation policy",
      optional: true,
      async options({ prevContext }) {
        const {
          offset: prevOffset,
          more: prevMore,
        } = prevContext;

        if (prevMore === false) {
          return [];
        }

        const {
          escalation_policies: escalationPolicies,
          offset,
          more,
        } =
          await this.listEscalationPolicies({
            params: {
              offset: prevOffset,
            },
          });

        const options = escalationPolicies.map((policy) => {
          return {
            label: policy.summary,
            value: policy.id,
          };
        });

        return {
          options,
          context: {
            offset,
            more,
          },
        };
      },
    },
    serviceId: {
      type: "string",
      label: "Service ID",
      description: "The ID of the service. [See the docs here](https://developer.pagerduty.com/api-reference/b3A6Mjc0ODE5Ng-list-services)",
      async options({ prevContext }) {
        const {
          offset: prevOffset,
          more: prevMore,
        } = prevContext;

        if (prevMore === false) {
          return [];
        }

        const {
          services,
          offset,
          more,
        } =
          await this.listServices({
            params: {
              offset: prevOffset,
            },
          });

        const options = services.map((service) => ({
          label: service.name,
          value: service.id,
        }));

        return {
          options,
          context: {
            offset,
            more,
          },
        };
      },
    },
    incidentId: {
      type: "string",
      label: "Incident ID",
      description: "The ID of the incident. [See the docs here](https://developer.pagerduty.com/api-reference/b3A6Mjc0ODEzOA-list-incidents)",
      async options({
        statuses,
        prevContext,
      }) {
        const {
          offset: prevOffset,
          more: prevMore,
        } = prevContext;

        if (prevMore === false) {
          return [];
        }

        const {
          incidents,
          offset,
          more,
        } =
          await this.listIncidents({
            params: {
              offset: prevOffset,
              statuses,
            },
          });

        const options = incidents.map((incident) => ({
          label: incident.summary,
          value: incident.id,
        }));

        return {
          options,
          context: {
            offset,
            more,
            statuses,
          },
        };
      },
    },
    priorityId: {
      type: "string",
      label: "Priority ID",
      description: "The ID of the priority. [See the docs here](https://developer.pagerduty.com/api-reference/b3A6Mjc0ODE2NA-list-priorities)",
      optional: true,
      async options({ prevContext }) {
        const {
          offset: prevOffset,
          more: prevMore,
        } = prevContext;

        if (prevMore === false) {
          return [];
        }

        const {
          priorities,
          offset,
          more,
        } =
          await this.listPriorities({
            params: {
              offset: prevOffset,
            },
          });

        const options = priorities.map((priority) => ({
          label: priority.name,
          value: priority.id,
        }));

        return {
          options,
          context: {
            offset,
            more,
          },
        };
      },
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The ID of the User. [See the docs here](https://developer.pagerduty.com/api-reference/b3A6Mjc0ODIzMw-list-users)",
      optional: true,
      async options({ prevContext }) {
        const {
          offset: prevOffset,
          more: prevMore,
        } = prevContext;

        if (prevMore === false) {
          return [];
        }

        const {
          users,
          offset,
          more,
        } =
          await this.listUsers({
            params: {
              offset: prevOffset,
            },
          });

        const options = users.map((user) => ({
          label: user.name,
          value: user.id,
        }));

        return {
          options,
          context: {
            offset,
            more,
          },
        };
      },
    },
  },
  methods: {
    async makeRequest(customConfig) {
      const {
        $,
        url,
        path,
        ...additionalConfig
      } = customConfig;

      const { oauth_access_token: oauthAccessToken } = this.$auth;

      const headers = {
        Authorization: `Bearer ${oauthAccessToken}`,
        ...additionalConfig?.headers,
        ...constants.API_HEADERS,
      };

      const config = {
        ...additionalConfig,
        headers,
        url: url || `${constants.BASE_URL}${path}`,
        timeout: 10000,
      };

      return axios($ ?? this, config);
    },
    async getEscalationPolicy({
      $, escalationPolicyId,
    }) {
      return this.makeRequest({
        $,
        path: `/escalation_policies/${escalationPolicyId}`,
      });
    },
    async listEscalationPolicies({
      $, params,
    } = {}) {
      return this.makeRequest({
        $,
        path: "/escalation_policies",
        params,
      });
    },
    async listOncalls({
      $, params,
    }) {
      return this.makeRequest({
        $,
        path: "/oncalls",
        params,
      });
    },
    async createWebhookSubscription({
      $, data, ...additionalConfig
    }) {
      return this.makeRequest({
        $,
        method: "post",
        path: "/webhook_subscriptions",
        data,
        ...additionalConfig,
      });
    },
    async deleteWebhookSubscription({
      $, webhookId, ...additionalConfig
    }) {
      return this.makeRequest({
        $,
        method: "delete",
        path: `/webhook_subscriptions/${webhookId}`,
        ...additionalConfig,
      });
    },
    async listServices({
      $, params,
    }) {
      return this.makeRequest({
        $,
        path: "/services",
        params,
      });
    },
    async listIncidents({
      $, params,
    }) {
      return this.makeRequest({
        $,
        path: "/incidents",
        params,
      });
    },
    async createIncident({
      $, data,
    }) {
      return this.makeRequest({
        $,
        method: "post",
        path: "/incidents",
        data,
      });
    },
    async updateIncident({
      $, incidentId, data,
    }) {
      return this.makeRequest({
        $,
        method: "put",
        path: `/incidents/${incidentId}`,
        data,
      });
    },
    async listPriorities({
      $, params,
    }) {
      return this.makeRequest({
        $,
        path: "/priorities",
        params,
      });
    },
    async listUsers({
      $, params,
    }) {
      return this.makeRequest({
        $,
        path: "/users",
        params,
      });
    },
    async listEscalationPoliciesIds({
      $, params,
    } = {}) {
      const { escalation_policies: escalationPolicies } =
        await this.listEscalationPolicies({
          $,
          params,
        });
      return escalationPolicies.map(({ id }) => id);
    },
    async listOncallUsers({
      $, params,
    }) {
      const { oncalls } = await this.listOncalls({
        $,
        params,
      });
      return oncalls.map(({ user }) => user);
    },
  },
};
