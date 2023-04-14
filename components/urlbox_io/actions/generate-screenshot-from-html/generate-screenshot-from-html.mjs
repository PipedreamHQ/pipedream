import common from "../common/base.mjs";

export default {
  ...common,
  key: "urlbox_io-generate-screenshot-from-html",
  name: "Generate Screenshot From HTML",
  description: "Generate a screenshot of a website provided by a html. [See the docs here](https://www.urlbox.io/docs/examplecode/node)",
  version: "0.0.1",
  type: "action",
  props: {
    urlboxIo: common.props.urlboxIo,
    html: {
      propDefinition: [
        common.props.urlboxIo,
        "html",
      ],
    },
    ...common.props,
  },
};
