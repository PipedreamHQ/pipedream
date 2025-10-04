import app from "../../workflow_max.app.mjs";
import { parseStringPromise } from "xml2js";

export default {
  key: "workflow_max-create-client-group",
  name: "Create Client Group",
  description: "Creates a new Client Group in Workflow Max. [See the documentation](https://app.swaggerhub.com/apis-docs/WorkflowMax-BlueRock/WorkflowMax-BlueRock-OpenAPI3/0.1#/Client/createClient)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    clientUuid: {
      propDefinition: [
        app,
        "clientUuid",
      ],
    },
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
    taxable: {
      propDefinition: [
        app,
        "taxable",
      ],
    },
  },
  async run({ $ }) {
    const xmlBody = `
    <Group>
      <ClientUUID>${this.clientUuid}</ClientUUID>
      <Name>${this.name}</Name>
      <Taxable>${this.taxable
    ? "Yes"
    : "No"}</Taxable>
    </Group>
  `.trim();
    const response = await this.app.createClientGroup({
      $,
      data: xmlBody,
    });

    const status = response.match(/<Status>(.*?)<\/Status>/)?.[1];
    const error = response.match(/<Error>(.*?)<\/Error>/)?.[1];

    if (status !== "OK") {
      throw new Error(`Workflow Max couldn't create the client group: ${error}`);
    }

    $.export("$summary", "Successfully created the client group: " + this.name);
    return await parseStringPromise(response);
  },
};
