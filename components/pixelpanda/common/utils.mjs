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

export function parseStrength(strength) {
  const value = Number(strength);
  if (!Number.isFinite(value) || value < 0 || value > 1) {
    throw new ConfigurationError("**Strength** must be a number between `0.0` and `1.0`.");
  }
  return value;
}
