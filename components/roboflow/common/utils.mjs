import { getFileStream } from "@pipedream/platform";

function extractSubstringAfterSlash(str) {
  const match = str.match(/\/(.*)/);
  if (match && match[1]) {
    return match[1];
  } else {
    return null; // Return null if no "/" is found in the string
  }
}

async function getBase64File(filePath) {
  const stream = await getFileStream(filePath);
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("base64");
}

export default {
  extractSubstringAfterSlash,
  getBase64File,
};
