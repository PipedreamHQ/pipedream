import { ConfigurationError } from "@pipedream/platform";
import fs from "fs";
import callerapi from "../../callerapi.app.mjs";

export default {
  key: "callerapi-get-phone-number-picture",
  name: "Get Phone Number Picture",
  description: "Retrieve the profile picture associated with a phone number. [See the documentation](https://callerapi.com/documentation)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    callerapi,
    phoneNumber: {
      propDefinition: [
        callerapi,
        "phoneNumber",
      ],
      description: "The phone number to retrieve the profile picture for, in E.164 format (e.g., +18006927753)",
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  async run({ $ }) {
    try {
      const response = await this.callerapi.getPhonePicture({
        $,
        phoneNumber: this.phoneNumber,
      });
      const fileName = `CallerAPI-Pictgure-${Date.parse(new Date())}.png`;
      const buf = Buffer.from(response, "base64");
      fs.writeFileSync(`/tmp/${fileName}`, buf);

      $.export("$summary", `The profile picture for ${this.phoneNumber} has been successfully retrieved and saved to the /tmp directory.`);
      return {
        path: `/tmp/${fileName}`,
      };
    } catch (e) {
      throw new ConfigurationError(e?.response?.data || e);
    }
  },
};
