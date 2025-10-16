import airweave from "../../airweave.app.mjs";

export default {
  key: "airweave-trigger-sync",
  name: "Trigger Source Connection Sync",
  description: "Manually trigger a data sync for a source connection. The sync job runs asynchronously in the background and returns immediately with job details. [See the documentation](https://docs.airweave.ai/api-reference/source-connections/run)",
  version: "0.0.1",
  type: "action",
  props: {
    airweave,
    collectionId: {
      propDefinition: [
        airweave,
        "collectionId",
      ],
      description: "The collection that contains the source connection",
    },
    sourceConnectionId: {
      propDefinition: [
        airweave,
        "sourceConnectionId",
        (c) => ({
          collectionId: c.collectionId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.airweave.runSourceConnection(
      this.sourceConnectionId,
    );

    $.export("$summary", `Successfully triggered sync job: ${response.id} (Status: ${response.status})`);
    
    return response;
  },
};

