const axios = require("axios");

module.exports = {
  type: "app",
  app: "pagerduty",
  propDefinitions: {
    escalationPolicies: {
      type: "string[]",
      label: "Escalation Policies",
      description:
        "To filter your on-call rotations to specific escalation policies, select them here. **To listen for rotations across all escalation policies, leave this blank**.",
      async options({ prevContext }) {
        const { offset } = prevContext;
        const escalationPolicies = await this.listEscalationPolicies(offset);
        const options = escalationPolicies.map((policy) => {
          return {
            label: policy.summary,
            value: policy.id,
          };
        });
        return {
          options,
          context: { offset },
        };
      },
      optional: true,
    },
  },
  methods: {
    async _makeRequest(opts) {
      if (!opts.headers) opts.headers = {};
      opts.headers.authorization = `Bearer ${this.$auth.oauth_access_token}`;
      opts.headers["user-agent"] = "@PipedreamHQ/pipedream v0.1";
      opts.headers.accept = "application/vnd.pagerduty+json;version=2";
      const { path } = opts;
      delete opts.path;
      opts.url = `https://api.pagerduty.com${
        path[0] === "/" ? "" : "/"
      }${path}`;
      return await axios(opts);
    },
    async getEscalationPolicy(id) {
      return (
        await this._makeRequest({
          path: `/escalation_policies/${id}`,
        })
      ).data.escalation_policy;
    },
    async listEscalationPolicies(offset) {
      return (
        await this._makeRequest({
          path: "/escalation_policies",
          params: { offset },
        })
      ).data.escalation_policies;
    },
    async listOnCallUsers({ escalation_policy_ids }) {
      return (
        await this._makeRequest({
          path: "/oncalls",
          params: { escalation_policy_ids },
        })
      ).data.oncalls.map(({ user }) => user);
    },
  },
};
