import clickup from "../../clickup.app.mjs";
import common from "../common/list-props.mjs";
import builder from "../../common/builder.mjs";

export default {
  ...common,
  key: "clickup-create-list-comment",
  name: "Create List Comment",
  description: "Creates a list comment. See the docs [here](https://clickup.com/api) in **Comments / Create List Comment** section.",
  version: "0.0.8",
  type: "action",
  props: {
    ...common.props,
    commentText: {
      label: "Comment Text",
      description: "The text of the comment",
      type: "string",
    },
    notifyAll: {
      label: "Notify All",
      description: "Will notify all",
      type: "boolean",
      default: false,
      optional: true,
    },
    assignees: {
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
      commentText,
      notifyAll,
      assignees,
    } = this;

    const response = await this.clickup.createListComment({
      $,
      listId,
      data: {
        comment_text: commentText,
        notify_all: notifyAll,
        assignees,
      },
    });

    $.export("$summary", "Successfully created comment");

    return response;
  },
};
