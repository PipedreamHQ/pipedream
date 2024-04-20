import app from "../../gitlab_developer_app.app.mjs";
import common from "../../../gitlab/actions/get-repo-branch/get-repo-branch.mjs";

const {
  name, description, type, ...others
} = common;

const { // eslint-disable-next-line no-unused-vars
  gitlab, ...props
} = others.props;

export default {
  ...others,
  key: "gitlab_developer_app-get-repo-branch",
  version: "0.0.1",
  name,
  description,
  type,
  props: {
    gitlab: app,
    ...props,
  },
};
