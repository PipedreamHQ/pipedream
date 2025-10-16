import app from "../../fly_io.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "fly_io-create-machine",
  name: "Create Machine",
  description: "Create a machine within a specific app using the details provided in the request body. [See the documentation](https://docs.machines.dev/#tag/machines/post/apps/%7Bapp_name%7D/machines)",
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
      label: "Machine Name",
      description: "The name of the machine within the app",
    },
    config: {
      type: "string",
      label: "Machine Configuration",
      description: "The configuration details of the machine in JSON format. Eg. `{ \"auto_destroy\": true, \"image\": \"ubuntu:latest\" }`",
    },
    skipLaunch: {
      type: "boolean",
      label: "Skip Launch",
      description: "Whether to skip the launch of the machine",
      optional: true,
    },
    skipServiceRegistration: {
      type: "boolean",
      label: "Skip Service Registration",
      description: "Whether to skip the registration of the machine as a service",
      optional: true,
    },
  },
  methods: {
    createMachine({
      appName, ...args
    } = {}) {
      return this.app.post({
        path: `/apps/${appName}/machines`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createMachine,
      appName,
      name,
      config,
      skipLaunch,
      skipServiceRegistration,
    } = this;
    const response = await createMachine({
      $,
      appName,
      data: {
        name,
        config: utils.valueToObject(config),
        skip_launch: skipLaunch,
        skip_service_registration: skipServiceRegistration,
      },
    });
    $.export("$summary", `Successfully created machine with ID \`${response.id}\`.`);
    return response;
  },
};
