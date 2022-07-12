import linearApp from "../../linear.app.mjs";
import utils from "../../common/utils.mjs";
import searchIssues from "../../../linear_app/actions/search-issues/search-issues.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

const {
  // eslint-disable-next-line no-unused-vars
  linearApp: app,
  ...otherProps
} = searchIssues.props;

export default {
  ...searchIssues,
  key: "linear-search-issues",
  description: "Search issues (OAuth). See the docs [here](https://developers.linear.app/docs/graphql/working-with-the-graphql-api)",
  props: {
    linearApp,
    ...utils.buildPropDefinitions({
      app: linearApp,
      props: otherProps,
    }),
  },
};

