import ipbase from "../../ipbase.app.mjs";

export default {
  key: "ipbase-list-domains",
  name: "List Domains",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Retrieves all domains hosted on a single IP address. [See the docs here](https://ipbase.com/docs/domains)",
  type: "action",
  props: {
    ipbase,
    ip: {
      propDefinition: [
        ipbase,
        "ip",
      ],
      description: "The IP you want to query the domains for.",
    },
  },
  async run({ $ }) {
    const {
      ipbase,
      ip,
    } = this;
    const response = await ipbase.listDomains({
      $,
      params: {
        ip,
      },
    });

    $.export("$summary", `${response.data.total_count} domain${response.data.total_count > 1
      ? "s were"
      : " was"} successfully fetched!`);
    return response;
  },
};
