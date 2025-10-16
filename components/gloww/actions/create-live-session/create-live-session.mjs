import { ConfigurationError } from "@pipedream/platform";
import gloww from "../../gloww.app.mjs";

export default {
  key: "gloww-create-live-session",
  name: "Create Live Session",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Create a new Live Session [See the documentation](https://gloww.com/faq/)",
  type: "action",
  props: {
    gloww,
    sessionId: {
      propDefinition: [
        gloww,
        "sessionId",
      ],
      optional: true,
    },
    templateId: {
      propDefinition: [
        gloww,
        "templateId",
      ],
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the Live Session.",
    },
  },
  async run({ $ }) {
    if ((!this.sessionId && !this.templateId) || (this.sessionId && this.templateId)) {
      throw new ConfigurationError("You must provide either Session Id or Template Id.");
    }

    const response = await this.gloww.createSession({
      $,
      data: {
        name: this.sessionName,
      },
      params: {
        fromTemplateId: this.templateId,
        fromSessionId: this.sessionId,
      },
    });

    $.export("$summary", `A new live session with Id: ${response.id} was successfully created!`);
    return response;
  },
};
