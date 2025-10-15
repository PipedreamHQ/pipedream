import mautic from "../../mautic.app.mjs";
import {
  pick,
  pickBy,
} from "lodash-es";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "mautic-create-contact",
  name: "Create Contact",
  description: "Creates a new contact. [See docs](https://developer.mautic.org/#create-contact)",
  version: "0.2.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    mautic,
    firstname: {
      type: "string",
      label: "First Name",
      description: "First name of the contact",
      optional: true,
    },
    lastname: {
      type: "string",
      label: "Last Name",
      description: "Last name of the contact",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email of the contact",
      optional: true,
    },
    company: {
      propDefinition: [
        mautic,
        "companyId",
      ],
      description: "Company of the contact",
      optional: true,
    },
    position: {
      type: "string",
      label: "Position",
      description: "Position in the company",
      optional: true,
    },
    owner: {
      propDefinition: [
        mautic,
        "userId",
      ],
      label: "Owner",
      description: "ID of a Mautic user to assign this contact to.",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = pickBy(pick(this, [
      "firstname",
      "lastname",
      "email",
      "position",
      "owner",
    ]));

    if (this.company) data.company = this.company.label;

    if (Object.keys(data).length === 0) {
      throw new ConfigurationError("Must supply at least one value");
    }

    const response = await this.mautic.createContact({
      $,
      data: {
        ...data,
        tags: [
          "pipedream",
        ],
      },
    });
    $.export("$summary", "Successfully created contact");
    return response;
  },
};
