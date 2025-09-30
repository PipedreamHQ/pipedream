import {
  ORIGIN_OPTIONS, PAIN_LEVEL_OPTIONS,
} from "../../common/constants.mjs";
import productlane from "../../productlane.app.mjs";

export default {
  key: "productlane-create-feedback",
  name: "Create Feedback",
  description:
    "Create new feedback in Productlane. [See the documentation](https://productlane.com/docs/api-reference/portal/create-feedback)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    productlane,
    projectId: {
      propDefinition: [
        productlane,
        "projectId",
      ],
    },
    email: {
      propDefinition: [
        productlane,
        "email",
      ],
      description: "The email for the feedback",
    },
    text: {
      type: "string",
      label: "Text",
      description: "The text of the feedback",
    },
    notifyByEmail: {
      propDefinition: [
        productlane,
        "notify",
      ],
      label: "Notify by Email",
      description: "Whether to notify by email",
    },
    notifyBySlack: {
      propDefinition: [
        productlane,
        "notify",
      ],
      label: "Notify by Slack",
      description: "Whether to notify by slack",
    },
    origin: {
      type: "string",
      label: "Origin",
      description: "The origin of the feedback",
      optional: true,
      options: ORIGIN_OPTIONS,
    },
    painLevel: {
      type: "string",
      label: "Pain Level",
      description: "The pain level of the feedback",
      options: PAIN_LEVEL_OPTIONS,
    },
  },
  async run({ $ }) {
    const {
      email,
      notifyByEmail,
      notifyBySlack,
      origin,
      painLevel,
      text,
      projectId,
    } = this;

    const data = {
      email: email,
      notify: ((notifyByEmail ?? notifyBySlack) !== undefined)
        ? {
          email: notifyByEmail,
          slack: notifyBySlack,
        }
        : undefined,
      origin: origin,
      painLevel: painLevel,
      text: text,
      projectId: projectId,
    };

    const response = await this.productlane.createFeedback({
      $,
      data,
    });

    $.export(
      "$summary",
      `Successfully created feedback with ID: ${response.id}`,
    );

    return response;
  },
};
