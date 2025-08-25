import app from "../../gitlab_developer_app.app.mjs";
import common from "@pipedream/gitlab/actions/list-repo-branches/list-repo-branches.mjs";

import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, app);

export default {
  ...others,
  key: "gitlab_developer_app-list-repo-branches",
  version: "0.0.2",
  name,
  description,
  type,
  props: {
    gitlab: app,
    ...props,
  },
};
