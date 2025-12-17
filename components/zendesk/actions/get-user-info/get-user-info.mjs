import zendesk from "../../zendesk.app.mjs";

export default {
  key: "zendesk-get-user-info",
  name: "Get User Info",
  description: "Retrieves information about a specific user. [See the documentation](https://developer.zendesk.com/api-reference/ticketing/users/users/#show-user).",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    zendesk,
    userId: {
      propDefinition: [
        zendesk,
        "userId",
      ],
    },
  },
  async run({ $: step }) {
    const response = await this.zendesk.getUserInfo({
      step,
      userId: this.userId,
    });

    step.export("$summary", `Successfully retrieved user info for ${response.user.name}`);

    return response;
  },
};
