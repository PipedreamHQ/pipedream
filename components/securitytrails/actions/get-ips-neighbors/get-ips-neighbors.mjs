import app from "../../securitytrails.app.mjs";

export default {
  key: "securitytrails-get-ips-neighbors",
  name: "Get IPs Neighbors",
  description: "Returns the neighbors in any given IP level range and essentially allows you to explore closeby IP addresses.",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    ipaddress: {
      type: "string",
      label: "IP Address",
      description: "Enter the IP address to find neighbors for. Eg. `8.8.8.8`.",
    },
  },
  methods: {
    getIpNeighbors({
      ipaddress, ...args
    }) {
      return this.app._makeRequest({
        path: `/ips/nearby/${ipaddress}`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      getIpNeighbors,
      ipaddress,
    } = this;

    const response = await getIpNeighbors({
      $,
      ipaddress,
    });

    $.export("$summary", `Successfully retrieved \`${response?.blocks.length}\` neighbor(s).`);
    return response;
  },
};
