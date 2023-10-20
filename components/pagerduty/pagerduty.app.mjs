import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

const {
  BASE_URL_V1,
  SUBDOMAIN_PLACEHOLDER,
  VERSION_PATH_V1,
  LIMIT_PAGINATION,
  INCIDENT_EVENT_TYPES,
} = constants;

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
    incidentKey: {
      type: "string",
      label: "Incident Key",
      description: "A string which identifies the incident. Sending subsequent requests referencing the same service and with the same **Incident Key** will result in those requests being rejected if an open incident matches that **Incident Key**.",
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
      async options({ page }) {
        const { escalation_policies: escalationPolicies } = await this.listEscalationPolicies({
          params: {
            offset: page * LIMIT_PAGINATION,
            limit: LIMIT_PAGINATION,
          },
        });

        return escalationPolicies.map((policy) => {
          return {
            label: policy.summary,
            value: policy.id,
          };
        });
      },
    },
    serviceId: {
      type: "string",
      label: "Service ID",
      description: "The ID of the service. [See the docs here](https://developer.pagerduty.com/api-reference/b3A6Mjc0ODE5Ng-list-services)",
      async options({ page }) {
        const { services } = await this.listServices({
          params: {
            offset: page * LIMIT_PAGINATION,
            limit: LIMIT_PAGINATION,
          },
        });

        return services.map((service) => ({
          label: service.name,
          value: service.id,
        }));
      },
    },
    incidentId: {
      type: "string",
      label: "Incident ID",
      description: "The ID of the incident. [See the docs here](https://developer.pagerduty.com/api-reference/b3A6Mjc0ODEzOA-list-incidents)",
      async options({
        statuses,
        page,
      }) {
        const { incidents } = await this.listIncidents({
          params: {
            offset: page * LIMIT_PAGINATION,
            limit: LIMIT_PAGINATION,
            statuses,
          },
        });

        return incidents.map((incident) => ({
          label: incident.summary,
          value: incident.id,
        }));
      },
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The ID of the User.",
      async options({ page }) {

        const { users } = await this.listUsers({
          params: {
            offset: page * LIMIT_PAGINATION,
            limit: LIMIT_PAGINATION,
          },
        });

        return users.map((user) => ({
          label: user.name,
          value: user.id,
        }));
      },
    },
    oncallScheduleId: {
      type: "string",
      label: "On-Call Schedule ID",
      description: "Filters the results, showing only on-calls for the specified schedule ID. If `null` is provided, it includes permanent on-calls due to direct user escalation targets.",
      async options({ page }) {
        const { schedules } = await this.listSchedules({
          params: {
            offset: page * LIMIT_PAGINATION,
            limit: LIMIT_PAGINATION,
          },
        });

        return schedules.map((schedule) => ({
          label: schedule.name,
          value: schedule.id,
        }));
      },
    },
    oncallSince: {
      type: "string",
      label: "Oncall Since",
      description: "The start of the time range over which you want to search. If an on-call period overlaps with the range, it will be included in the result. Defaults to current time. The search range cannot exceed 3 months.",
    },
    oncallUntil: {
      type: "string",
      label: "Oncall Until",
      description: "The end of the time range over which you want to search. If an on-call period overlaps with the range, it will be included in the result. Defaults to current time. The search range cannot exceed 3 months, and the **Until** time cannot be before the **Since** time.",
    },
    webhookEvent: {
      type: "string[]",
      label: "Events",
      description: "The set of outbound event types the webhook will receive.",
      options: INCIDENT_EVENT_TYPES,
    },
  },
  methods: {
    getRequestUrl({
      url, path, subdomain,
    }) {
      const builtUrl = subdomain
        ? `${BASE_URL_V1.replace(SUBDOMAIN_PLACEHOLDER, subdomain)}${VERSION_PATH_V1}${path}`
        : `${constants.BASE_URL}${path}`;

      return url || builtUrl;
    },
    getRequestHeaders(additionalHeaders) {
      const { oauth_access_token: oauthAccessToken } = this.$auth;

      return {
        Authorization: `Bearer ${oauthAccessToken}`,
        ...additionalHeaders,
        ...constants.API_HEADERS,
      };
    },
    async makeRequest(customConfig) {
      const {
        $,
        service,
        url,
        path,
        ...additionalConfig
      } = customConfig;

      const config = {
        ...additionalConfig,
        headers: this.getRequestHeaders(additionalConfig?.headers),
        url: this.getRequestUrl({
          url,
          path,
          service,
        }),
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
      $, webhookId,
    }) {
      return this.makeRequest({
        $,
        method: "delete",
        path: `/webhook_subscriptions/${webhookId}`,
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
    async listUsers({
      $, params,
    }) {
      return this.makeRequest({
        $,
        path: "/users",
        params,
      });
    },
    async listSchedules({
      $, params,
    }) {
      return this.makeRequest({
        $,
        path: "/schedules",
        params,
      });
    },
    async listUsersOncall({
      $, scheduleId, params,
    }) {
      return this.makeRequest({
        $,
        path: `/schedules/${scheduleId}/users`,
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
