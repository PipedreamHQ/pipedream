import fs from "fs";
import dreamstudio from "../../dreamstudio.app.mjs";

export default {
  props: {
    dreamstudio,
    organizationId: {
      propDefinition: [
        dreamstudio,
        "organizationId",
      ],
    },
    engineId: {
      propDefinition: [
        dreamstudio,
        "engineId",
        ({ organizationId }) => ({
          organizationId,
        }),
      ],
    },
  },
  methods: {
    parsePrompts(textPrompts) {
      if (typeof textPrompts === "object") {
        return textPrompts.map((item) => JSON.parse(item));
      }
      return JSON.parse(textPrompts);
    },
    writeImg(artifacts) {
      const filePaths = [];
      for (const image of artifacts) {
        filePaths.push(`/tmp/img2img_${image.seed}.png`);
        fs.writeFileSync(
          `/tmp/txt2img_${image.seed}.png`,
          Buffer.from(image.base64, "base64"),
        );
      }
      return filePaths;
    },
  },
};
