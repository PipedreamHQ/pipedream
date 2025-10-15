import { parseObject } from "../../common/utils.mjs";
import thoughtly from "../../thoughtly.app.mjs";

export default {
  key: "thoughtly-trigger-call",
  name: "Trigger a Call",
  description: "Triggers a call to a designated contact. [See the documentation](https://api.thought.ly/docs/#/contact/post_contact_call)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    thoughtly,
    contactId: {
      propDefinition: [
        thoughtly,
        "contactId",
      ],
    },
    interviewId: {
      propDefinition: [
        thoughtly,
        "interviewId",
      ],
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "An object of metadata.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.thoughtly.callContact({
      $,
      data: {
        contact_id: this.contactId,
        interview_id: this.interviewId,
        metadata: parseObject(this.metadata),
      },
    });
    $.export("$summary", `Successfully triggered a call to contact ID ${this.contactId}`);
    return response;
  },
};
