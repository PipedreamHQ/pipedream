/* eslint-disable pipedream/props-label */
/* eslint-disable pipedream/props-description */
import base from "../common/contact-base.mjs";

export default {
  key: "jobnimbus-create-contact",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  name: "Create Contact",
  description: "Creates a contact. [See the documentation](https://documenter.getpostman.com/view/3919598/S11PpG4x#7ec1541f-7241-4840-9322-0ed83c01d48e)",
  ...base,
  props: {
    ...base.props,
    firstName: {
      ...base.props.firstName,
      optional: false,
    },
    lastName: {
      ...base.props.lastName,
      optional: false,
    },
    displayName: {
      ...base.props.displayName,
      optional: false,
    },
    company: {
      ...base.props.company,
      optional: false,
    },
  },
  async run ({ $ }) {
    const data = this.prepareData();
    const resp = await this.app.createContact({
      $,
      data,
    });
    $.export("$summary", `Successfully created contact with ID ${resp.jnid}`);
    return resp;
  },
};
