import common from "./base.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  ...common,
  props: {
    ...common.props,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    driveId: {
      propDefinition: [
        common.props.microsoftExcel,
        "driveId",
      ],
    },
    folderId: {
      propDefinition: [
        common.props.microsoftExcel,
        "folderId",
        ({ driveId }) => ({
          driveId,
        }),
      ],
    },
    sheetId: {
      propDefinition: [
        common.props.microsoftExcel,
        "sheetId",
        ({
          folderId, driveId,
        }) => ({
          folderId,
          driveId,
        }),
      ],
    },
    worksheet: {
      propDefinition: [
        common.props.microsoftExcel,
        "worksheet",
        ({
          sheetId, driveId,
        }) => ({
          sheetId,
          driveId,
        }),
      ],
    },
  },
};
