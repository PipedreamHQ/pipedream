const BASE_URL = "https://api.wit.ai";
const VERSION = "20240304";

const BUILTIN_INTENTS = {
  WIT_ADD_TIME_TIMER: {
    value: "wit$add_time_timer",
    label: "Add time to the timer",
  },
  WIT_ADD_TO_PLAYLIST: {
    value: "wit$add_to_playlist",
    label: "Add a song to a playlist",
  },
  WIT_CANCEL: {
    value: "wit$cancel",
    label: "Cancels an action or selection",
  },
  WIT_CHECK_WEATHER_CONDITION: {
    value: "wit$check_weather_condition",
    label: "Ask for the weather condition",
  },
  WIT_CONFIRMATION: {
    value: "wit$confirmation",
    label: "Confirms or agrees with information",
  },
  WIT_CREATE_ALARM: {
    value: "wit$create_alarm",
    label: "Create a new alarm",
  },
  WIT_CREATE_PLAYLIST: {
    value: "wit$create_playlist",
    label: "Users can create a new playlist and add the current song to it",
  },
  WIT_CREATE_TIMER: {
    value: "wit$create_timer",
    label: "Create a new timer",
  },
  WIT_DECREASE_VOLUME: {
    value: "wit$decrease_volume",
    label: "Decreases the volume of the selected media",
  },
  WIT_DELETE_ALARM: {
    value: "wit$delete_alarm",
    label: "Delete an alarm",
  },
  WIT_DELETE_PLAYLIST: {
    value: "wit$delete_playlist",
    label: "Deletes the current playlist",
  },
  WIT_DELETE_TIMER: {
    value: "wit$delete_timer",
    label: "Delete the timer",
  },
  WIT_DISLIKE_MUSIC: {
    value: "wit$dislike_music",
    label: "User can let the music service know they don't like this song",
  },
  WIT_FAST_FORWARD_TRACK: {
    value: "wit$fast_forward_track",
    label: "Fast forward this song",
  },
  WIT_GET_ALARMS: {
    value: "wit$get_alarms",
    label: "Find out alarms set",
  },
  WIT_GET_DATE: {
    value: "wit$get_date",
    label: "User wants to know the date",
  },
  WIT_GET_SUNRISE: {
    value: "wit$get_sunrise",
    label: "Ask for sunrise",
  },
  WIT_GET_SUNSET: {
    value: "wit$get_sunset",
    label: "Ask for the sunset",
  },
  WIT_GET_TEMPERATURE: {
    value: "wit$get_temperature",
    label: "Ask for the temperature",
  },
  WIT_GET_TIME: {
    value: "wit$get_time",
    label: "User wants to know the time",
  },
  WIT_GET_TIME_UNTIL_DATE: {
    value: "wit$get_time_until_date",
    label: "User wants to know how many days till a certain date",
  },
  WIT_GET_TIMER: {
    value: "wit$get_timer",
    label: "Get how much time is left on the timer",
  },
  WIT_GET_TRACK_INFO: {
    value: "wit$get_track_info",
    label: "Get information about the current song playing",
  },
  WIT_GET_WEATHER: {
    value: "wit$get_weather",
    label: "Ask for the weather",
  },
  WIT_GO_BACK: {
    value: "wit$go_back",
    label: "Indicates that an action or individual should go back or be reversed",
  },
  WIT_GO_FORWARD: {
    value: "wit$go_forward",
    label: "Indicates that an action or individual should move forward",
  },
  WIT_INCREASE_VOLUME: {
    value: "wit$increase_volume",
    label: "Increases the volume of the selected media",
  },
  WIT_LIKE_MUSIC: {
    value: "wit$like_music",
    label: "Users can like a song and gets saved into the favorites",
  },
  WIT_LOOP_MUSIC: {
    value: "wit$loop_music",
    label: "Repeatedly play this song",
  },
  WIT_NEGATION: {
    value: "wit$negation",
    label: "Denies or disagrees with information",
  },
  WIT_NEVERMIND: {
    value: "wit$nevermind",
    label: "Discards the voice activation",
  },
  WIT_OPEN_RESOURCE: {
    value: "wit$open_resource",
    label: "Opens an app",
  },
  WIT_PAUSE: {
    value: "wit$pause",
    label: "Pauses the media (song, video, podcast)",
  },
  WIT_PAUSE_MUSIC: {
    value: "wit$pause_music",
    label: "Pause the current song playing",
  },
  WIT_PAUSE_TIMER: {
    value: "wit$pause_timer",
    label: "Pause the timer",
  },
  WIT_PLAY: {
    value: "wit$play",
    label: "Plays the media (song, video, podcast)",
  },
  WIT_PLAY_MUSIC: {
    value: "wit$play_music",
    label: "Play music or media content",
  },
  WIT_PLAY_PODCAST: {
    value: "wit$play_podcast",
    label: "Play the particular podcast",
  },
  WIT_PREVIOUS_TRACK: {
    value: "wit$previous_track",
    label: "Play the previous song",
  },
  WIT_REMOVE_FROM_PLAYLIST: {
    value: "wit$remove_from_playlist",
    label: "Deleting a song from the playlist",
  },
  WIT_REPEAT_RESPONSE: {
    value: "wit$repeat_response",
    label: "The statement was unclear; please repeat the response",
  },
  WIT_REPLAY_TRACK: {
    value: "wit$replay_track",
    label: "Replay the current song",
  },
  WIT_RESUME: {
    value: "wit$resume",
    label: "Resumes the media (song, video, podcast)",
  },
  WIT_RESUME_MUSIC: {
    value: "wit$resume_music",
    label: "Resumes the song that was paused",
  },
  WIT_RESUME_TIMER: {
    value: "wit$resume_timer",
    label: "Resume the timer",
  },
  WIT_REWIND_TRACK: {
    value: "wit$rewind_track",
    label: "Rewind the song for 10 seconds",
  },
  WIT_SELECT_ITEM: {
    value: "wit$select_item",
    label: "Indicates a selection",
  },
  WIT_SHARE: {
    value: "wit$share",
    label: "Shares this with another individual",
  },
  WIT_SHUFFLE_PLAYLIST: {
    value: "wit$shuffle_playlist",
    label: "Play the playlist in random order",
  },
  WIT_SILENCE_ALARM: {
    value: "wit$silence_alarm",
    label: "Stop the alarm",
  },
  WIT_SKIP_TRACK: {
    value: "wit$skip_track",
    label: "Skipping the current song playing",
  },
  WIT_SNOOZE_ALARM: {
    value: "wit$snooze_alarm",
    label: "Snooze the alarm",
  },
  WIT_STOP: {
    value: "wit$stop",
    label: "Stops the media (song, video, podcast)",
  },
  WIT_STOP_MUSIC: {
    value: "wit$stop_music",
    label: "Stop music or media content that's playing",
  },
  WIT_SUBTRACT_TIME_TIMER: {
    value: "wit$subtract_time_timer",
    label: "Reduce time from the timer",
  },
  WIT_UNLOOP_MUSIC: {
    value: "wit$unloop_music",
    label: "Stop looping the song",
  },
  WIT_UNSHUFFLE_PLAYLIST: {
    value: "wit$unshuffle_playlist",
    label: "Plays according to the order in the playlist",
  },
};

const BUILTIN_ENTITIES = {
  WIT_AGE_OF_PERSON: {
    value: "wit$age_of_person",
    label: "Captures the age of a person, pet or object",
  },
  WIT_AGENDA_ENTRY: {
    value: "wit$agenda_entry",
    label: "Extrapolates typical agenda items from free text",
  },
  WIT_AMOUNT_OF_MONEY: {
    value: "wit$amount_of_money",
    label: "Measures an amount of money such as $20, 30 euros",
  },
  WIT_CONTACT: {
    value: "wit$contact",
    label: "Captures free text that's either the name or a clear reference to a person",
  },
  WIT_CREATIVE_WORK: {
    value: "wit$creative_work",
    label: "Captures and resolves creative work including movies, TV shows, music albums and tracks",
  },
  WIT_DATETIME: {
    value: "wit$datetime",
    label: "Captures and resolves date and time, like tomorrow at 6pm",
  },
  WIT_DISTANCE: {
    value: "wit$distance",
    label: "Captures a distance in miles or kilometers such as 5km, 5 miles and 12m",
  },
  WIT_DURATION: {
    value: "wit$duration",
    label: "Captures a duration such as 30min, 2 hours or 15sec and normalizes the value in seconds",
  },
  WIT_EMAIL: {
    value: "wit$email",
    label: "Captures an email but do not try to check the validity of the email",
  },
  WIT_LOCAL_SEARCH_QUERY: {
    value: "wit$local_search_query",
    label: "Captures free text that's a query for a local search",
  },
  WIT_LOCATION: {
    value: "wit$location",
    label: "Captures free text that's a typical location, place or address",
  },
  WIT_MATH_EXPRESSION: {
    value: "wit$math_expression",
    label: "Captures free text that's a mathematical, computable expression",
  },
  WIT_MESSAGE_BODY: {
    value: "wit$message_body",
    label: "Captures free text that's the body of a message, such as email or SMS",
  },
  WIT_NOTABLE_PERSON: {
    value: "wit$notable_person",
    label: "Captures and resolves names of notable people and public figures",
  },
  WIT_NUMBER: {
    value: "wit$number",
    label: "Extrapolates a number from free text",
  },
  WIT_ORDINAL: {
    value: "wit$ordinal",
    label: "Captures the measure of an ordinal number",
  },
  WIT_PHONE_NUMBER: {
    value: "wit$phone_number",
    label: "Captures phone numbers, but does not try to check the validity of the number",
  },
  WIT_PHRASE_TO_TRANSLATE: {
    value: "wit$phrase_to_translate",
    label: "Captures free text that is a phrase the user wants to translate",
  },
  WIT_QUANTITY: {
    value: "wit$quantity",
    label: "Captures the quantity of something",
  },
  WIT_REMINDER: {
    value: "wit$reminder",
    label: "Captures free text that's a typical reminder",
  },
  WIT_SEARCH_QUERY: {
    value: "wit$search_query",
    label: "Captures free text that's a generic search engine query",
  },
  WIT_TEMPERATURE: {
    value: "wit$temperature",
    label: "Captures the temperature in units of celsius or fahrenheit degrees",
  },
  WIT_URL: {
    value: "wit$url",
    label: "Captures an URL, but does not try to check the validity of the URL",
  },
  WIT_VOLUME: {
    value: "wit$volume",
    label: "Captures measures of volume like 250 ml, 3 gal",
  },
  WIT_WIKIPEDIA_SEARCH_QUERY: {
    value: "wit$wikipedia_search_query",
    label: "Captures free text that's a typical query for Wikipedia",
  },
  WIT_WOLFRAM_SEARCH_QUERY: {
    value: "wit$wolfram_search_query",
    label: "Captures free text that's a typical query for Wolfram Alpha",
  },
};

const BUILTIN_TRAITS = {
  WIT_BYE: {
    value: "wit$bye",
    label: "A binary trait that captures goodbye intents (example: bye).",
  },
  WIT_GREETINGS: {
    value: "wit$greetings",
    label: "A binary trait that captures greeting intents (example: hello).",
  },
  WIT_ON_OFF: {
    value: "wit$on_off",
    label: "A trait that deciphers the intent of toggling something (e.g. a device with 2 states), such as turning on the lights, turn the tv off or toggle the shades.",
  },
  WIT_SENTIMENT: {
    value: "wit$sentiment",
    label: "A trait that captures the sentiment in an utterance and returns positive, neutral or negative.",
  },
  WIT_THANKS: {
    value: "wit$thanks",
    label: "A binary trait that captures thankful intents, such as thank you.",
  },
};

export default {
  BASE_URL,
  VERSION,
  BUILTIN_INTENTS,
  BUILTIN_ENTITIES,
  BUILTIN_TRAITS,
};
