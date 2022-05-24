import linearApp from "../../linear.app.mjs";
import utils from "../../common/utils.mjs";
import updateIssue from "../../../linear_app/actions/update-issue/update-issue.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */

const {
  // eslint-disable-next-line no-unused-vars
  linearApp: app,
  ...otherProps
} = updateIssue.props;

export default {
  ...updateIssue,
  key: "linear-update-issue",
  description: "Update an issue (OAuth). See the docs [here](https://developers.linear.app/docs/graphql/working-with-the-graphql-api#creating-and-editing-issues)",
  version: "0.0.2",
  props: {
    linearApp,
    ...utils.buildPropDefinitions({
      app: linearApp,
      props: otherProps,
    }),
  },
};
