import reply from "../../reply_io.app.mjs";
import {
  pickBy, pick,
} from "lodash-es";

export default {
  key: "reply_io-create-or-update-contact",
  name: "Create or Update Contact",
  description: "Create a new contact or update if they already exist. [See the docs here](https://apidocs.reply.io/#2a6fb925-29db-403e-a59f-8cce5672c66a)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    reply,
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
    const response = await this.reply.createContact({
      data,
      $,
    });
    $.export("$summary", `Successfully created contact with ID ${response.id}`);
    return response;
  },
};
