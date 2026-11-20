export const DEFAULT_RESPONSES_VISION_MODEL = "gpt-6-luna";

export async function getResponsesVisionModelIds(openai, $) {
  const models = await openai.models({
    $,
  });
  return models
    .map(({ id }) => id)
    .filter((id) => id === DEFAULT_RESPONSES_VISION_MODEL || /4o|o[1-9]|4\.1|gpt-5/i.test(id));
}
