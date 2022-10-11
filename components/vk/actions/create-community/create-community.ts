import { defineAction } from "@pipedream/types";
import vk from "../../app/vk.app";
import constants from "../../common/constants";

export default defineAction({
  key: "vk-create-community",
  name: "Create A Community",
  description: "Creates a new community. [See the docs here](https://vk.com/dev/groups.create)",
  type: "action",
  version: "0.0.2",
  props: {
    vk,
    title: {
      type: "string",
      label: "Title",
      description: "Community title.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Community description (ignored for type = `public`).",
      optional: true,
    },
    type: {
      type: "string",
      label: "Type",
      description: "Community type. Default is `group`",
      options: [
        "group",
        "event",
        "public",
      ],
      optional: true,
    },
    subtype: {
      type: "integer",
      label: "Subtype",
      description: "Public page subtype",
      options: constants.SUBTYPES_OPTIONS,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      title,
      description,
      type,
      subtype,
    } = this;

    const response =
      await this.vk.createCommunity({
        params: {
          title,
          description,
          type,
          subtype,
        },
      });

    $.export("$summary", `Successfully created community with ID ${response}`);

    return response;
  },
});
