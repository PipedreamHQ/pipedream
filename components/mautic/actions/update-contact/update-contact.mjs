import { ConfigurationError } from "@pipedream/platform";
import mautic from "../../mautic.app.mjs";

export default {
  key: "mautic-update-contact",
  name: "Update Contact",
  description: "Updates a contact. [See docs](https://developer.mautic.org/#edit-contact)",
  version: "0.2.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    mautic,
    contactId: {
      propDefinition: [
        mautic,
        "contactId",
      ],
      description: "ID of the contact to update",
      reloadProps: true,
    },
  },
  async additionalProps() {
    if (!this.contactId) return {};
    const contact = await this.mautic.getContact({
      contactId: this.contactId,
    });
    const fields = contact.fields.all;
    const props = Object.keys(fields)
      .filter((key) => fields[key])
      .reduce((props, key) => {
        props[key] = {
          type: "string",
          label: key,
          optional: true,
        };
        return props;
      }, {});
    delete props.id;
    return props;
  },
  async run({ $ }) {
    const data = Object.keys(this)
      .filter((k) => k !== "mautic" && k !== "contactId")
      .reduce((props, k) => {
        props[k] = this[k];
        return props;
      }, {});

    if (Object.keys(data).length === 0) {
      throw new ConfigurationError("Must supply at least one value");
    }

    const response = await this.mautic.updateContact({
      $,
      contactId: this.contactId,
      data,
    });
    $.export("$summary", "Successfully updated contact");
    return response;
  },
};
