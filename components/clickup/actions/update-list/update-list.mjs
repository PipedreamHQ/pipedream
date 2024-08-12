import clickup from "../../clickup.app.mjs";
import common from "../common/list-props.mjs";
import constants from "../common/constants.mjs";
import builder from "../../common/builder.mjs";

export default {
  ...common,
  key: "clickup-update-list",
  name: "Update List",
  description: "Update a list. See the docs [here](https://clickup.com/api) in **Lists / Update List** section.",
  version: "0.0.8",
  type: "action",
  props: {
    ...common.props,
    name: {
      label: "Name",
      type: "string",
      description: "The name of list",
    },
    content: {
      label: "Content",
      type: "string",
      description: "The content of list",
      optional: true,
    },
    priority: {
      propDefinition: [
        clickup,
        "priorities",
      ],
      optional: true,
    },
    assignee: {
      propDefinition: [
        clickup,
        "assignees",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
      optional: true,
    },
    listWithFolder: {
      propDefinition: [
        common.props.clickup,
        "listWithFolder",
      ],
    },
  },
  additionalProps: builder.buildListProps(),
  async run({ $ }) {
    const {
      listId,
      name,
      content,
      priority,
      assignee,
    } = this;

    const data = {
      name,
      content,
      assignee,
    };

    if (priority) data[priority] = constants.PRIORITIES[priority];

    const response = await this.clickup.updateList({
      $,
      listId,
      data,
    });

    $.export("$summary", "Successfully updated list");

    return response;
  },
};
