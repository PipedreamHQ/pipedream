import app from "../../fly_io.app.mjs";

export default {
  key: "fly_io-create-volume",
  name: "Create Volume",
  description: "Create a volume for a specific app using the details provided in the request body. [See the documentation](https://docs.machines.dev/#tag/volumes/post/apps/%7Bapp_name%7D/volumes)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    appName: {
      propDefinition: [
        app,
        "appId",
        () => ({
          mapper: ({ name }) => name,
        }),
      ],
    },
    name: {
      type: "string",
      label: "Volume Name",
      description: "The name of the volume",
    },
    sizeGb: {
      type: "integer",
      label: "Volume Size (GB)",
      description: "The size of the volume in GB",
    },
    region: {
      type: "string",
      label: "Volume Region",
      description: "The region where the volume will be created",
      optional: true,
    },
  },
  methods: {
    createVolume({
      appName, ...args
    } = {}) {
      return this.app.post({
        path: `/apps/${appName}/volumes`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createVolume,
      appName,
      name,
      sizeGb,
      region,
    } = this;
    const response = await createVolume({
      $,
      appName,
      data: {
        name,
        size_gb: sizeGb,
        region,
      },
    });

    $.export("$summary", `Successfully created volume with ID \`${response.id}\``);
    return response;
  },
};
