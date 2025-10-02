import reply from "../../reply_io.app.mjs";
import {
  pickBy, pick,
} from "lodash-es";

export default {
  key: "reply_io-create-and-push-to-campaign",
  name: "Create or Update Contact and Push to Campaign",
  description: "Create a new contact, or update if they already exist, and push contact to the selected campaign. [See the docs here](https://apidocs.reply.io/#67afb4b3-4291-4798-9734-ceaa275a90be)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    reply,
    campaignId: {
      propDefinition: [
        reply,
        "campaignId",
      ],
    },
    email: {
      propDefinition: [
        reply,
        "email",
      ],
    },
    firstName: {
      propDefinition: [
        reply,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        reply,
        "lastName",
      ],
    },
    company: {
      propDefinition: [
        reply,
        "company",
      ],
    },
    city: {
      propDefinition: [
        reply,
        "city",
      ],
    },
    state: {
      propDefinition: [
        reply,
        "state",
      ],
    },
    country: {
      propDefinition: [
        reply,
        "country",
      ],
    },
    title: {
      propDefinition: [
        reply,
        "title",
      ],
    },
    phone: {
      propDefinition: [
        reply,
        "phone",
      ],
    },
  },
  async run({ $ }) {
    const data = pickBy(pick(this, [
      "campaignId",
      "email",
      "firstName",
      "lastName",
      "company",
      "city",
      "state",
      "country",
      "title",
      "phone",
    ]));
    try {
      await this.reply.createContactAndPushToCampaign({
        data,
        $,
      });
      $.export("$summary", `Successfully pushed contact to campaign with ID ${this.campaignId}`);
    } catch (e) {
      console.log(e.response.data);
    }
    // nothing to return;
  },
};
