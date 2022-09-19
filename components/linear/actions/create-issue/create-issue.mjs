import linearApp from "../../linear.app.mjs";
import utils from "../../common/utils.mjs";
import createIssue from "../../../linear_app/actions/create-issue/create-issue.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

const {
  // eslint-disable-next-line no-unused-vars
  linearApp: app,
  ...otherProps
} = createIssue.props;

export default {
  ...createIssue,
  key: "linear-create-issue",
  description: "Create an issue (OAuth). See the docs [here](https://developers.linear.app/docs/graphql/working-with-the-graphql-api#creating-and-editing-issues)",
  props: {
    linearApp,
    ...utils.buildPropDefinitions({
      app: linearApp,
      props: otherProps,
    }),
  },
};

