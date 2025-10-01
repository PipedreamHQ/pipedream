import app from "../../mailmodo.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "mailmodo-trigger-journey",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  name: "Trigger Journey",
  description: "Adds a new user to the journey. [See the docs here](https://www.mailmodo.com/developers/YXBpOjQ3MzIwNjUx-user-journeys/7de134cb5967c-add-a-new-user-to-the-journey)",
  props: {
    app,
    journeyId: {
      type: "string",
      label: "Journey ID",
      description: "Please see [the docs](https://support.mailmodo.com/support/solutions/articles/84000354151-how-to-get-the-mmapi-key-and-journey-id-) to see how to find journey ID",
    },
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
    data: {
      type: "object",
      label: "Data",
      description: "Key value pairs for the personalization. e.g. `{\"first_name\": \"John\"}`",
      optional: true,
    },
    allowDuplicateEmail: {
      type: "boolean",
      label: "Allow Duplicate Email",
      description: "Set true to allow multiple instances of the journey for the same email id.",
      optional: true,
    },
  },
  async run ({ $ }) {
    const {
      journeyId, ...data
    } = utils.extractProps(this, {});
    const resp = await this.app.triggerJourney({
      $,
      journeyId,
      data,
    });
    $.export("$summary", resp.message);
    return resp;
  },
};
