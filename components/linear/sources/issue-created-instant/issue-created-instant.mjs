import linearApp from "../../linear.app.mjs";
import issueCreatedInstant from "../../../linear_app/sources/issue-created-instant/issue-created-instant.mjs";

const {
  // eslint-disable-next-line no-unused-vars
  linearApp: app,
  ...otherProps
} = issueCreatedInstant.props;

export default {
  ...issueCreatedInstant,
  key: "linear-issue-created-instant",
  description: "Emit new event when a new issue is created (OAuth). See the docs [here](https://developers.linear.app/docs/graphql/webhooks)",
  version: "0.0.1",
  props: {
    ...otherProps,
    linearApp,
  },
};
