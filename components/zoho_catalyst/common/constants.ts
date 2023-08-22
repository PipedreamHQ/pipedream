export const MODERATION_MODE_OPTIONS = [
  {
    label: "Detects nudity alone",
    value: "basic",
  },
  {
    label: "Detects nudity and racy content",
    value: "moderate",
  },
  {
    label: "Detects all criteria mentioned in the documentation",
    value: "advanced",
  },
];

export const FACE_ANALYTICS_MODE_OPTIONS = [
  {
    label:
      "0-point landmark detector that detects the boundary of the face alone",
    value: "basic",
  },
  {
    label:
      "5-point landmark detector that detects- Eyes: The center of both eyes, Nose: Nose tip, Lips: The center of both lips",
    value: "moderate",
  },
  {
    label:
      "68-point landmark detector that detects- Jawline: Face boundary, Eyebrows: Left and right eyebrow, Eyes: Left and right eye, Nose bridge, Nostril line, Upper lips: Upper and lower edge, Lower lips: Upper and lower edge",
    value: "advanced",
  },
];
