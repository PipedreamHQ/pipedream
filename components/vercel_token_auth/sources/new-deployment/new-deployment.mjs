/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-description */
/* eslint-disable pipedream/required-properties-version */
/* eslint-disable pipedream/required-properties-type */
import base from "../../../vercel/sources/new-deployment/new-deployment.mjs";
import overrideApp from "../../common/override-app.mjs";

overrideApp(base);

export default {
  ...base,
  key: "vercel_token_auth-new-deployment",
};
