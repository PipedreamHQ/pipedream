import shopify from "../../shopify_developer_app.app.mjs";
import metafieldActions from "../../../shopify/actions/common/metafield-actions.mjs";

export default {
  ...metafieldActions,
  props: {
    ...metafieldActions.props,
    shopify,
  },
};
