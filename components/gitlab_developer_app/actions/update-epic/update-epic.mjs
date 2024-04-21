import app from "../../gitlab_developer_app.app.mjs";
import common from "../../../gitlab/actions/update-epic/update-epic.mjs";

import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, app);

export default {
  ...others,
  key: "gitlab_developer_app-update-epic",
  version: "0.0.1",
  name,
  description,
  type,
  props: {
    gitlab: app,
    ...props,
  },
};
