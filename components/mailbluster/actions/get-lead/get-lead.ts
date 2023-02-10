import mailbluster from "../../app/mailbluster.app";

export default {
  key: "mailbluster-get-lead",
  name: "Get A Lead",
  description: "Get a specific lead. [See the docs here](https://app.mailbluster.com/api-doc/leads/read)",
  type: "action",
  version: "0.0.1",
  props: {
    mailbluster,
    leadHash: {
      type: "string",
      label: "Lead Hash",
      description: "[md5](https://en.wikipedia.org/wiki/MD5) encrypted value of lead email.",
    },
  },
  async run({ $ }) {
    const {
      mailbluster,
      leadHash,
    } = this;

    const response = await mailbluster.getLead({
      $,
      leadHash,
    });

    $.export("$summary", `Lead with hash: ${leadHash} was successfully fetched!`);
    return response;
  },
};
