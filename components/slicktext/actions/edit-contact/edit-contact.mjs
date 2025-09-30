import { objectCamelToSnakeCase } from "../../common/utils.mjs";
import slicktext from "../../slicktext.app.mjs";
import { commonProps } from "../common/base.mjs";

export default {
  key: "slicktext-edit-contact",
  name: "Edit Contact",
  description: "Updates personal details of an existing contact. [See the documentation](https://api.slicktext.com/docs/v1/contacts#6)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    slicktext,
    contactId: {
      propDefinition: [
        slicktext,
        "contactId",
      ],
    },
    mobileNumber: {
      propDefinition: [
        slicktext,
        "mobileNumber",
      ],
      optional: true,
    },
    ...commonProps,
  },
  async run({ $ }) {
    const {
      slicktext,
      contactId,
      ...data
    } = this;

    const response = await slicktext.updateContact({
      $,
      contactId,
      data: objectCamelToSnakeCase(data),
    });

    $.export("$summary", `Successfully updated contact with ID: ${this.contactId}`);
    return response;
  },
};
