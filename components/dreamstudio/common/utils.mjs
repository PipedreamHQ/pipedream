import fs from "fs";
import got from "got";
import moment from "moment";
import stream from "stream";
import { promisify } from "util";

export const getImagePath = async (image) => {
  const regex = new RegExp(/\/tmp\//, "g");
  let imagePath = image;

  if (isUrl(image)) {
    imagePath = `/tmp/image_${moment().format("YYYYMMDD")}.png`;
    const pipeline = promisify(stream.pipeline);
    await pipeline(
      got.stream(image),
      fs.createWriteStream(imagePath),
    );
  }

  if (imagePath.match(regex)) {
    return imagePath;
  }
  return `/tmp/${imagePath}`;
};

export const isUrl = (string) => {
  try {
    return Boolean(new URL(string));
  } catch (e) {
    return false;
  }
};

export const parsePrompts = (textPrompts) => {
  if (typeof textPrompts === "object") {
    return textPrompts.map((item) => {
      if (typeof item === "string") {
        return JSON.parse(item);
      }
      return item;
    });
  }
  return JSON.parse(textPrompts);
};

export const writeImg = async (artifacts) => {
  const filePaths = [];
  for (const image of artifacts) {
    filePaths.push(`/tmp/img_${image.seed}.png`);
    fs.writeFileSync(
      `/tmp/img_${image.seed}.png`,
      Buffer.from(image.base64, "base64"),
    );
  }
  return filePaths;
};
