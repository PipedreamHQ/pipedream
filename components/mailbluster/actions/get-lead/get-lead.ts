import md5 from "md5";
import mailbluster from "../../app/mailbluster.app";

export default {
  key: "mailbluster-get-lead",
  name: "Get Lead",
  description: "Get a specific lead. [See the documentation](https://app.mailbluster.com/api-doc/leads/read)",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    mailbluster,
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the lead.",
    },
  },
  async run({ $ }) {
    const {
      mailbluster,
      email,
    } = this;

    const response = await mailbluster.getLead({
      $,
      leadHash: md5(email),
    });

    $.export("$summary", `Lead with email: ${email} was successfully fetched!`);
    return response;
  },
};
