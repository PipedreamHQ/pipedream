import pagerduty from "../../pagerduty.app.mjs";

export default {
  key: "pagerduty-find-oncall-user",
  name: "Find Oncall User",
  description: "Find the user on call for a specific schedule. [See the docs here](https://developer.pagerduty.com/api-reference/b3A6Mjc0ODE5MA-list-users-on-call)",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    pagerduty,
    scheduleId: {
      propDefinition: [
        pagerduty,
        "oncallScheduleId",
      ],
    },
    userId: {
      propDefinition: [
        pagerduty,
        "userId",
      ],
    },
  },
  async run({ $ }) {
    const {
      scheduleId,
      userId,
    } = this;

    const { users } =
      await this.pagerduty.listUsersOncall({
        $,
        scheduleId,
      });

    const userFound = users.find(({ id }) => id === userId);

    const summary = userFound
      ? `${userFound.name} is On-Call for selected schedule`
      : "No user found for selected schedule";

    $.export("$summary", summary);

    return userFound;
  },
};
