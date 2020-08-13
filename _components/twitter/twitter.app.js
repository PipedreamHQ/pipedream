const axios = require('axios')
const querystring = require('querystring')
const moment = require('moment')

module.exports = {
  type: "app",
  app: "twitter",
  propDefinitions: {
    q: {
      type: "string",
      label: 'Search Term',
      description: "Search for keywords `star wars`, screen names `@starwars`, or hashtags `#starwars`. You can also use Twitter's [standard search operators](https://developer.twitter.com/en/docs/tweets/rules-and-filtering/overview/standard-operators).",
    },
    keyword_filter: {
      type: "string",
      label: 'Keywords',
      description: "Filter tweets based on keywords `star wars`, user mentions `@starwars`, or hashtags `#starwars`. You can also use Twitter's [standard search operators](https://developer.twitter.com/en/docs/tweets/rules-and-filtering/overview/standard-operators).",
      optional: true,
    },
    result_type: { 
      type: "string", 
      label: "Result Type",
      description: `Specifies the type of results you want to retrieve.`,
      optional: true,
      options: [
        { label: "Recent", value: "recent" }, 
        { label: "Popular", value: "popular" },
        { label: "Mixed", value: "mixed" },
      ],
      default: 'recent',
    },
    count: {
      type: "integer",
      min: 1,
      max: 100,
      label: "Count (advanced)",
      description: "The maximum number of tweets to return per API request (up to `100`)",
      optional: true,
      default: 100,
    },
    maxRequests: {
      type: "integer",
      min: 1,
      max: 180,
      label: "Max API Requests per Execution (advanced)",
      description: "The maximum number of API requests to make per execution (e.g., multiple requests are required to retrieve paginated results). **Note:** Twitter [rate limits API requests](https://developer.twitter.com/en/docs/basics/rate-limiting) per 15 minute interval.",
      optional: true,
      default: 1,
    },
    from: {
      type: "string",
      label: "From",
      description: "The screen name of the user (e.g., `pipedream`)",
    },
    geocode: {
      type: "string",
      label: "Geocode",
      description: "Returns tweets by users located within a given radius of the given latitude/longitude. The location is preferentially taking from the Geotagging API, but will fall back to their Twitter profile. The parameter value is specified by `latitude,longitude,radius`, where radius units must be specified as either `mi` (miles) or `km` (kilometers). Note that you cannot use the near operator via the API to geocode arbitrary locations; however you can use this geocode parameter to search near geocodes directly.",
      optional: true,
    },
    includeRetweets: {
      type: "string", 
      label: "Retweets",
      description: "Select whether to `include`, `exclude` or `only` include retweets in emitted events.",
      optional: true,
      options: [
        { label: "Include", value: "include" },
        { label: "Exclude", value: "exclude" }, 
        { label: "Only include retweets", value: "only" },      
      ],
      default: "include",
    },
    includeReplies: {
      type: "string", 
      label: "Replies",
      description: "Select whether to `include`, `exclude` or `only` include replies in emitted events.",
      optional: true,
      options: [
        { label: "Include", value: "include" },
        { label: "Exclude", value: "exclude" }, 
        { label: "Only include replies", value: "only" },      
      ],
      default: "include",
    },
    enrichTweets: {
      type: "boolean", 
      label: "Enrich Tweets",
      description: "Enrich each tweet with epoch (milliseconds) and ISO8601 conversions of Twitter's `created_at` timestamp.",
      optional: true,
      default: true,
    },
    locale: {
      type: "string",
      label: "Locale",
      description: "Specify the language of the query you are sending (only `ja` is currently effective). This is intended for language-specific consumers and the default should work in the majority of cases.",
      optional: true,
    },
    lang: {
      type: "string",
      label: "Language",
      description: "Restricts tweets to the given language. Language detection is best-effort.",
      optional: true,
      async options(opts) {
        // data from https://datahub.io/core/language-codes
        const isoLanguages = [
          {
            "English": "Afar",
            "alpha2": "aa"
          },
          {
            "English": "Abkhazian",
            "alpha2": "ab"
          },
          {
            "English": "Avestan",
            "alpha2": "ae"
          },
          {
            "English": "Afrikaans",
            "alpha2": "af"
          },
          {
            "English": "Akan",
            "alpha2": "ak"
          },
          {
            "English": "Amharic",
            "alpha2": "am"
          },
          {
            "English": "Aragonese",
            "alpha2": "an"
          },
          {
            "English": "Arabic",
            "alpha2": "ar"
          },
          {
            "English": "Assamese",
            "alpha2": "as"
          },
          {
            "English": "Avaric",
            "alpha2": "av"
          },
          {
            "English": "Aymara",
            "alpha2": "ay"
          },
          {
            "English": "Azerbaijani",
            "alpha2": "az"
          },
          {
            "English": "Bashkir",
            "alpha2": "ba"
          },
          {
            "English": "Belarusian",
            "alpha2": "be"
          },
          {
            "English": "Bulgarian",
            "alpha2": "bg"
          },
          {
            "English": "Bihari languages",
            "alpha2": "bh"
          },
          {
            "English": "Bislama",
            "alpha2": "bi"
          },
          {
            "English": "Bambara",
            "alpha2": "bm"
          },
          {
            "English": "Bengali",
            "alpha2": "bn"
          },
          {
            "English": "Tibetan",
            "alpha2": "bo"
          },
          {
            "English": "Breton",
            "alpha2": "br"
          },
          {
            "English": "Bosnian",
            "alpha2": "bs"
          },
          {
            "English": "Catalan; Valencian",
            "alpha2": "ca"
          },
          {
            "English": "Chechen",
            "alpha2": "ce"
          },
          {
            "English": "Chamorro",
            "alpha2": "ch"
          },
          {
            "English": "Corsican",
            "alpha2": "co"
          },
          {
            "English": "Cree",
            "alpha2": "cr"
          },
          {
            "English": "Czech",
            "alpha2": "cs"
          },
          {
            "English": "Church Slavic; Old Slavonic; Church Slavonic; Old Bulgarian; Old Church Slavonic",
            "alpha2": "cu"
          },
          {
            "English": "Chuvash",
            "alpha2": "cv"
          },
          {
            "English": "Welsh",
            "alpha2": "cy"
          },
          {
            "English": "Danish",
            "alpha2": "da"
          },
          {
            "English": "German",
            "alpha2": "de"
          },
          {
            "English": "Divehi; Dhivehi; Maldivian",
            "alpha2": "dv"
          },
          {
            "English": "Dzongkha",
            "alpha2": "dz"
          },
          {
            "English": "Ewe",
            "alpha2": "ee"
          },
          {
            "English": "Greek, Modern (1453-)",
            "alpha2": "el"
          },
          {
            "English": "English",
            "alpha2": "en"
          },
          {
            "English": "Esperanto",
            "alpha2": "eo"
          },
          {
            "English": "Spanish; Castilian",
            "alpha2": "es"
          },
          {
            "English": "Estonian",
            "alpha2": "et"
          },
          {
            "English": "Basque",
            "alpha2": "eu"
          },
          {
            "English": "Persian",
            "alpha2": "fa"
          },
          {
            "English": "Fulah",
            "alpha2": "ff"
          },
          {
            "English": "Finnish",
            "alpha2": "fi"
          },
          {
            "English": "Fijian",
            "alpha2": "fj"
          },
          {
            "English": "Faroese",
            "alpha2": "fo"
          },
          {
            "English": "French",
            "alpha2": "fr"
          },
          {
            "English": "Western Frisian",
            "alpha2": "fy"
          },
          {
            "English": "Irish",
            "alpha2": "ga"
          },
          {
            "English": "Gaelic; Scottish Gaelic",
            "alpha2": "gd"
          },
          {
            "English": "Galician",
            "alpha2": "gl"
          },
          {
            "English": "Guarani",
            "alpha2": "gn"
          },
          {
            "English": "Gujarati",
            "alpha2": "gu"
          },
          {
            "English": "Manx",
            "alpha2": "gv"
          },
          {
            "English": "Hausa",
            "alpha2": "ha"
          },
          {
            "English": "Hebrew",
            "alpha2": "he"
          },
          {
            "English": "Hindi",
            "alpha2": "hi"
          },
          {
            "English": "Hiri Motu",
            "alpha2": "ho"
          },
          {
            "English": "Croatian",
            "alpha2": "hr"
          },
          {
            "English": "Haitian; Haitian Creole",
            "alpha2": "ht"
          },
          {
            "English": "Hungarian",
            "alpha2": "hu"
          },
          {
            "English": "Armenian",
            "alpha2": "hy"
          },
          {
            "English": "Herero",
            "alpha2": "hz"
          },
          {
            "English": "Interlingua (International Auxiliary Language Association)",
            "alpha2": "ia"
          },
          {
            "English": "Indonesian",
            "alpha2": "id"
          },
          {
            "English": "Interlingue; Occidental",
            "alpha2": "ie"
          },
          {
            "English": "Igbo",
            "alpha2": "ig"
          },
          {
            "English": "Sichuan Yi; Nuosu",
            "alpha2": "ii"
          },
          {
            "English": "Inupiaq",
            "alpha2": "ik"
          },
          {
            "English": "Ido",
            "alpha2": "io"
          },
          {
            "English": "Icelandic",
            "alpha2": "is"
          },
          {
            "English": "Italian",
            "alpha2": "it"
          },
          {
            "English": "Inuktitut",
            "alpha2": "iu"
          },
          {
            "English": "Japanese",
            "alpha2": "ja"
          },
          {
            "English": "Javanese",
            "alpha2": "jv"
          },
          {
            "English": "Georgian",
            "alpha2": "ka"
          },
          {
            "English": "Kongo",
            "alpha2": "kg"
          },
          {
            "English": "Kikuyu; Gikuyu",
            "alpha2": "ki"
          },
          {
            "English": "Kuanyama; Kwanyama",
            "alpha2": "kj"
          },
          {
            "English": "Kazakh",
            "alpha2": "kk"
          },
          {
            "English": "Kalaallisut; Greenlandic",
            "alpha2": "kl"
          },
          {
            "English": "Central Khmer",
            "alpha2": "km"
          },
          {
            "English": "Kannada",
            "alpha2": "kn"
          },
          {
            "English": "Korean",
            "alpha2": "ko"
          },
          {
            "English": "Kanuri",
            "alpha2": "kr"
          },
          {
            "English": "Kashmiri",
            "alpha2": "ks"
          },
          {
            "English": "Kurdish",
            "alpha2": "ku"
          },
          {
            "English": "Komi",
            "alpha2": "kv"
          },
          {
            "English": "Cornish",
            "alpha2": "kw"
          },
          {
            "English": "Kirghiz; Kyrgyz",
            "alpha2": "ky"
          },
          {
            "English": "Latin",
            "alpha2": "la"
          },
          {
            "English": "Luxembourgish; Letzeburgesch",
            "alpha2": "lb"
          },
          {
            "English": "Ganda",
            "alpha2": "lg"
          },
          {
            "English": "Limburgan; Limburger; Limburgish",
            "alpha2": "li"
          },
          {
            "English": "Lingala",
            "alpha2": "ln"
          },
          {
            "English": "Lao",
            "alpha2": "lo"
          },
          {
            "English": "Lithuanian",
            "alpha2": "lt"
          },
          {
            "English": "Luba-Katanga",
            "alpha2": "lu"
          },
          {
            "English": "Latvian",
            "alpha2": "lv"
          },
          {
            "English": "Malagasy",
            "alpha2": "mg"
          },
          {
            "English": "Marshallese",
            "alpha2": "mh"
          },
          {
            "English": "Maori",
            "alpha2": "mi"
          },
          {
            "English": "Macedonian",
            "alpha2": "mk"
          },
          {
            "English": "Malayalam",
            "alpha2": "ml"
          },
          {
            "English": "Mongolian",
            "alpha2": "mn"
          },
          {
            "English": "Marathi",
            "alpha2": "mr"
          },
          {
            "English": "Malay",
            "alpha2": "ms"
          },
          {
            "English": "Maltese",
            "alpha2": "mt"
          },
          {
            "English": "Burmese",
            "alpha2": "my"
          },
          {
            "English": "Nauru",
            "alpha2": "na"
          },
          {
            "English": "Bokmål, Norwegian; Norwegian Bokmål",
            "alpha2": "nb"
          },
          {
            "English": "Ndebele, North; North Ndebele",
            "alpha2": "nd"
          },
          {
            "English": "Nepali",
            "alpha2": "ne"
          },
          {
            "English": "Ndonga",
            "alpha2": "ng"
          },
          {
            "English": "Dutch; Flemish",
            "alpha2": "nl"
          },
          {
            "English": "Norwegian Nynorsk; Nynorsk, Norwegian",
            "alpha2": "nn"
          },
          {
            "English": "Norwegian",
            "alpha2": "no"
          },
          {
            "English": "Ndebele, South; South Ndebele",
            "alpha2": "nr"
          },
          {
            "English": "Navajo; Navaho",
            "alpha2": "nv"
          },
          {
            "English": "Chichewa; Chewa; Nyanja",
            "alpha2": "ny"
          },
          {
            "English": "Occitan (post 1500)",
            "alpha2": "oc"
          },
          {
            "English": "Ojibwa",
            "alpha2": "oj"
          },
          {
            "English": "Oromo",
            "alpha2": "om"
          },
          {
            "English": "Oriya",
            "alpha2": "or"
          },
          {
            "English": "Ossetian; Ossetic",
            "alpha2": "os"
          },
          {
            "English": "Panjabi; Punjabi",
            "alpha2": "pa"
          },
          {
            "English": "Pali",
            "alpha2": "pi"
          },
          {
            "English": "Polish",
            "alpha2": "pl"
          },
          {
            "English": "Pushto; Pashto",
            "alpha2": "ps"
          },
          {
            "English": "Portuguese",
            "alpha2": "pt"
          },
          {
            "English": "Quechua",
            "alpha2": "qu"
          },
          {
            "English": "Romansh",
            "alpha2": "rm"
          },
          {
            "English": "Rundi",
            "alpha2": "rn"
          },
          {
            "English": "Romanian; Moldavian; Moldovan",
            "alpha2": "ro"
          },
          {
            "English": "Russian",
            "alpha2": "ru"
          },
          {
            "English": "Kinyarwanda",
            "alpha2": "rw"
          },
          {
            "English": "Sanskrit",
            "alpha2": "sa"
          },
          {
            "English": "Sardinian",
            "alpha2": "sc"
          },
          {
            "English": "Sindhi",
            "alpha2": "sd"
          },
          {
            "English": "Northern Sami",
            "alpha2": "se"
          },
          {
            "English": "Sango",
            "alpha2": "sg"
          },
          {
            "English": "Sinhala; Sinhalese",
            "alpha2": "si"
          },
          {
            "English": "Slovak",
            "alpha2": "sk"
          },
          {
            "English": "Slovenian",
            "alpha2": "sl"
          },
          {
            "English": "Samoan",
            "alpha2": "sm"
          },
          {
            "English": "Shona",
            "alpha2": "sn"
          },
          {
            "English": "Somali",
            "alpha2": "so"
          },
          {
            "English": "Albanian",
            "alpha2": "sq"
          },
          {
            "English": "Serbian",
            "alpha2": "sr"
          },
          {
            "English": "Swati",
            "alpha2": "ss"
          },
          {
            "English": "Sotho, Southern",
            "alpha2": "st"
          },
          {
            "English": "Sundanese",
            "alpha2": "su"
          },
          {
            "English": "Swedish",
            "alpha2": "sv"
          },
          {
            "English": "Swahili",
            "alpha2": "sw"
          },
          {
            "English": "Tamil",
            "alpha2": "ta"
          },
          {
            "English": "Telugu",
            "alpha2": "te"
          },
          {
            "English": "Tajik",
            "alpha2": "tg"
          },
          {
            "English": "Thai",
            "alpha2": "th"
          },
          {
            "English": "Tigrinya",
            "alpha2": "ti"
          },
          {
            "English": "Turkmen",
            "alpha2": "tk"
          },
          {
            "English": "Tagalog",
            "alpha2": "tl"
          },
          {
            "English": "Tswana",
            "alpha2": "tn"
          },
          {
            "English": "Tonga (Tonga Islands)",
            "alpha2": "to"
          },
          {
            "English": "Turkish",
            "alpha2": "tr"
          },
          {
            "English": "Tsonga",
            "alpha2": "ts"
          },
          {
            "English": "Tatar",
            "alpha2": "tt"
          },
          {
            "English": "Twi",
            "alpha2": "tw"
          },
          {
            "English": "Tahitian",
            "alpha2": "ty"
          },
          {
            "English": "Uighur; Uyghur",
            "alpha2": "ug"
          },
          {
            "English": "Ukrainian",
            "alpha2": "uk"
          },
          {
            "English": "Urdu",
            "alpha2": "ur"
          },
          {
            "English": "Uzbek",
            "alpha2": "uz"
          },
          {
            "English": "Venda",
            "alpha2": "ve"
          },
          {
            "English": "Vietnamese",
            "alpha2": "vi"
          },
          {
            "English": "Volapük",
            "alpha2": "vo"
          },
          {
            "English": "Walloon",
            "alpha2": "wa"
          },
          {
            "English": "Wolof",
            "alpha2": "wo"
          },
          {
            "English": "Xhosa",
            "alpha2": "xh"
          },
          {
            "English": "Yiddish",
            "alpha2": "yi"
          },
          {
            "English": "Yoruba",
            "alpha2": "yo"
          },
          {
            "English": "Zhuang; Chuang",
            "alpha2": "za"
          },
          {
            "English": "Chinese",
            "alpha2": "zh"
          },
          {
            "English": "Zulu",
            "alpha2": "zu"
          }
        ]   
        return isoLanguages.map(isoLanguage => {
          return { label: `${isoLanguage.English} (${isoLanguage.alpha2})`, value: isoLanguage.alpha2 }
        })     
      }
    },
    screen_name: {
      type: "string",
      label: "Screen Name",
      description: "The screen name of the user (e.g., `pipedream`)"
    },
    trendLocation: {
      type: "string",
      label: "Location",
      async options(opts) {
        const trendLocations = await this.getTrendLocations()
        return trendLocations.map(location => {
          return { label: `${location.name}, ${location.countryCode} (${location.placeType.name})`, value: location.woeid }
        })
      },
    },
  },
  methods: {
    async _getAuthorizationHeader({ data, method, url }) {
      const requestData = {
        data,
        method,
        url,
      }
      const token = {
        key: this.$auth.oauth_access_token,
        secret: this.$auth.oauth_refresh_token,
      }
      return (await axios({
        method: 'POST',
        url: this.$auth.oauth_signer_uri,
        data: {
          requestData,
          token,
        }
      })).data
    },
    async _makeRequest(config, attempt = 0) {
      if (!config.headers) config.headers = {}
      if (config.params) {
        const query = querystring.stringify(config.params)
        delete config.params
        const sep = config.url.indexOf('?') === -1 ? '?' : '&'
        config.url += `${sep}${query}`
        config.url = config.url.replace('?&','?')
      }
      let authorization, count = 0
      const maxTries = 3
      while(true) {
        try {
          authorization = await this._getAuthorizationHeader(config)
          break
        } catch (err) {
          // handle exception
          if (++count == maxTries) {
            throw err
          } 
          const milliseconds = 1000 * count
          await new Promise(resolve => setTimeout(resolve, milliseconds)) 
        }
      }
      config.headers.authorization = authorization
      return await axios(config)
    },
    async getFollowers(screen_name) {   
      return (await this._makeRequest({
        url: `https://api.twitter.com/1.1/followers/ids.json?`,
        params: {
          screen_name,
          stringify_ids: true,
        }
      })).data.ids
    },
    async getLikedTweets(opts = {}) {
      const {
        screen_name,
        count = 200,
        tweet_mode = 'extended',
      } = opts
      return (await this._makeRequest({
        url: `https://api.twitter.com/1.1/favorites/list.json`,
        params: {
          screen_name,
          count,
          tweet_mode,
        }
      })).data
    },
    async lookupUsers(userIdArray) {   
      return (await this._makeRequest({
        url: `https://api.twitter.com/1.1/users/lookup.json`,
        params: {
          user_id: userIdArray.join(),
        }
      })).data
    },
    async search(opts = {}) {
      const { q, since_id, tweet_mode, count, result_type, lang, locale, geocode, max_id } = opts
      return (await this._makeRequest({
        url: `https://api.twitter.com/1.1/search/tweets.json`,
        params: {
          q,
          since_id,
          max_id,
          tweet_mode,
          count,
          result_type,
          lang,
          locale,
          geocode,
        }
      }))
    },
    async getTrendLocations() {   
      return (await this._makeRequest({
        url: `https://api.twitter.com/1.1/trends/available.json`,
      })).data
    },
    async getTrends(opts = {}) {   
      const {
        id = 1,
      } = opts
      return (await this._makeRequest({
        url: `https://api.twitter.com/1.1/trends/place.json`,
        params: {
          id,
        }
      })).data
    },
    async getUserTimeline(opts = {}) {   
      const {
        screen_name,
        count = 100,
        exclude_replies,
        include_rts,
        since_id,
      } = opts

      const params = {
        screen_name,
        count,
        exclude_replies,
        include_rts,
        tweet_mode: 'extended',
      }

      if(since_id) {
        params.since_id = since_id
      }

      return (await this._makeRequest({
        url: `https://api.twitter.com/1.1/statuses/user_timeline.json`,
        method: 'get',
        params,
      })).data
    },
    async searchHelper(opts = {}) {
      const tweets = []

      const {
        tweet_mode = 'extended',
        result_type,
        count = 100,
        lang,
        locale,
        geocode,
        enrichTweets = true,
        includeReplies = true,
        includeRetweets = true,
      } = opts

      let { q, max_id, since_id } = opts
      let min_id

      if(includeReplies === 'exclude') {
        q = `${q} -filter:replies`
      } else if(includeReplies === 'only') {
        q = `${q} filter:replies`
      }
  
      if(includeRetweets === 'exclude') {
        q = `${q} -filter:nativeretweets`
      } else if(includeRetweets === 'only') {
        q = `${q} filter:nativeretweets`
      }
  
      const response = await this.search({ q, since_id, tweet_mode, count, result_type, lang, locale, geocode, max_id })

      if(!response) {
        console.log(`Last request was not successful.`)
        return {
          statusCode: "Error",
        }
      }
         
      for (let tweet of response.data.statuses) {
        if ((!since_id || (since_id && tweet.id_str !== since_id)) && (!max_id || (max_id && tweet.id_str !== max_id))) {
          if (enrichTweets) {
            tweet.created_at_timestamp = moment(tweet.created_at, 'ddd MMM DD HH:mm:ss Z YYYY').valueOf()
            tweet.created_at_iso8601 = moment(tweet.created_at, 'ddd MMM DD HH:mm:ss Z YYYY').toISOString()
          }
          tweets.push(tweet)
          if (!max_id || tweet.id_str > max_id) {
            max_id = tweet.id_str
            if(!min_id) {
              min_id = max_id
            }
          }
          if (tweet.id_str < max_id) {
            min_id = tweet.id_str
          }
        }
      }

      return {
        tweets,
        max_id,
        min_id,
        count,
        resultCount: response.data.statuses.length,
        statusCode: response.status, 
      }
    },
    async paginatedSearch(opts = {}) {
      const {
        count = 100,
        q,
        since_id,
        lang, 
        locale, 
        geocode, 
        result_type, 
        enrichTweets,
        includeReplies, 
        includeRetweets,
        limitFirstPage = true,
      } = opts

      let { max_id, maxRequests = 1 } = opts, totalRequests = 0

      const tweets = []

      if (limitFirstPage) {
        maxRequests = 1
      }

      //console.log(maxPages)

      for (let request = 0; request < maxRequests; request++) {        
        const response = await this.searchHelper({
          count,
          q,
          since_id,
          max_id,
          lang, 
          locale, 
          geocode, 
          result_type, 
          enrichTweets,
          includeReplies, 
          includeRetweets,
        })
        
        // increment the count of requests to report out after all requests are complete
        totalRequests++
        
        if (!response) {
          break
        } 

        tweets.push(...response.tweets)

        //console.log(`resultCount: ${response.resultCount} count: ${response.count}`)

        if (since_id && totalRequests === maxRequests && response.resultCount === response.count) {
          console.log(`The last API request returned the maximum number of results. There may be additional tweets matching your search criteria. To return more tweets, increase the maximum number of API requests per execution.`)
        }

        if (response.length === 0 || response.resultCount < response.count) {
          break
        }
        max_id = response.min_id
      }
      
      console.log(`Made ${totalRequests} requests to the Twitter API and returned ${tweets.length} tweets.`)

      return tweets
    },
    async verifyCredentials() {   
      return (await this._makeRequest({
        url: `https://api.twitter.com/1.1/account/verify_credentials.json`,
      })).data
    },
    webhooks: {
      // TODO
    },
  },
}