import axios from "axios";
import fs from "fs";
import urlExists from "url-exist";
import { encode } from "js-base64";
import mime from "mime-types";
import constants from "./constants.mjs";

export default {
  isValidFile(filePath) {
    const filePathWithTmp = `/tmp/${filePath}`;
    if (fs.existsSync(filePathWithTmp)) {
      return filePathWithTmp;
    } else if (fs.existsSync(filePath)) {
      return filePath;
    } else {
      return false;
    }
  },
  getFileMeta(filePath, contentType) {
    return {
      source_type: "image_base64",
      content_type: contentType ?? mime.lookup(filePath),
      data: encode([
        ...fs.readFileSync(filePath, {
          flag: "r",
        }).values(),
      ]),
    };
  },
  async isValidUrl(url) {
    return urlExists(url);
  },
  async getUrlResource(url) {
    try {
      const path = `/tmp/${(Math.random() + 1).toString(36).substring(2)}`;
      const response = await axios({
        url,
        method: "GET",
        responseType: "stream",
      });
      return new Promise((resolve, reject) => {
        const writeStream = response.data.pipe(fs.createWriteStream(path));
        writeStream.on("finish", () => {
          resolve({
            path,
            contentType: response.headers["content-type"],
          });
        });
        writeStream.on("error", (err) => {
          reject(err);
        });
      });
    } catch (err) {
      return false;
    }
  },
  getUrlMeta(url) {
    return {
      source_type: "image_url",
      url,
    };
  },
  async *getResourcesStream({
    resourceFn,
    resourceFnArgs,
  }) {
    let bookmark;
    while (true) {
      const nextResources = await resourceFn({
        ...resourceFnArgs,
        params: {
          ...resourceFnArgs.params,
          bookmark,
          page_size: constants.pageSize,
        },
      });
      bookmark = nextResources?.bookmark;
      if (!nextResources) {
        throw new Error("No response from Pinterest API.");
      }
      for (const resource of nextResources.items) {
        yield resource;
      }
      if (!bookmark) {
        return;
      }
    }
  },
};
