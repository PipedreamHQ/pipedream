import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "pagerduty",
  propDefinitions: {
    escalationPoliciesIds: {
      type: "string[]",
      label: "Escalation Policies",
      description: "To filter your on-call rotations to specific escalation policies, select them here. **To listen for rotations across all escalation policies, leave this blank**.",
      optional: true,
      async options({ prevContext }) {
        const { offset: prevOffset } = prevContext;

        const {
          escalation_policies: escalationPolicies,
          offset,
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
        ...configProps
      } = customConfig;

      const { oauth_access_token: oauthAccessToken } = this.$auth;

      const authorization = `Bearer ${oauthAccessToken}`;

      const headers = {
        ...configProps?.headers,
        ...constants.API_HEADERS,
        authorization,
        "Content-type": "application/json",
      };

      const config = {
        ...configProps,
        headers,
        url: url || `${constants.BASE_URL}${path}`,
        timeout: 10000,
      };

      return axios($ ?? this, config);
    },
    async getEscalationPolicy({
      $, escalationPolicyId,
    }) {
      // { escalation_policy }
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
    async listOncalls({
      $, params,
    }) {
      return this.makeRequest({
        $,
        path: "/oncalls",
        params,
      });
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
