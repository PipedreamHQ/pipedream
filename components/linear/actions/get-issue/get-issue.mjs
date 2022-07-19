import linearApp from "../../linear.app.mjs";
import utils from "../../common/utils.mjs";
import getIssue from "../../../linear_app/actions/get-issue/get-issue.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

const {
  // eslint-disable-next-line no-unused-vars
  linearApp: app,
  ...otherProps
} = getIssue.props;

export default {
  ...getIssue,
  key: "linear-get-issue",
  description: "Get an issue by ID (OAuth). See the docs [here](https://developers.linear.app/docs/graphql/working-with-the-graphql-api)",
  props: {
    linearApp,
    ...utils.buildPropDefinitions({
      app: linearApp,
      props: otherProps,
    }),
  },
};

