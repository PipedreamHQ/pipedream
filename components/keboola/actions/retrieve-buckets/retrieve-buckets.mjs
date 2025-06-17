import keboola from "../../keboola.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "keboola-retrieve-buckets",
  name: "Retrieve Buckets",
  description: "Lists all buckets in your Keboola project. [See the documentation](https://keboola.docs.apiary.io/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    keboola,
  },
  async run({ $ }) {
    const buckets = await this.keboola.listBuckets();
    $.export("$summary", `Successfully retrieved ${buckets.length} buckets.`);
    return buckets;
  },
};
