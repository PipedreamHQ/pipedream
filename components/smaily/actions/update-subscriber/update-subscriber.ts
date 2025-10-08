import { defineAction } from "@pipedream/types";
import smaily from "../../app/smaily.app";

export default defineAction({
  name: "Update Subscriber",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "smaily-update-subscriber",
  description: "Updates a subscriber. [See docs here](https://smaily.com/help/api/subscribers-2/create-and-update-subscribers/)",
  type: "action",
  props: {
    smaily,
    segmentId: {
      propDefinition: [
        smaily,
        "segmentId",
      ],
    },
    email: {
      label: "Subscriber Email",
      description: "The email of the subscriber",
      type: "string",
      propDefinition: [
        smaily,
        "emails",
        (c) => ({
          segmentId: c.segmentId,
        }),
      ],
    },
    customFields: {
      label: "Custom Fields",
      description: "Custom fields to update the subscriber. E.g. { \"name\": \"Lucas\" }",
      type: "object",
      optional: true,
    },
  },
  async run({ $ }) {
    const parsedCustomFields = typeof this.customFields === "string"
      ? JSON.parse(this.customFields)
      : this.customFields;

    const response = await this.smaily.updateSubscriber({
      $,
      data: {
        email: this.email,
        ...parsedCustomFields,
      },
    });

    if (response.code < 300) {
      $.export("$summary", "Successfully updated subscriber"); // this request doesn't return an ID
    }

    return response;
  },
});
