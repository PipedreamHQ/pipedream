import { ConfigurationError } from "@pipedream/platform";

export function imageBody({
  imageUrl, imageBase64,
}) {
  if (!imageUrl && !imageBase64) {
    throw new ConfigurationError("Provide either **Image URL** or **Image Base64**.");
  }
  return {
    image_url: imageUrl,
    image_base64: imageBase64,
  };
}
