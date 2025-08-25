import app from "../../gitlab_developer_app.app.mjs";
import common from "@pipedream/gitlab/actions/list-commits/list-commits.mjs";

import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, app);

export default {
  ...others,
  key: "gitlab_developer_app-list-commits",
  version: "0.0.3",
  name,
  description,
  type,
  props: {
    gitlab: app,
    ...props,
  },
};
