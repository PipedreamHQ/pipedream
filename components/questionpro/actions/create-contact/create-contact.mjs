import questionpro from "../../questionpro.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "questionpro-create-contact",
  name: "Create Contact",
  description: "Create a contact in a survey. [See the documentation](https://www.questionpro.com/api/create-email-addresses.html)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    questionpro,
    organizationId: {
      propDefinition: [
        questionpro,
        "organizationId",
      ],
    },
    userId: {
      propDefinition: [
        questionpro,
        "userId",
        (c) => ({
          organizationId: c.organizationId,
        }),
      ],
    },
    surveyId: {
      propDefinition: [
        questionpro,
        "surveyId",
        (c) => ({
          userId: c.userId,
        }),
      ],
    },
    emailListId: {
      propDefinition: [
        questionpro,
        "emailListId",
        (c) => ({
          surveyId: c.surveyId,
        }),
      ],
    },
    emailAddress: {
      type: "string",
      label: "Email Address",
      description: "The email address of the contact",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the contact",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the contact",
    },
    additionalFields: {
      type: "object",
      label: "Additional Fields",
      description: "A key-value collection of additional contact fields to add to the contact",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.questionpro.createContact({
      $,
      surveyId: this.surveyId,
      emailListId: this.emailListId,
      data: [
        {
          emailAddress: this.emailAddress,
          firstname: this.firstName,
          lastname: this.lastName,
          ...parseObject(this.additionalFields),
        },
      ],
    });

    $.export("$summary", `Successfully created contact with email: ${this.emailAddress}`);
    return response;
  },
};
