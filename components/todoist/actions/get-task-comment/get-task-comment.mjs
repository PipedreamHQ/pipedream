import getProjectComment from "../get-project-comment/get-project-comment.mjs";

export default {
  ...getProjectComment,
  key: "todoist-get-task-comment",
  name: "Get Task Comment",
  description: "Returns info about a task comment [See the docs here](https://developer.todoist.com/rest/v1/#get-a-comment)",
  version: "0.0.1",
  type: "action",
};
