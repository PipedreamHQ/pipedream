import { ConfigurationError } from "@pipedream/platform";
import app from "../../hookdeck.app.mjs";

export default {
  name: "Create Connection",
  description: "This endpoint creates a connection. [See the documentation](https://hookdeck.com/api-ref#create-a-connection).",
  key: "hookdeck-create-connection",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    name: {
      type: "string",
      label: "Connection Name",
      description: "The name of the connection.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the connection.",
      optional: true,
    },
    source: {
      type: "object",
      label: "Source",
      description: "An object representing the source of the connection. Object must contain at least `name`. Please check the [documentation](https://hookdeck.com/api-ref#create-a-connection) for more information.",
      optional: true,
    },
    destination: {
      type: "object",
      label: "Destination",
      description: "An object representing the destination of the connection. Object must contain at least `name` and `url`. Please check the [documentation](https://hookdeck.com/api-ref#create-a-connection) for more information.",
      optional: true,
    },
    sourceId: {
      propDefinition: [
        app,
        "sourceId",
      ],
    },
    destinationId: {
      propDefinition: [
        app,
        "destinationId",
      ],
    },
  },
  async run({ $ }) {
    if (!this.source && !this.sourceId) {
      throw new ConfigurationError("Either `source` or `sourceId` must be provided.");
    }

    if (!this.destination && !this.destinationId) {
      throw new ConfigurationError("Either `destination` or `destinationId` must be provided.");
    }

    if (this.source && this.sourceId) {
      throw new ConfigurationError("Only one of `source` or `sourceId` can be provided.");
    }

    if (this.destination && this.destinationId) {
      throw new ConfigurationError("Only one of `destination` or `destinationId` can be provided.");
    }

    const connection = await this.app.createConnection({
      name: this.name,
      description: this.description,
      source: this.source,
      destination: this.destination,
      source_id: this.sourceId,
      destination_id: this.destinationId,
    }, $);
    $.export("summary", `Connection successfully created with id "${connection.id}".`);
    return connection;
  },
};
