import { objectCamelToSnakeCase } from "../../common/utils.mjs";
import slicktext from "../../slicktext.app.mjs";
import { commonProps } from "../common/base.mjs";

export default {
  key: "slicktext-create-contact",
  name: "Create Contact",
  description: "Add a new contact to your messaging list. [See the documentation](https://api.slicktext.com/docs/v1/contacts)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    slicktext,
    mobileNumber: {
      propDefinition: [
        slicktext,
        "mobileNumber",
      ],
    },
    ...commonProps,
    forceDoubleOptIn: {
      propDefinition: [
        slicktext,
        "forceDoubleOptIn",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      slicktext,
      ...data
    } = this;

    const response = await slicktext.createContact({
      $,
      data: objectCamelToSnakeCase(data),
    });
    $.export("$summary", `Successfully initiated opt-in for contact with number: ${this.mobileNumber}`);
    return response;
  },
};
