import telnyx from "../../telnyx.app.mjs";

export default {
  key: "telnyx-list-messaging-profile-id-options",
  name: "List Messaging Profile Id Options",
  description: "Retrieves available options for the Messaging Profile Id field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    telnyx,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await telnyx.propDefinitions.messagingProfileId.options.call(this.telnyx, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
