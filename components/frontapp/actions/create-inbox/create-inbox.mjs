import frontApp from "../../frontapp.app.mjs";

export default {
  key: "frontapp-create-inbox",
  name: "Create Inbox",
  description: "Create an inbox in the default team (workspace). [See the documentation](https://dev.frontapp.com/reference/create-inbox).",
  version: "0.0.2",
  type: "action",
  props: {
    frontApp,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the inbox",
    },
    teammateIds: {
      propDefinition: [
        frontApp,
        "teammateId",
      ],
      type: "string[]",
      label: "Teammate IDs",
      description: "One or more IDs of teammates that should have access to the inbox",
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
