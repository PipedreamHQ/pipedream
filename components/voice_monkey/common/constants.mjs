const BASE_URL = "https://api.voicemonkey.io/trigger";

const CHIMES = [
  {
    label: "Air Horn 1",
    value: "soundbank://soundlibrary/alarms/air_horns/air_horn_01",
  },
  {
    label: "Boing 1",
    value: "soundbank://soundlibrary/alarms/beeps_and_bloops/boing_01",
  },
  {
    label: "Bell 1",
    value: "soundbank://soundlibrary/alarms/beeps_and_bloops/bell_01",
  },
  {
    label: "Bell 2",
    value: "soundbank://soundlibrary/alarms/beeps_and_bloops/bell_02",
  },
  {
    label: "Bell 3",
    value: "soundbank://soundlibrary/alarms/chimes_and_bells/chimes_bells_05",
  },
  {
    label: "Buzzer 1",
    value: "soundbank://soundlibrary/alarms/buzzers/buzzers_01",
  },
  {
    label: "Buzzer 2",
    value: "soundbank://soundlibrary/alarms/buzzers/buzzers_04",
  },
  {
    label: "Chimes",
    value: "soundbank://soundlibrary/alarms/chimes_and_bells/chimes_bells_04",
  },
  {
    label: "Ding 1",
    value: "soundbank://soundlibrary/alarms/beeps_and_bloops/bell_03",
  },
  {
    label: "Ding 2",
    value: "soundbank://soundlibrary/alarms/beeps_and_bloops/bell_04",
  },
  {
    label: "Doorbell 1",
    value: "soundbank://soundlibrary/home/amzn_sfx_doorbell_01",
  },
  {
    label: "Doorbell 2",
    value: "soundbank://soundlibrary/home/amzn_sfx_doorbell_chime_02",
  },
  {
    label: "Electronic Beep 1",
    value: "soundbank://soundlibrary/musical/amzn_sfx_electronic_beep_01",
  },
  {
    label: "Electronic Beep 2",
    value: "soundbank://soundlibrary/musical/amzn_sfx_electronic_beep_02",
  },
  {
    label: "Electronic Beep 3",
    value: "soundbank://soundlibrary/scifi/amzn_sfx_scifi_timer_beep_01",
  },
  {
    label: "Intro 1",
    value: "soundbank://soundlibrary/alarms/beeps_and_bloops/intro_02",
  },
  {
    label: "Siren 1",
    value: "soundbank://soundlibrary/scifi/amzn_sfx_scifi_alarm_01",
  },
  {
    label: "Siren 2",
    value: "soundbank://soundlibrary/alarms/beeps_and_bloops/buzz_03",
  },
  {
    label: "Tone 1",
    value: "soundbank://soundlibrary/musical/amzn_sfx_test_tone_01",
  },
  {
    label: "Tone 2",
    value: "soundbank://soundlibrary/alarms/beeps_and_bloops/tone_02",
  },
  {
    label: "Tone 3",
    value: "soundbank://soundlibrary/alarms/beeps_and_bloops/tone_05",
  },
  {
    label: "Woosh",
    value: "soundbank://soundlibrary/alarms/beeps_and_bloops/woosh_02",
  },
];

const VOICES = [
  {
    label: "Danish (F) - Naja",
    value: "Naja",
  },
  {
    label: "Danish (M) - Mads",
    value: "Mads",
  },
  {
    label: "Dutch (F) - Lotte",
    value: "Lotte",
  },
  {
    label: "Dutch (M) - Ruben",
    value: "Ruben",
  },
  {
    label: "English, Australian (F) - Nicole",
    value: "Nicole",
  },
  {
    label: "English, Australian (M) - Russell",
    value: "Russell",
  },
  {
    label: "English, British (F) - Amy",
    value: "Amy",
  },
  {
    label: "English, British (F) - Emma",
    value: "Emma",
  },
  {
    label: "English, British (M) - Brian",
    value: "Brian",
  },
  {
    label: "English, Indian (F) - Raveena",
    value: "Raveena",
  },
  {
    label: "English, Indian (F) - Aditi",
    value: "Aditi",
  },
  {
    label: "English, US (F) - Ivy",
    value: "Ivy",
  },
  {
    label: "English, US (F) - Joanna",
    value: "Joanna",
  },
  {
    label: "English, US (F) - Kendra",
    value: "Kendra",
  },
  {
    label: "English, US (F) - Kimberly",
    value: "Kimberly",
  },
  {
    label: "English, US (F) - Salli",
    value: "Salli",
  },
  {
    label: "English, US (M) - Joey",
    value: "Joey",
  },
  {
    label: "English, US (M) - Justin",
    value: "Justin",
  },
  {
    label: "English, US (M) - Matthew",
    value: "Matthew",
  },
  {
    label: "English, Welsh (M) - Geraint",
    value: "Geraint",
  },
  {
    label: "French (F) - Céline",
    value: "Celine",
  },
  {
    label: "French (F) - Léa",
    value: "Lea",
  },
  {
    label: "French (M) - Mathieu",
    value: "Mathieu",
  },
  {
    label: "French, Canadian (F) - Chantal",
    value: "Chantal",
  },
  {
    label: "German (F) - Marlene",
    value: "Marlene",
  },
  {
    label: "German (F) - Vicki",
    value: "Vicki",
  },
  {
    label: "German (M) - Hans",
    value: "Hans",
  },
  {
    label: "Hindi (F) - Aditi",
    value: "Aditi",
  },
  {
    label: "Icelandic (F) - Dóra",
    value: "Dóra",
  },
  {
    label: "Icelandic (M) - Karl",
    value: "Karl",
  },
  {
    label: "Italian (F) - Carla",
    value: "Carla",
  },
  {
    label: "Italian (M) - Giorgio",
    value: "Giorgio",
  },
  {
    label: "Japanese (M) - Takumi",
    value: "Takumi",
  },
  {
    label: "Japanese (F) - Mizuki",
    value: "Mizuki",
  },
  {
    label: "Korean (F) - Seoyeon",
    value: "Seoyeon",
  },
  {
    label: "Norwegian (F) - Liv",
    value: "Liv",
  },
  {
    label: "Polish (F) - Ewa",
    value: "Ewa",
  },
  {
    label: "Polish (F) - Maja",
    value: "Maja",
  },
  {
    label: "Polish (M) - Jacek",
    value: "Jacek",
  },
  {
    label: "Polish (M) - Jan",
    value: "Jan",
  },
  {
    label: "Portugese, Brazilian (F) - Vitória",
    value: "Vitoria",
  },
  {
    label: "Portugese, Brazilian (M) - Ricardo",
    value: "Ricardo",
  },
  {
    label: "Portugese, European (F) - Inês",
    value: "Ines",
  },
  {
    label: "Portugese, European (M) - Cristiano",
    value: "Cristiano",
  },
  {
    label: "Romanian (F) - Carmen",
    value: "Carmen",
  },
  {
    label: "Russian (F) - Tatyana",
    value: "Tatyana",
  },
  {
    label: "Russian (M) - Maxim",
    value: "Maxim",
  },
  {
    label: "Spanish, European (F) - Conchita",
    value: "Conchita",
  },
  {
    label: "Spanish, European (M) - Enrique",
    value: "Enrique",
  },
  {
    label: "Spanish, US (F) - Penélope",
    value: "Penélope",
  },
  {
    label: "Spanish, US (M) - Miguel",
    value: "Miguel",
  },
  {
    label: "Swedish (F) - Astrid",
    value: "Astrid",
  },
  {
    label: "Turkish (F) - Filiz",
    value: "Filiz",
  },
  {
    label: "Welsh (F) - Gwyneth",
    value: "Gwyneth",
  },
];

export default {
  BASE_URL,
  CHIMES,
  VOICES,
};
