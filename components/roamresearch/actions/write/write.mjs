import app from "../../roamresearch.app.mjs";
import utils from "../../common/utils.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "roamresearch-write",
  name: "Write",
  description: "Generic write for Roam Research pages. [See the documentation](https://roamresearch.com/#/app/developer-documentation/page/mdnjFsqoA).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    action: {
      type: "string",
      label: "Action",
      description: "The action to run. Eg. `create-block`.",
      options: Object.values(constants.ACTION),
      reloadProps: true,
    },
  },
  additionalProps() {
    const { action } = this;

    if (action === constants.ACTION.CREATE_BLOCK) {
      return {
        location: {
          type: "object",
          label: "Location",
          description: "The location to create the block where `order` is required and either `parent-uid` or `page-title` is required.",
          default: {
            ["parent-uid"]: "optional",
            ["page-title"]: "optional",
            order: "last",
          },
        },
        block: {
          type: "object",
          label: "Block",
          description: "The block to create where `string` is required.",
          default: {
            string: "required",
            uid: "optional",
            open: "optional",
            heading: "optional",
            ["text-align"]: "optional",
            ["children-view-type"]: "optional",
          },
        },
      };
    }

    if (action === constants.ACTION.MOVE_BLOCK) {
      return {
        location: {
          type: "object",
          label: "Location",
          description: "The location to move the block where `order` is required and either `parent-uid` or `page-title` is required.",
          default: {
            ["parent-uid"]: "optional",
            ["page-title"]: "optional",
            order: "last",
          },
        },
        block: {
          type: "object",
          label: "Block",
          description: "The block to move where `uid` is required.",
          default: {
            uid: "required",
          },
        },
      };
    }

    if (action === constants.ACTION.UPDATE_BLOCK) {
      return {
        block: {
          type: "object",
          label: "Block",
          description: "The block to update where `uid` is required.",
          default: {
            uid: "required",
            string: "optional",
            open: "optional",
            heading: "optional",
            ["text-align"]: "optional",
            ["children-view-type"]: "optional",
          },
        },
      };
    }

    if (action === constants.ACTION.DELETE_BLOCK) {
      return {
        block: {
          type: "object",
          label: "Block",
          description: "The block to delete where `uid` is required.",
          default: {
            uid: "required",
          },
        },
      };
    }

    if (action === constants.ACTION.CREATE_PAGE) {
      return {
        page: {
          type: "object",
          label: "Page",
          description: "The page to create where `title` is required.",
          default: {
            title: "required",
            uid: "optional",
            ["children-view-type"]: "optional",
          },
        },
      };
    }

    if (action === constants.ACTION.UPDATE_PAGE) {
      return {
        page: {
          type: "object",
          label: "Page",
          description: "The page to update where `uid` is required.",
          default: {
            uid: "required",
            title: "optional",
            ["children-view-type"]: "optional",
          },
        },
      };
    }

    if (action === constants.ACTION.DELETE_PAGE) {
      return {
        page: {
          type: "object",
          label: "Page",
          description: "The page to delete where `uid` is required.",
          default: {
            uid: "required",
          },
        },
      };
    }

    if (action === constants.ACTION.BATCH_ACTIONS) {
      return {
        actions: {
          type: "string[]",
          label: "Actions",
          description: "The actions to run in batch. Eg. `{ \"action\": \"create-block\", \"location\": {...}, \"block\": {...} }`",
        },
      };
    }

    return {};
  },
  async run({ $ }) {
    const {
      app,
      action,
      location,
      block,
      page,
      actions,
    } = this;

    const response = await app.write({
      $,
      data: {
        action,
        location,
        block,
        page,
        actions: utils.parseArray(actions),
      },
    });

    $.export("$summary", "Successfully ran the action.");
    return response;
  },
};
