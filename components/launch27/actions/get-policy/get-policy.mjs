import launch27 from "../../launch27.app.mjs";

export default {
  key: "launch27-get-policy",
  name: "Get Policy",
  description: "Retrieves a policy. [See the documentation](https://bitbucket.org/awoo23/api-2.0/wiki/New_booking_policy)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    launch27,
    type: {
      type: "string",
      label: "Type",
      description: "The type of policy to retrieve",
      options: [
        "booking",
        "reschedule",
        "cancellation",
        "location",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.launch27.getPolicy({
      $,
      type: this.type,
    });
    $.export("$summary", `Successfully retrieved ${this.type} policy`);
    return response;
  },
};
