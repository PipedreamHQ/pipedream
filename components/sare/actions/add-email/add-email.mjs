import { ConfigurationError } from "@pipedream/platform";
import { parseObject } from "../../common/utils.mjs";
import sare from "../../sare.app.mjs";

export default {
  key: "sare-add-email",
  name: "Add Email",
  description: "Add an email to SARE. Optionally, assign the subscriber to a group. [See the documentation](https://dev.sare.pl/rest-api/other/index.html#post-/email/add)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    sare,
    email: {
      propDefinition: [
        sare,
        "email",
      ],
    },
    gsm: {
      propDefinition: [
        sare,
        "gsm",
      ],
    },
    groups: {
      propDefinition: [
        sare,
        "groups",
      ],
      description: "The group to assign the email to.",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name assigned to the email address.",
      optional: true,
    },
    comment: {
      type: "string",
      label: "Comment",
      description: "Address comment.",
      optional: true,
    },
  },
  async run({ $ }) {
    const { response } = await this.sare.addEmail({
      $,
      data: {
        emails: [
          {
            email: this.email,
            gsm: this.gsm,
            groups: this.groups && parseObject(this.groups),
            name: this.name,
            comment: this.comment,
          },
        ],
      },
    });

    if (response.error?.length) {
      throw new ConfigurationError(response.error[0].why);
    }

    $.export("$summary", `Successfully added email: ${this.email}`);
    return response;
  },
};
