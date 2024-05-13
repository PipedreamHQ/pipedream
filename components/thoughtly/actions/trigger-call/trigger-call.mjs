import thoughtly from "../../thoughtly.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "thoughtly-trigger-call",
  name: "Trigger a Call",
  description: "Triggers a call to a designated phone number.",
  version: "0.0.${ts}",
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
    idMetadata: {
      ...thoughtly.propDefinitions.idMetadata,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.thoughtly.callContact({
      contactId: this.contactId,
      interviewId: this.interviewId,
      idMetadata: this.idMetadata,
    });
    $.export("$summary", `Successfully triggered a call to contact ID ${this.contactId}`);
    return response;
  },
};
