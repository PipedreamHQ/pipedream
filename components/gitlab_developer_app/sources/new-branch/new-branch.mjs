import app from "../../gitlab_developer_app.app.mjs";
import common from "@pipedream/gitlab/sources/new-branch/new-branch.mjs";
import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, app);

export default {
  ...others,
  key: "gitlab_developer_app-new-branch",
  version: "0.0.3",
  name,
  description,
  type,
  props: {
    gitlab: app,
    ...props,
  },
};
