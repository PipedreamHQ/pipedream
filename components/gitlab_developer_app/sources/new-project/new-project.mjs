import app from "../../gitlab_developer_app.app.mjs";
import common from "../../../gitlab/sources/new-project/new-project.mjs";
import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, app);

export default {
  ...others,
  key: "gitlab_developer_app-new-project",
  version: "0.0.1",
  name,
  description,
  type,
  props: {
    gitlab: app,
    ...props,
  },
};
