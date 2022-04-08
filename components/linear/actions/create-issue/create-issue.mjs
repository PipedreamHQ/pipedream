import linearApp from "../../linear.app.mjs";
import utils from "../../common/utils.mjs";
import createIssue from "../../../linear_app/actions/create-issue/create-issue.mjs";

const {
  // eslint-disable-next-line no-unused-vars
  linearApp: app,
  ...otherProps
} = createIssue.props;

export default {
  ...createIssue,
  key: "linear-create-issue",
  description: "Create an issue (OAuth). See the docs [here](https://developers.linear.app/docs/graphql/working-with-the-graphql-api#creating-and-editing-issues)",
  version: "0.0.1",
  props: {
    linearApp,
    ...utils.buildPropDefinitions({
      app: linearApp,
      props: otherProps,
    }),
  },
};
