import { ConfigurationError } from "@pipedream/platform";
import easysendy from "../../easysendy.app.mjs";

export default {
  key: "easysendy-add-subscriber",
  name: "Add Subscriber",
  description: "Adds a new subscriber to an EasySendy list. [See the documentation](https://developers.easysendyapp.com/easysendypro/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    easysendy,
    email: {
      type: "string",
      label: "Email",
      description: "The subscriber's email address.",
    },
    listId: {
      propDefinition: [
        easysendy,
        "listId",
      ],
    },
    fname: {
      type: "string",
      label: "First Name",
      description: "The subscriber's first name.",
      optional: true,
    },
    lname: {
      type: "string",
      label: "Last Name",
      description: "The subscriber's last name.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.easysendy.addSubscriber({
      $,
      data: {
        req_type: "subscribe",
        listUID: this.listId,
        EMAIL: this.email,
        FNAME: this.fname,
        LNAME: this.lname,
      },
    });

    if (response.status === "error") {
      throw new ConfigurationError(response.message);
    }

    $.export("$summary", `Successfully added subscriber ${this.email} to list ${this.listId}`);
    return response;
  },
};
