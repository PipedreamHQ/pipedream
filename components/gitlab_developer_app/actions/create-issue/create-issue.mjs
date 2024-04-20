import app from "../../gitlab_developer_app.app.mjs";
import common from "../../../gitlab/actions/create-issue/create-issue.mjs";

const {
  name, description, type, ...others
} = common;

const { // eslint-disable-next-line no-unused-vars
  gitlab, ...props
} = others.props;

export default {
  ...others,
  key: "gitlab_developer_app-create-issue",
  version: "0.0.1",
  name,
  description,
  type,
  props: {
    gitlab: app,
    ...props,
  },
};
