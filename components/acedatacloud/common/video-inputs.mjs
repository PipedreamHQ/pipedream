import {
  requiredHttpUrl, requiredText,
} from "./utils.mjs";

/** Normalize explicitly supplied reference URLs without fetching their content. */
const urls = (value, label, max = Infinity) => {
  if (value === undefined || value === null) return [];
  const values = Array.isArray(value)
    ? value
    : [
      value,
    ];
  if (values.length > max) throw new Error(`${label} supports at most ${max} references.`);
  return values.map((value) => requiredHttpUrl(value, label));
};
const optionalUrl = (value, label) => value
  ? requiredHttpUrl(value, label)
  : undefined;

/** Veo first/last frames and ingredients use distinct published actions. */
export const veoInput = (step) => {
  const action = step.generationMode || "text2video";
  const model = requiredText(step.model, "Model");
  const images = urls(step.imageUrls, "Reference Images", action === "ingredients2video"
    ? 3
    : 2);
  if (![
    "text2video",
    "image2video",
    "ingredients2video",
  ].includes(action)) throw new Error("Choose a supported Veo generation mode.");
  if (action !== "text2video" && !images.length) throw new Error("This mode requires reference images.");
  if (action === "text2video" && images.length) throw new Error("Select an image or ingredients mode to use reference images.");
  if ((action === "ingredients2video") !== (model === "veo31-fast-ingredients")) {
    throw new Error("Ingredients mode requires the veo31-fast-ingredients model; the action will not substitute models.");
  }
  return {
    action,
    model,
    prompt: requiredText(step.prompt, "Prompt"),
    aspect_ratio: "16:9",
    ...(images.length && {
      image_urls: images,
    }),
  };
};

/** Kling uses frame URLs for image mode and structured reference lists for Omni. */
export const klingInput = (step) => {
  const action = step.generationMode || "text2video";
  const model = requiredText(step.model, "Model");
  const prompt = requiredText(step.prompt, "Prompt");
  const mode = step.qualityMode || "std";
  const first = optionalUrl(step.firstFrameUrl, "First Frame");
  const last = optionalUrl(step.lastFrameUrl, "Last Frame");
  const images = urls(step.referenceImageUrls, "Omni Reference Images", 7);
  const video = optionalUrl(step.referenceVideoUrl, "Omni Reference Video");
  const referType = step.videoReferenceType || "base";
  const omni = [
    "kling-o1",
    "kling-v3-omni",
  ].includes(model);
  if (![
    "text2video",
    "image2video",
  ].includes(action)) throw new Error("Choose a supported Kling generation mode.");
  if (![
    "std",
    "pro",
    "4k",
  ].includes(mode)) throw new Error("Choose a supported quality mode.");
  if (action === "image2video" && !first && !images.length && !video) throw new Error("Image mode requires a first frame or Omni reference.");
  if (action === "text2video" && (first || last)) throw new Error("Select Image to Video to use frame URLs.");
  if (last && !first) throw new Error("A last frame requires a first frame.");
  if ((images.length || video) && !omni) throw new Error("Reference lists require a published Kling Omni model.");
  if (omni && mode === "4k") throw new Error("Kling Omni does not support 4k mode.");
  if (last && [
    "kling-v2-master",
    "kling-v2-1-master",
  ].includes(model)) throw new Error("This model does not support a last frame.");
  if (last && [
    "kling-v1-6",
    "kling-v2-5-turbo",
    "kling-v2-6",
  ].includes(model) && mode !== "pro") throw new Error("This model requires Pro mode for a last frame.");
  if (![
    "base",
    "feature",
  ].includes(referType)) throw new Error("Choose a supported video reference type.");
  if (video && referType === "base" && (first || last)) throw new Error("Base video references cannot be combined with first/last frames.");
  if (video && images.length > 4) throw new Error("A video reference allows at most four image references.");
  if (video && step.generateAudio === true) throw new Error("Reference-video requests require generated audio to be disabled.");
  images.forEach((_, index) => {
    if (!prompt.includes(`<<<image_${index + 1}>>>`)) throw new Error("Reference each Omni image in Prompt using <<<image_N>>>.");
  });
  if (video && !prompt.includes("<<<video_1>>>")) throw new Error("Reference the Omni video in Prompt using <<<video_1>>>.");
  return {
    action,
    model,
    prompt,
    mode,
    duration: 5,
    aspect_ratio: "16:9",
    ...(first && {
      start_image_url: first,
    }),
    ...(last && {
      end_image_url: last,
    }),
    ...(images.length && {
      image_list: images.map((image_url) => ({
        image_url,
      })),
    }),
    ...(video && {
      video_list: [
        {
          video_url: video,
          refer_type: referType,
          keep_original_sound: step.keepOriginalSound
            ? "yes"
            : "no",
        },
      ],
      generate_audio: false,
    }),
    ...(!video && step.generateAudio !== undefined && {
      generate_audio: step.generateAudio,
    }),
  };
};

/** Wan 2.6 has separate image/reference models; Wan 3 consumes typed media. */
export const wanInput = (step) => {
  const generationMode = step.generationMode || "text2video";
  const model = requiredText(step.model, "Model");
  const prompt = requiredText(step.prompt, "Prompt");
  const first = optionalUrl(step.firstFrameUrl, "First Frame");
  const last = optionalUrl(step.lastFrameUrl, "Last Frame");
  const images = urls(step.referenceImageUrls, "Reference Images", 10);
  const videos = urls(step.referenceVideoUrls, "Reference Videos", 10);
  const audio = urls(step.referenceAudioUrls, "Reference Audio", 10);
  if (![
    "text2video",
    "image2video",
    "reference2video",
  ].includes(generationMode)) throw new Error("Choose a supported Wan generation mode.");
  if (generationMode === "image2video" && !first) throw new Error("Image mode requires a first frame.");
  if (last && !first) throw new Error("A last frame requires a first frame.");
  if (generationMode !== "image2video" && (first || last)) throw new Error("Select Image to Video to use frame URLs.");
  if (generationMode !== "reference2video" && (images.length || videos.length || audio.length)) throw new Error("Select Reference to Video to use reference media.");
  if (generationMode === "reference2video" && !images.length && !videos.length && !audio.length) throw new Error("Reference mode requires media.");
  if (model === "wan3.0-video") {
    const media = [
      ...(first
        ? [
          {
            type: "first_frame",
            url: first,
          },
        ]
        : []),
      ...(last
        ? [
          {
            type: "last_frame",
            url: last,
          },
        ]
        : []),
      ...images.map((url) => ({
        type: "reference_image",
        url,
      })),
      ...videos.map((url) => ({
        type: "reference_video",
        url,
      })),
      ...audio.map((url) => ({
        type: "reference_audio",
        url,
      })),
    ];
    if (media.length > 10) throw new Error("Wan 3 supports at most ten media references.");
    return {
      model,
      prompt,
      duration: 5,
      ...(media.length && {
        media,
      }),
    };
  }
  if (last || images.length || audio.length) throw new Error("Use Wan 3 for last-frame, image-reference, or audio-reference media.");
  if ([
    "wan2.6-i2v",
    "wan2.6-i2v-flash",
  ].includes(model) && generationMode !== "image2video") throw new Error("This Wan model requires Image to Video and a first frame.");
  if (model === "wan2.6-r2v" && (generationMode !== "reference2video" || !videos.length)) throw new Error("wan2.6-r2v requires reference video URLs.");
  if (model === "wan2.6-t2v" && generationMode !== "text2video") throw new Error("wan2.6-t2v is a text-to-video model.");
  return {
    action: generationMode === "reference2video"
      ? "text2video"
      : generationMode,
    model,
    prompt,
    duration: 5,
    resolution: "720P",
    ...(first && {
      image_url: first,
    }),
    ...(videos.length && {
      reference_video_urls: videos,
    }),
  };
};

/** HappyHorse publishes a separate model family for each generation/editing action. */
export const happyhorseInput = (step) => {
  const action = step.generationMode || "generate";
  const model = requiredText(step.model, "Model");
  const suffixes = {
    generate: "-t2v",
    image_to_video: "-i2v",
    reference_to_video: "-r2v",
    video_edit: "-video-edit",
  };
  if (!suffixes[action] || !model.endsWith(suffixes[action])) throw new Error("Choose the HappyHorse model family matching the selected mode.");
  const first = optionalUrl(step.firstFrameUrl, "First Frame");
  const video = optionalUrl(step.videoUrl, "Video to Edit");
  const images = urls(step.referenceImageUrls, "Reference Images", action === "video_edit"
    ? 5
    : 9);
  if (action === "image_to_video" && !first) throw new Error("Image mode requires a first frame.");
  if (action === "reference_to_video" && !images.length) throw new Error("Reference mode requires reference images.");
  if (action === "video_edit" && !video) throw new Error("Video Edit requires a video URL.");
  if (action !== "image_to_video" && first) throw new Error("First Frame belongs to Image to Video mode.");
  if (action !== "video_edit" && video) throw new Error("Video to Edit belongs to Video Edit mode.");
  if (![
    "reference_to_video",
    "video_edit",
  ].includes(action) && images.length) throw new Error("Choose reference or editing mode to use reference images.");
  return {
    action,
    model,
    prompt: requiredText(step.prompt, "Prompt"),
    resolution: "720P",
    duration: 3,
    ratio: "16:9",
    ...(first && {
      image_url: first,
    }),
    ...(video && {
      video_url: video,
    }),
    ...(images.length && {
      image_urls: images,
    }),
  };
};

/** Seedance frame and multimodal-reference scenarios are mutually exclusive. */
export const seedanceInput = (step) => {
  const model = requiredText(step.model, "Model");
  const first = optionalUrl(step.firstFrameUrl, "First Frame");
  const last = optionalUrl(step.lastFrameUrl, "Last Frame");
  const is25 = model === "doubao-seedance-2-5-260628";
  const images = urls(step.referenceImageUrls, "Reference Images");
  const videos = urls(step.referenceVideoUrls, "Reference Videos", is25
    ? 10
    : 3);
  const audio = urls(step.referenceAudioUrls, "Reference Audio", is25
    ? 10
    : 3);
  const references = images.length || videos.length || audio.length;
  if (last && !first) throw new Error("A last frame requires a first frame.");
  if ((first || last) && references) throw new Error("Frame URLs cannot be combined with reference media.");
  if (references && !model.startsWith("doubao-seedance-2-")) throw new Error("Multimodal reference inputs require Seedance 2.x.");
  if (audio.length && !is25 && !images.length && !videos.length) throw new Error("Seedance 2.0 audio references need an image or video reference.");
  if (model === "doubao-seedance-1-0-lite-i2v-250428" && !first) throw new Error("This image-to-video model requires a first frame.");
  if (model === "doubao-seedance-1-0-lite-t2v-250428" && (first || last || references)) throw new Error("This Seedance model only supports text-to-video.");
  const content = [
    {
      type: "text",
      text: requiredText(step.prompt, "Prompt"),
    },
    ...(first
      ? [
        {
          type: "image_url",
          role: "first_frame",
          image_url: {
            url: first,
          },
        },
      ]
      : []),
    ...(last
      ? [
        {
          type: "image_url",
          role: "last_frame",
          image_url: {
            url: last,
          },
        },
      ]
      : []),
    ...images.map((url) => ({
      type: "image_url",
      role: "reference_image",
      image_url: {
        url,
      },
    })),
    ...videos.map((url) => ({
      type: "video_url",
      role: "reference_video",
      video_url: {
        url,
      },
    })),
    ...audio.map((url) => ({
      type: "audio_url",
      role: "reference_audio",
      audio_url: {
        url,
      },
    })),
  ];
  return {
    model,
    content,
    resolution: step.resolution || "480p",
    ratio: "16:9",
    generate_audio: false,
  };
};
