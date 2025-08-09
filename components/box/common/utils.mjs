import constants from "./constants.mjs";
import { getFileStreamAndMetadata } from "@pipedream/platform";

function optionalParseAsJSON(value) {
  try {
    return JSON.parse(value);
  } catch (e) {
    return value;
  }
}

export default {
  parseObjectEntries(value = {}) {
    const obj = typeof value === "string"
      ? JSON.parse(value)
      : value;
    return Object.fromEntries(
      Object.entries(obj).map(([
        key,
        value,
      ]) => [
        key,
        optionalParseAsJSON(value),
      ]),
    );
  },
  async getFileData(filePath) {
    const {
      stream, metadata,
    } = await getFileStreamAndMetadata(filePath);
    return {
      fileContent: stream,
      fileMeta: {
        attributes: {
          content_created_at: new Date(metadata.lastModified).toISOString()
            .split(".")[0] + "Z",
          content_modified_at: new Date(metadata.lastModified).toISOString()
            .split(".")[0] + "Z",
          name: metadata.name,
          parent: {
            id: 0,
          },
        },
        size: metadata.size,
        contentType: metadata.contentType,
      },
    };
  },
  checkRFC3339(dateTimeStr) {
    //2012-12-12T10:53:43-08:00
    // eslint-disable-next-line no-useless-escape
    const re = /^((?:(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}:\d{2}))(Z|[\+-]\d{2}:\d{2})?)$/;
    return re.test(dateTimeStr);
  },
  async *getResourcesStream({
    resourceFn,
    resourceFnArgs,
  }) {
    let page = 0;
    while (true) {
      const nextResources = await resourceFn({
        ...resourceFnArgs,
        params: {
          ...resourceFnArgs.params,
          offset: page * constants.pageSize,
          limit: constants.pageSize,
        },
      });
      if (!nextResources) {
        throw new Error("No response from Box API.");
      }
      page++;
      for (const resource of nextResources.entries) {
        yield resource;
      }
      if (!nextResources.entries.length || nextResources.entries.length < constants.pageSize) {
        return;
      }
    }
  },
};
