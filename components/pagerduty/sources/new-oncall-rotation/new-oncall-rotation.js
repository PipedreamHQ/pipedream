const differenceBy = require("lodash.differenceby");
const pagerduty = require("../../pagerduty.app.js");

module.exports = {
  key: "pagerduty-new-on-call-rotation",
  name: "New On-Call Rotation",
  version: "0.0.1",
  description:
    "Emits an event each time a new user rotates onto an on-call rotation",
  props: {
    pagerduty,
    db: "$.service.db",
    escalationPolicies: { propDefinition: [pagerduty, "escalationPolicies"] },
    timer: {
      type: "$.interface.timer",
      label: "Interval to poll for new rotations",
      description:
        "The PagerDuty API doesn't support webhook notifications for on-call rotations, so we must poll the API to check for these changes. Change this interval according to your needs.",
      default: {
        intervalSeconds: 60 * 10,
      },
    },
  },
  async run(event) {
    // If the user didn't watch specific escalation policies,
    // iterate through all of the policies on the account
    const escalationPolicies =
      this.escalationPolicies && this.escalationPolicies.length
        ? this.escalationPolicies
        : (await this.pagerduty.listEscalationPolicies()).map(({ id }) => id);

    // Since we can watch multiple escalation policies for rotations, we must
    // keep track of the last users who were on-call for a given policy.
    const onCallUsersByEscalationPolicy =
      this.db.get("onCallUsersByEscalationPolicy") || {};

    for (const policy of escalationPolicies) {
      // Multiple users can technically be on-call at the same time if the account
      // has multiple schedules attached to an escalation policy, so we must watch
      // for any new users in the list of on-call users who were not in the list of
      // users previously on-call. See
      // https://community.pagerduty.com/forum/t/how-do-i-add-more-than-one-person-on-call-for-a-schedule/751
      const onCallUsers = await this.pagerduty.listOnCallUsers({
        escalation_policy_ids: [policy],
      });
      const usersPreviouslyOnCall = onCallUsersByEscalationPolicy[policy] || [];

      // Retrieve the list of users who were previously not on-call,
      // but now entered the rotation
      const newOnCallUsers = differenceBy(
        onCallUsers,
        usersPreviouslyOnCall,
        "id"
      );

      onCallUsersByEscalationPolicy[policy] = onCallUsers;

      if (!newOnCallUsers.length) {
        console.log(
          `No change to on-call users for escalation policy ${policy}`
        );
        continue;
      }

      // Include escalation policy metadata in emit
      const escalationPolicy = await this.pagerduty.getEscalationPolicy(policy);

      for (const user of newOnCallUsers) {
        this.$emit(
          { user, escalationPolicy },
          {
            summary: `${user.summary} is now on-call for escalation policy ${escalationPolicy.name}`,
          }
        );
      }
    }
    // Persist the new set of on-call users for the next run
    this.db.set("onCallUsersByEscalationPolicy", onCallUsersByEscalationPolicy);
  },
};
