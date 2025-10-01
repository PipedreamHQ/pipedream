import ipbase from "../../ipbase.app.mjs";

export default {
  key: "ipbase-get-asn-info",
  name: "Get ASN Info",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Retrieves information for a specific ASN (autonomous system number). [See the docs here](https://ipbase.com/docs/asns)",
  type: "action",
  props: {
    ipbase,
    asn: {
      type: "string",
      label: "ASN",
      description: "The ASN you want to query.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      ipbase,
      asn,
    } = this;
    const response = await ipbase.getASNInfo({
      $,
      params: {
        asn,
      },
    });

    $.export("$summary", `ASN ${response.data.asn} was successfully fetched!`);
    return response;
  },
};
