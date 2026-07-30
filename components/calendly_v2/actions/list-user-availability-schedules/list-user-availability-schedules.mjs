// x-pd-ai: optimized
import calendly from "../../calendly_v2.app.mjs";

export default {
  key: "calendly_v2-list-user-availability-schedules",
  name: "List User Availability Schedules",
  description: "List the availability schedules of the given user via `GET /user_availability_schedules`. Run **List Organization Memberships** first to obtain a user URI. Example: call with `user` set to `https://api.calendly.com/users/AAAAAAAAAAAAAAAA` to return that user's named availability schedules (e.g. `Working Hours`) with their weekly rules. [See the documentation](https://developer.calendly.com/api-docs/8098de44af94c-list-user-availability-schedules)",
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
      description: "The User URI to retrieve availability schedules for (e.g. `https://api.calendly.com/users/AAAAAAAAAAAAAAAA`). Run **List Organization Memberships** to find valid user URIs.",
    },
  },
  async run({ $ }) {
    const response = await this.calendly.listUserAvailabilitySchedules(this.user, $);
    $.export("$summary", `Successfully retrieved availability schedules for user ${this.user}`);
    return response;
  },
};
