import app from "../../app/beehiiv.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "Create Subscriber",
  description: "Create a new subscriber. [See docs](https://www.beehiiv.com/developers/docs)",
  key: "beehiiv-create-subscriber",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
    publicationId: {
      propDefinition: [
        app,
        "publicationId",
      ],
    },
    reactivateExisting: {
      propDefinition: [
        app,
        "reactivateExisting",
      ],
    },
    sendWelcomeEmail: {
      propDefinition: [
        app,
        "sendWelcomeEmail",
      ],
    },
    utmSource: {
      propDefinition: [
        app,
        "utmSource",
      ],
    },
  },
  async run({ $ }) {
    const param = {
      email: this.email,
      publication_id: this.publicationId,
      reactivate_existing: this.reactivateExisting,
      send_welcome_email: this.sendWelcomeEmail,
      utm_source: this.utmSource,
    };
    const response = await this.app.createSubscriber($, param);
    $.export("$summary", `Successfully created a new subscriber with id: ${response.data.id}`);
    return response;
  },
});
