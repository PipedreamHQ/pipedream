import fs from "fs";
import path from "path";
import constants from "./constants.mjs";

export default {
  isValidFile(filePath) {
    const filePathWithTmp = `/tmp/${filePath}`;
    if (fs.existsSync(filePathWithTmp)) {
      return filePathWithTmp;
    } else if (fs.existsSync(filePath)) {
      return filePath;
    }
    return false;
  },
  getFileStream(filePath) {
    return fs.createReadStream(filePath);
  },
  getFileMeta(filePath) {
    const stats = fs.statSync(filePath);
    return {
      attributes: {
        content_created_at: new Date(stats.ctimeMs).toISOString()
          .split(".")[0] + "Z",
        content_modified_at: new Date(stats.mtimeMs).toISOString()
          .split(".")[0] + "Z",
        name: path.basename(filePath),
        parent: {
          id: 0,
        },
      },
      size: stats.size,
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
