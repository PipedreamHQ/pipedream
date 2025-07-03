import fs from "fs";
import got from "got";
import moment from "moment";
import stream from "stream";
import { promisify } from "util";

const getOutputDirectory = () => {
  return process.env.STASH_DIR || "/tmp";
};

export const getImagePath = async (image) => {
  const regex = new RegExp(/\/tmp\//, "g");
  let imagePath = image;
  const outputDir = getOutputDirectory();

  if (isUrl(image)) {
    imagePath = `${outputDir}/image_${moment().format("YYYYMMDD")}.png`;
    const pipeline = promisify(stream.pipeline);
    await pipeline(
      got.stream(image),
      fs.createWriteStream(imagePath),
    );
  }

  if (imagePath.match(regex)) {
    return imagePath;
  }
  return `${outputDir}/${imagePath}`;
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
  const outputDir = getOutputDirectory();
  for (const image of artifacts) {
    const filePath = `${outputDir}/img_${image.seed}.png`;
    filePaths.push(filePath);
    fs.writeFileSync(
      filePath,
      Buffer.from(image.base64, "base64"),
    );
  }
  return filePaths;
};
