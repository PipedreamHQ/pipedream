const twitter = {
  type: "app",
  app: "twitter",
  propDefinitions: {
    q: {
      type: "string",
      label: 'Search Term',
      description: "Search for keywords `star wars`, screen names `@hamillhimself`, or hashtags `#jedi`. You can also use Twitter's standard search operators (https://developer.twitter.com/en/docs/tweets/rules-and-filtering/overview/standard-operators).",
    },
    result_type: {
      type: "string", 
      label: "Result Type",
      description: `Specifies the type of results you want to retrieve.`,
      optional: true,
      options: ['recent', 'popular', 'mixed'],
      default: 'recent',
    },
    count: {
      type: "string",
      label: "Count",
      description: "The maximum number of tweets to return (up to 100)",
      optional: true,
      default: "100",
    },
    geocode: {
      type: "string",
      label: "Geocode",
      description: `Returns tweets by users located within a given radius of the given latitude/longitude. The location is preferentially taking from the Geotagging API, but will fall back to their Twitter profile. The parameter value is specified by " latitude,longitude,radius ", where radius units must be specified as either " mi " (miles) or " km " (kilometers). Note that you cannot use the near operator via the API to geocode arbitrary locations; however you can use this geocode parameter to search near geocodes directly.`,
      optional: true,
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
    }
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
    async _makeRequest(config) {
      if (!config.headers) config.headers = {}
      const authorization = await this._getAuthorizationHeader(config)
      config.headers.authorization = authorization
      try {
        return await axios(config)
      } catch (err) {
        console.log(err) // TODO
      }
    },
    async search(q, since_id, tweet_mode, count, result_type, lang, locale, geocode) {   
      const query = querystring.stringify({
        q,
        since_id,
        tweet_mode,
        count,
        result_type,
        lang,
        locale,
        geocode,
      })
      console.log(query)
      return (await this._makeRequest({
        url: `https://api.twitter.com/1.1/search/tweets.json?${query}`,
      })).data
    },
    webhooks: {
      // TODO
    },
  },
}

const _ = require('lodash')
const querystring = require("querystring")
const axios = require('axios')
const moment = require('moment')

module.exports = {
  name: "twitter-search",
  version: "0.0.1",
  props: {
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
    twitter,
    all: { 
      type: "string",
      label: "All of these words",
      description: "Example: `what's happening` - contains both `what's` and `happening`.",
      optional: true, 
    },
    exact: { 
      type: "string",
      label: "This exact phrase",
      description: "Example: `happy hour` - contains the exact phrase `happy hour`.",
      optional: true, 
    },
    any: { 
      type: "string",
      label: "Any of these words",
      description: "Example: `cats dogs` - contains either cats or dogs (or both).",
      optional: true, 
    },
    none: { 
      type: "string",
      label: "None of these words",
      description: "Example: `cats dogs` - does not contain cats and does not contain dogs.",
      optional: true, 
    },
    hashtags: { 
      type: "string",
      label: "These hashtags",
      description: "Example: `#ThrowbackThursday` - contains the hashtag #ThrowbackThursday.",
      optional: true, 
    },
    from: { 
      type: "string",
      label: "From these accounts",
      description: "Example: `@pipedream` - sent from `@pipedream`.",
      optional: true, 
    },
    to: { 
      type: "string",
      label: "To these accounts",
      description: "Example: `@pipedream` - sent in reply to @pipedream.",
      optional: true, 
    },
    mentions: { 
      type: "string",
      label: "Mentioning these accounts",
      description: "Example: `@SFBART @Caltrain` - mentions @SFBART or mentions @Caltrain.",
      optional: true, 
    },
    result_type: { propDefinition: [twitter, "result_type"] },
    count: { propDefinition: [twitter, "count"] },
    includeRetweets: {
      type: "boolean", 
      label: "Include Retweets",
      description: "If true, retweets will be filtered out of the search results returned by Twitter",
      optional: true,
      default: false,
    },
    includeReplies: {
      type: "boolean", 
      label: "Include Replies",
      description: "If false, reeplies will be filtered out before search results are returned by Twitter.",
      optional: true,
      default: true,
    },
    includeOriginalTweets: {
      type: "boolean", 
      label: "Include Original Tweets",
      description: "If false, original tweets will be excluded.",
      optional: true,
      default: true,
    },
    includeTweetsWithLinks: {
      type: "boolean", 
      label: "Include Tweets with Links",
      description: "If false, tweets with links will be excluded.",
      optional: true,
      default: true,
    },
    includeTweetsWithoutLinks: {
      type: "boolean", 
      label: "Include Tweets without Links",
      description: "If false, tweets without links will be excluded.",
      optional: true,
      default: true,
    },
    minimumReplies: {
      type: "boolean", 
      label: "Minimum Replies",
      description: "Example: `280` - Tweets with at least 280 replies.",
      optional: true,
    },
    minimumLikes: {
      type: "boolean", 
      label: "Minimum Likes",
      description: "Example: `280` - Tweets with at least 280 Likes.",
      optional: true,
    },
    minimumRetweets: {
      type: "boolean", 
      label: "Minimum Retweets",
      description: "Example: `280` - Tweets with at least 280 Retweets.",
      optional: true,
    },
    dateFrom: {
      type: "boolean", 
      label: "Date (From)",
      description: "TBC.",
      optional: true,
    },
    dateTo: {
      type: "boolean", 
      label: "Date (To)",
      description: "TBC.",
      optional: true,
    },
    enrichTweets: {
      type: "boolean", 
      label: "Enrich Tweets",
      description: "Enrich each tweet with epoch (milliseconds) and ISO8601 conversions of Twitter's `created_at` timestamp.",
      optional: true,
      default: true,
    },
    lang: { propDefinition: [twitter, "lang"] },
    locale: { propDefinition: [twitter, "locale"] },
    geocode: { propDefinition: [twitter, "geocode"] },
  },
  async run(event) {    
    const since_id = this.db.get("since_id") || 0
    const tweet_mode = 'extended'
    const result_type = this.result_type
    const count = this.count
    const lang = this.lang
    const locale = this.locale
    const geocode = this.geocode
    const q = ''

    // construct q
    if (this.all) { q += `${this.all} ` }
    if (this.exact) { q += `"${this.exact}" ` }
    if (this.any) { q += `(${this.any}) ` } // TODO -- add OR between each word
    if (this.none) { q += `-${this.none} ` }  // TODO -- add - before each word
    if (this.hashtags) { q += `(${this.hashtags}) ` } // TODO -- add OR between each word
    if (this.from) { q += `(${this.from}) ` } // TODO -- prefix each word with from: and add OR between each
    if (this.to) { q += `(${this.to}) ` } // TODO -- prefix each word with to: and add OR between each
    if (this.to) { q += `(${this.to}) ` } // TODO -- prefix each word with to: and add OR between each
    

    if(this.includeReplies === 'false') {
      query = `${query} -filter:replies`
    }

    console.log("count: " + count)

    const response = await this.twitter.search(query, since_id, tweet_mode, count, result_type, lang, locale, geocode)

    let maxId = since_id

    response.statuses.sort(function(a, b){return moment(a.created_at, 'ddd MMM DD HH:mm:ss Z YYYY').valueOf()-moment(b.created_at, 'ddd MMM DD HH:mm:ss Z YYYY').valueOf()});

    response.statuses.forEach(tweet => {

      let emitEvent = true
      
      if(this.includeRetweets === false) {
        if (_.get(tweet,'retweeted_status.id','') !== '') {
          emitEvent = false
        }
      }

      if(this.includeReplies === false) {
        if (tweet.in_reply_to_status_id !== null) {
          emitEvent = false
        }
      }

      if (emitEvent === true) {
        if (this.enrichTweets) {
          tweet.created_at_timestamp = moment(tweet.created_at, 'ddd MMM DD HH:mm:ss Z YYYY').valueOf()
          tweet.created_at_iso8601 = moment(tweet.created_at, 'ddd MMM DD HH:mm:ss Z YYYY').toISOString()
        }

        this.$emit(tweet, {
          ts: moment(tweet.created_at, 'ddd MMM DD HH:mm:ss Z YYYY').valueOf(),
          summary: tweet.full_text || tweet.text,
          id: tweet.created_at_timestamp,
        })
        if (tweet.id > maxId) {
          maxId = tweet.id
        }
      }
    })

    this.db.set("since_id", maxId)
  },
}