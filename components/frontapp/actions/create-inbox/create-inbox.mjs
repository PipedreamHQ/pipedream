import frontApp from "../../frontapp.app.mjs";

export default {
  key: "frontapp-create-inbox",
  name: "Create Inbox",
  description: "Create an inbox in the default team (workspace). [See the documentation](https://dev.frontapp.com/reference/create-inbox).",
  version: "0.0.1",
  type: "action",
  props: {
    frontApp,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the inbox",
    },
    teammateIds: {
      type: "string[]",
      label: "Teammate IDs",
      description: "An array of teammate IDs that should have access to the inbox. Alternatively, you can supply teammate emails as a resource alias.",
      propDefinition: [
        frontApp,
        "teammateId",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      frontApp,
      name,
      teammateIds,
    } = this;

    const data = {
      name,
      teammate_ids: teammateIds,
    };

    const response = await frontApp.createInbox({
      data,
      $,
    });

    $.export("$summary", `Successfully created inbox "${name}"`);
    return response;
  },
};
