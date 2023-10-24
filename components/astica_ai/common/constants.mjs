const LANGUAGES = [
  {
    value: "us-EN",
    label: "USA",
  },
  {
    value: "au-EN",
    label: "Austrailian Voices",
  },
  {
    value: "en-GB",
    label: "Great Britain / England Voices",
  },
  {
    value: "fr-FR",
    label: "French Voices",
  },
  {
    value: "fr-CA",
    label: "French Canadian Voices",
  },
  {
    value: "en-IN",
    label: "Indian Voices",
  },
  {
    value: "en-NG",
    label: "Nigerian Voices",
  },
];

const VOICES = {
  "us-EN": [
    {
      value: 0,
      label: "Default Voice (US Female)",
    },
    {
      value: 1,
      label: "Jennifer (US Female)",
    },
    {
      value: 2,
      label: "Natalie (US Female)",
    },
    {
      value: 3,
      label: "Janet (US Female)",
    },
    {
      value: 5,
      label: "Jerome (US Male)",
    },
    {
      value: 6,
      label: "Chris (US Male)",
    },
    {
      value: 7,
      label: "Bryan (US Male)",
    },
    {
      value: 8,
      label: "Ron (US Male)",
    },
    {
      value: 9,
      label: "Steve (US Male)",
    },
    {
      value: 501,
      label: "Anna (US Female) (Child)",
    },
  ],
  "au-EN": [
    {
      value: 10,
      label: "Derek (AU Male)",
    },
    {
      value: 11,
      label: "Kevin (AU Male)",
    },
    {
      value: 12,
      label: "Nathan (AU Male)",
    },
    {
      value: 13,
      label: "Timothy (AU Male)",
    },
    {
      value: 14,
      label: "Eleanor (AU Female)",
    },
    {
      value: 15,
      label: "Kylie (AU Female)",
    },
    {
      value: 16,
      label: "Natalia (AU Female)",
    },
    {
      value: 17,
      label: "Tina (AU Female)",
    },
    {
      value: 503,
      label: "Carla (AU Female) (Child)",
    },
  ],
  "en-GB": [
    {
      value: 18,
      label: "Olivia (UK Female)",
    },
    {
      value: 19,
      label: "Sophie (UK Female)",
    },
    {
      value: 20,
      label: "Isabella (UK Female)",
    },
    {
      value: 21,
      label: "Abigail (UK Female)",
    },
    {
      value: 22,
      label: "Alfred (UK Male)",
    },
    {
      value: 23,
      label: "Elijah (UK Male)",
    },
    {
      value: 24,
      label: "Evan (UK Male)",
    },
    {
      value: 25,
      label: "Oscar (UK Male)",
    },
    {
      value: 26,
      label: "Raymond (UK Male)",
    },
    {
      value: 27,
      label: "Tom (UK Male)",
    },
    {
      value: 502,
      label: "Maisy (UK Female) (Child)",
    },
  ],
  "fr-FR": [
    {
      value: 2000,
      label: "Alain (Male) (French)",
    },
    {
      value: 2001,
      label: "Henry (Male) (French)",
    },
    {
      value: 2002,
      label: "Denise (Female) (French)",
    },
    {
      value: 2003,
      label: "Cora (Female) (French)",
    },
  ],
  "fr-CA": [
    {
      value: 3000,
      label: "John (Male) (French Canadian)",
    },
    {
      value: 3001,
      label: "Anthony (Male) (French Canadian)",
    },
    {
      value: 3002,
      label: "Sylvia (Female) (French Canadian)",
    },
  ],
  "en-IN": [
    {
      value: 4000,
      label: "Prakash (Indian Male) (English)",
    },
    {
      value: 4001,
      label: "Neha (Indian Female) (English)",
    },
  ],
  "en-NG": [
    {
      value: 5000,
      label: "Abel (Nigerian Male) (English)",
    },
    {
      value: 5001,
      label: "Ezinne (Nigerian Female) (English)",
    },
  ],
};

export default {
  LANGUAGES,
  VOICES,
};
