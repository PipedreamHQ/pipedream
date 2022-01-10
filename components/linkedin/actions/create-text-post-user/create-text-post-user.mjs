import { axios } from "@pipedream/platform";
import linkedin from "../../linkedin.app.mjs";

export default {
  key: "linkedin-create-text-share-user",
  name: "Create a Text Post (User)",
  description: "Create shares on LinkedIn using text and URLs. [See the docs](https://docs.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/share-on-linkedin#creating-a-share-on-linkedin) for more information",
  version: "0.0.1",
  type: "action",
  props: {
    linkedin,
    name: {
      propDefinition: [
        linkedin,
        "name",
      ],
    },
  },
  async run({ $ }) {
    const payload = this.linkedin.getPayload("NONE", this.name);
    let response = "It wasn't posible to create Post";
    try {
      response = await axios($, this.linkedin.getRequestConfig(payload));
      $.export("$summary", "Successfully created a new Text Post as User");
    } catch (err) {
      $.export("$summary", response);
    }
    return response;
  },
};
