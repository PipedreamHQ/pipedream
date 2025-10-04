import app from "../../workflow_max.app.mjs";
import { parseStringPromise } from "xml2js";

export default {
  key: "workflow_max-delete-client-group",
  name: "Delete Client Group",
  description: "Deletes the specified client group. [See the documentation](https://app.swaggerhub.com/apis-docs/WorkflowMax-BlueRock/WorkflowMax-BlueRock-OpenAPI3/0.1#/Client%20Group/deleteClientGroup)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    clientGroupUuid: {
      propDefinition: [
        app,
        "clientGroupUuid",
      ],
    },
  },
  async run({ $ }) {
    const xmlBody = `
    <Group>
      <UUID>${this.clientGroupUuid}</UUID>
    </Group>
  `.trim();
    const response = await this.app.deleteClientGroup({
      $,
      data: xmlBody,
    });

    const status = response.match(/<Status>(.*?)<\/Status>/)?.[1];
    const error = response.match(/<Error>(.*?)<\/Error>/)?.[1];

    if (status !== "OK") {
      throw new Error(`Workflow Max couldn't delete the client group: ${error}`);
    }

    $.export("$summary", "Successfully deleted the client group: " + this.name);
    return await parseStringPromise(response);
  },
};
