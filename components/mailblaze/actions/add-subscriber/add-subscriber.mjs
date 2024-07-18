import mailblaze from "../../mailblaze.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "mailblaze-add-subscriber",
  name: "Add Subscriber",
  description: "Adds a new subscriber to your mailing list. [See the documentation](https://www.mailblaze.com/support/api-documentation)",
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
    const response = await this.mailblaze.addSubscriber({
      listUid: this.listUid,
      email: this.email,
      fname: this.fname,
      lname: this.lname,
      customTagName: this.customTagName,
    });

    $.export("$summary", `Successfully added subscriber with email ${this.email}`);
    return response;
  },
};
