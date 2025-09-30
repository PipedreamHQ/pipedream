import common from "../common/base.mjs";

export default {
  ...common,
  key: "urlbox_io-generate-screenshot-from-url",
  name: "Generate Screenshot From URL",
  description: "Generate a screenshot of a website provided by a url. [See the docs here](https://www.urlbox.io/docs/examplecode/node)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    urlboxIo: common.props.urlboxIo,
    url: {
      propDefinition: [
        common.props.urlboxIo,
        "url",
      ],
    },
    ...common.props,
  },
};
