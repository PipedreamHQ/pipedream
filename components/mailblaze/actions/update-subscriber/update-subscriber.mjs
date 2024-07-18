import mailblaze from "../../mailblaze.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "mailblaze-update-subscriber",
  name: "Update Subscriber",
  description: "Updates information for an existing subscriber in your mailing list. [See the documentation](https://www.mailblaze.com/support/api-documentation)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    mailblaze,
    listUid: {
      propDefinition: [
        mailblaze,
        "listUid",
      ],
    },
    email: {
      propDefinition: [
        mailblaze,
        "email",
      ],
    },
    fname: {
      propDefinition: [
        mailblaze,
        "fname",
      ],
    },
    lname: {
      propDefinition: [
        mailblaze,
        "lname",
      ],
    },
    customTagName: {
      propDefinition: [
        mailblaze,
        "customTagName",
      ],
    },
  },
  async run({ $ }) {
    const subscribers = await this.mailblaze._makeRequest({
      path: `/lists/${this.listUid}/subscribers/search-by-email`,
      params: {
        EMAIL: this.email,
      },
    });

    if (!subscribers.length) {
      throw new Error("Subscriber not found");
    }

    const subscriberUid = subscribers[0].subscriber_uid;

    const data = {
      ...(this.email && {
        EMAIL: this.email,
      }),
      ...(this.fname && {
        FNAME: this.fname,
      }),
      ...(this.lname && {
        LNAME: this.lname,
      }),
      ...(this.customTagName && {
        CUSTOM_TAG_NAME: this.customTagName,
      }),
    };

    const response = await this.mailblaze._makeRequest({
      method: "PUT",
      path: `/lists/${this.listUid}/subscribers/${subscriberUid}`,
      data,
    });

    $.export("$summary", `Successfully updated subscriber with email ${this.email}`);
    return response;
  },
};
