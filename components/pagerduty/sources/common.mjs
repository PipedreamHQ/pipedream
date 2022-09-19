import constants from "../common/constants.mjs";

export default {
  methods: {
    setOncallUsersByEscalationPolicy(oncallUsersByEscalationPolicy) {
      this.db.set(constants.ONCALL_USERS_BY_ESCALATION_POLICY, oncallUsersByEscalationPolicy);
    },
    getOncallUsersByEscalationPolicy() {
      return this.db.get(constants.ONCALL_USERS_BY_ESCALATION_POLICY);
    },
    getMetadata() {
      throw new Error("getMetadata Not implemented");
    },
  },
};
