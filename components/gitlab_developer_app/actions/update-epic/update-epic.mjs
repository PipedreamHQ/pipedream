import app from "../../gitlab_developer_app.app.mjs";
import common from "../../../gitlab/actions/update-epic/update-epic.mjs";

const {
  name, description, type, ...others
} = common;

const { // eslint-disable-next-line no-unused-vars
  gitlab, ...props
} = others.props;

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
