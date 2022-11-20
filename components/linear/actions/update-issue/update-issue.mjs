import updateIssue from "../../../linear_app/actions/update-issue/update-issue.mjs";
import utils from "../../common/utils.mjs";
import additionalProps from "../../common/additionalProps.mjs";

const appProps = utils.getAppProps(updateIssue).props;
const { linearApp } = appProps;

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...updateIssue,
  key: "linear-update-issue",
  description:
    "Update an issue (OAuth). See the docs [here](https://developers.linear.app/docs/graphql/working-with-the-graphql-api#creating-and-editing-issues)",
  version: "0.0.6",
  props: {
    ...appProps,
    createAsUser: {
      propDefinition: [
        linearApp,
        "createAsUser",
      ],
    },
  },
  additionalProps,
};
