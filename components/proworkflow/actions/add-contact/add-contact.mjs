import app from "../../proworkflow.app.mjs";

export default {
  key: "proworkflow-add-contact",
  name: "Add Contact",
  description: "Adds a contact. [See the docs](https://api.proworkflow.net/?documentation#gettingstartedpostsingle).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    companyId: {
      propDefinition: [
        app,
        "companyId",
      ],
    },
    firstname: {
      propDefinition: [
        app,
        "firstname",
      ],
    },
    lastname: {
      propDefinition: [
        app,
        "lastname",
      ],
    },
    type: {
      propDefinition: [
        app,
        "contactType",
      ],
    },
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
  },
  methods: {
    createContact(args = {}) {
      return this.app.create({
        path: "/contacts",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      companyId,
      firstname,
      lastname,
      type,
      email,
    } = this;

    const response = await this.createContact({
      step,
      data: {
        companyid: companyId,
        firstname,
        lastname,
        type,
        email,
      },
    });

    step.export("$summary", `${response.message} with ${response.status}.`);

    return response;
  },
};
