import app from "../../badger_maps.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "badger_maps-create-check-in",
  name: "Create Check-In",
  description: "Creates a check-in. [See the docs](https://badgerupdatedapi.docs.apiary.io/#reference/check-ins/create-check-in-for-account/save-new-check-in-for-an-account).",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    customer: {
      propDefinition: [
        app,
        "accountId",
      ],
    },
    type: {
      type: "string",
      label: "Type",
      description: "The type of check-in. Eg. `Drop-in`.",
      optional: true,
    },
    comments: {
      type: "string",
      label: "Comments",
      description: "Any comments about the check-in.",
      optional: true,
    },
  },
  methods: {
    createCheckIn(args = {}) {
      return this.app.create({
        path: "/appointments/",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      customer,
      type,
      comments,
    } = this;

    const data = utils.reduceProperties({
      initialProps: {
        customer,
      },
      additionalProps: {
        type,
        comments,
      },
    });

    const response = await this.createCheckIn({
      step,
      data,
    });

    step.export("$summary", `Successfully created check-in with ID \`${response.id}\``);

    return response;
  },
};
