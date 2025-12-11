import remote from "../../remote.app.mjs";

export default {
  key: "remote-show-timeoff-balance",
  name: "Show Time Off Balance",
  description: "Show the time off balance for an employment in Remote. [See the documentation](https://developer.remote.com/reference/get_show_timeoff_balance)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    remote,
    employmentId: {
      propDefinition: [
        remote,
        "employmentId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.remote.showTimeoffBalance({
      $,
      employmentId: this.employmentId,
    });

    $.export("$summary", `Successfully retrieved time off balance for employment with ID: ${this.employmentId}`);
    return response;
  },
};
