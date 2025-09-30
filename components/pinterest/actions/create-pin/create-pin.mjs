import pinterest from "../../pinterest.app.mjs";
import { ConfigurationError } from "@pipedream/platform";
import utils from "../../common/utils.mjs";

export default {
  type: "action",
  key: "pinterest-create-pin",
  version: "0.1.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  name: "Create a Pin",
  description: "Create a Pin on a board or board section, [See the docs](https://developers.pinterest.com/docs/api/v5/#operation/pins/create)",
  props: {
    pinterest,
    boardId: {
      propDefinition: [
        pinterest,
        "boardId",
      ],
    },
    boardSectionId: {
      propDefinition: [
        pinterest,
        "boardSectionId",
        (configuredProps) => ({
          boardId: configuredProps.boardId,
        }),
      ],
    },
    title: {
      propDefinition: [
        pinterest,
        "title",
      ],
    },
    description: {
      propDefinition: [
        pinterest,
        "description",
      ],
    },
    link: {
      propDefinition: [
        pinterest,
        "link",
      ],
    },
    altText: {
      propDefinition: [
        pinterest,
        "altText",
      ],
    },
    media: {
      propDefinition: [
        pinterest,
        "media",
      ],
    },
  },
  async run ({ $ }) {
    let mediaSource;
    const media = this.media;
    const fileValidation = utils.isValidFile(media);
    if (fileValidation) {
      mediaSource = utils.getFileMeta(fileValidation);
    } else if (await utils.isValidUrl(media)) {
      mediaSource = utils.getUrlMeta(media);
    } else {
      const downloadedFile = await utils.getUrlResource(media);
      if (!downloadedFile) {
        throw new ConfigurationError("`media` must be a valid file path or a valid URL!");
      } else {
        mediaSource = utils.getFileMeta(downloadedFile.path, downloadedFile.contentType);
      }
    }
    const resp = await this.pinterest.createPin({
      $,
      data: {
        board_id: this.boardId,
        board_section_id: this.boardSectionId,
        title: this.title,
        description: this.description,
        link: this.link,
        alt_text: this.altText,
        media_source: mediaSource,
      },
    });
    $.export("$summary", `Pin with ID:${resp.id} has been created.`);
    return resp;
  },
};
