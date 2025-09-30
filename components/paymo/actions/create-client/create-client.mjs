import app from "../../paymo.app.mjs";

export default {
  key: "paymo-create-client",
  name: "Create Client",
  description: "Creates a client. [See the docs](https://github.com/paymoapp/api/blob/master/sections/clients.md#create).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the client.",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the client.",
      optional: true,
    },
  },
  methods: {
    createClient(args = {}) {
      return this.app.create({
        path: "/clients",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      name,
      email,
    } = this;

    const response = await this.createClient({
      step,
      data: {
        name,
        email,
      },
    });

    step.export("$summary", `Successfully created client with ID ${response.clients[0].id}`);

    return response;
  },
};
