import common from "../common/list-props.mjs";
import builder from "../../common/builder.mjs";
import propsFragments from "../../common/props-fragments.mjs";

export default {
  ...common,
  key: "clickup-create-chat-view-comment",
  name: "Create Chat View Comment",
  description: "Creates a chat view comment. See the docs [here](https://clickup.com/api) in **Comments / Create Chat View Comment** section.",
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
        common.props.clickup,
        "assignees",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
      optional: true,
    },
    listWithFolder: {
      optional: true,
      propDefinition: [
        common.props.clickup,
        "listWithFolder",
      ],
    },
  },
  additionalProps: builder.buildListProps({
    listPropsOptional: true,
    tailProps: {
      viewId: propsFragments.viewId,
    },
  }),
  async run({ $ }) {
    const {
      viewId,
      commentText,
      notifyAll,
      assignees,
    } = this;

    const response = await this.clickup.createViewComment({
      $,
      viewId,
      data: {
        comment_text: commentText,
        notify_all: notifyAll,
        assignees,
      },
    });

    $.export("$summary", "Successfully created view comment");

    return response;
  },
};
