import calendly from "../../calendly_v2.app.mjs";

export default {
  key: "calendly_v2-list-user-availability-schedules",
  name: "List User Availability Schedules",
  description: "List the availability schedules of the given user. [See the documentation](https://developer.calendly.com/api-docs/8098de44af94c-list-user-availability-schedules)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    calendly,
    organization: {
      propDefinition: [
        calendly,
        "organization",
      ],
    },
    user: {
      propDefinition: [
        calendly,
        "user",
        (c) => ({
          organization: c.organization,
        }),
      ],
      description: "The ID of the user for whom you want to retrieve availability schedules.",
    },
  },
  async run({ $ }) {
    const response = await this.calendly.listUserAvailabilitySchedules(this.user, $);
    $.export("$summary", `Successfully retrieved availability schedules for user ${this.user}`);
    return response;
  },
};
