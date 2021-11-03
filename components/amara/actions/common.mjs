import common from "../common.mjs";

const { amara } = common.props;

export default {
  ...common,
  props: {
    ...common.props,
    videoUrl: {
      propDefinition: [
        amara,
        "videoUrl",
      ],
    },
    primaryAudioLanguageCode: {
      propDefinition: [
        amara,
        "primaryAudioLanguageCode",
      ],
    },
    project: {
      propDefinition: [
        amara,
        "project",
      ],
    },
  },
};
