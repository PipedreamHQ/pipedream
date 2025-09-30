import digitalOceanApp from "../../digital_ocean.app.mjs";

export default {
  key: "digital_ocean-create-domain",
  name: "Create a new domain",
  description: "Create a new domain. [See the docs here](https://docs.digitalocean.com/reference/api/api-reference/#operation/create_domain)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    digitalOceanApp,
    name: {
      label: "Name",
      type: "string",
      description: "The name of the domain itself. This should follow the standard domain format of domain.TLD. For instance, example.com is a valid domain name.",
    },
    ipAddress: {
      label: "Ip address",
      type: "string",
      description: "This optional attribute may contain an IP address. When provided, an A record will be automatically created pointing to the apex domain.",
    },
  },
  async run({ $ }) {
    const api = this.digitalOceanApp.digitalOceanWrapper();
    const newDomainData = {
      name: this.name,
      ip_address: this.ipAddress,
    };
    const response = await api.domains.create(newDomainData);
    $.export("$summary", `Successfully created domain ${response.domain.name}.`);
    return response;
  },
};
