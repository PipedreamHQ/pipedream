import app from "../../gitlab_developer_app.app.mjs";
import common from "@pipedream/gitlab/actions/get-repo-branch/get-repo-branch.mjs";

import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, app);

export default {
  ...others,
  key: "gitlab_developer_app-get-repo-branch",
  version: "0.0.2",
  name,
  description,
  type,
  props: {
    gitlab: app,
    ...props,
  },
};
