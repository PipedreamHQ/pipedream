import linearApp from "../../linear.app.mjs";
import issueUpdatedInstant from "../../../linear_app/sources/issue-updated-instant/issue-updated-instant.mjs";

const {
  // eslint-disable-next-line no-unused-vars
  linearApp: app,
  ...otherProps
} = issueUpdatedInstant.props;

export default {
  ...issueUpdatedInstant,
  key: "linear-issue-updated-instant",
  description: "Emit new event when an issue is updated (OAuth). See the docs [here](https://developers.linear.app/docs/graphql/webhooks)",
  version: "0.0.1",
  props: {
    ...otherProps,
    linearApp,
  },
};
