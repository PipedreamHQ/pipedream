import { parseObject } from "../../common/utils.mjs";
import app from "../../encharge.app.mjs";

export default {
  key: "encharge-add-or-update-person",
  name: "Add or Update Person",
  description: "Add or update a person in Encharge. [See the documentation](https://app-encharge-resources.s3.amazonaws.com/redoc.html#/people/createupdatepeople)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    userId: {
      propDefinition: [
        app,
        "userId",
      ],
      optional: true,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the person.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the person.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the person.",
      optional: true,
    },
    additionalFields: {
      type: "object",
      label: "Additional Fields",
      description: "Additional fields to include in the request body.",
      optional: true,
    },
  },
  async run({ $ }) {
    const parsedAdditionalFields = parseObject(this.additionalFields) || {};
    const data = [
      {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        id: this.userId,
        ...parsedAdditionalFields,
      },
    ];

    const response = await this.app.addOrUpdatePerson({
      $,
      data,
    });

    $.export("$summary", `Successfully ${this.userId
      ? "updated"
      : "added"} person${this.email
      ? ` with email ${this.email}`
      : ""}`);
    return response;
  },
};
