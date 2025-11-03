import app from "../../webinarfuel.app.mjs";

export default {
  key: "webinarfuel-add-tags-to-registrant",
  name: "Add Tags To Registrant",
  description: "Adds tags to an existing registrant. [See the documentation](https://webinarfuel.docs.apiary.io/#/reference/registrant/add-tags)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
    tags: {
      propDefinition: [
        app,
        "tags",
      ],
    },
  },
  methods: {
    addTags(args = {}) {
      return this.app.post({
        path: "/registrants/add_tags",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      addTags,
      email,
      tags,
    } = this;

    return addTags({
      step,
      data: {
        email,
        tags,
      },
      summary: (response) => `Successfully added tags to registrant email ${response.registrant.email}.`,
    });
  },
};
