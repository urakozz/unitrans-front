export class Lang {
    constructor(
        public code: string,
        public title: string
    ) { }
}

var tmpLangs = [
   {
    "language": "ar",
    "name": "Arabic"
   },
   {
    "language": "hy",
    "name": "Armenian"
   },
   {
    "language": "az",
    "name": "Azerbaijani"
   },
   {
    "language": "be",
    "name": "Belarusian"
   },
   {
    "language": "bg",
    "name": "Bulgarian"
   },
   {
    "language": "zh",
    "name": "Chinese (Simplified)"
   },
   {
    "language": "zh-TW",
    "name": "Chinese (Traditional)"
   },
   {
    "language": "cs",
    "name": "Czech"
   },
   {
    "language": "da",
    "name": "Danish"
   },
   {
    "language": "en",
    "name": "English"
   },
   {
    "language": "eo",
    "name": "Esperanto"
   },
   {
    "language": "et",
    "name": "Estonian"
  },
   {
    "language": "fi",
    "name": "Finnish"
   },
   {
    "language": "fr",
    "name": "French"
   },
   {
    "language": "ka",
    "name": "Georgian"
   },
   {
    "language": "de",
    "name": "German"
   },
   {
    "language": "el",
    "name": "Greek"
   },
   {
    "language": "iw",
    "name": "Hebrew"
   },
   {
    "language": "hi",
    "name": "Hindi"
   },
   {
    "language": "it",
    "name": "Italian"
   },
   {
    "language": "ja",
    "name": "Japanese"
   },
   {
    "language": "kk",
    "name": "Kazakh"
   },
   {
    "language": "ko",
    "name": "Korean"
   },
   {
    "language": "la",
    "name": "Latin"
   },
   {
    "language": "lv",
    "name": "Latvian"
   },
   {
    "language": "lt",
    "name": "Lithuanian"
   },
   {
    "language": "no",
    "name": "Norwegian"
   },
   {
    "language": "fa",
    "name": "Persian"
   },
   {
    "language": "pl",
    "name": "Polish"
   },
   {
    "language": "pt",
    "name": "Portuguese"
   },
   {
    "language": "pa",
    "name": "Punjabi"
   },
   {
    "language": "ro",
    "name": "Romanian"
   },
   {
    "language": "ru",
    "name": "Russian"
   },
   {
    "language": "sr",
    "name": "Serbian"
   },
   {
    "language": "sn",
    "name": "Shona"
   },
   {
    "language": "sd",
    "name": "Sindhi"
   },
   {
    "language": "sl",
    "name": "Slovenian"
   },
   {
    "language": "es",
    "name": "Spanish"
   },
   {
    "language": "sw",
    "name": "Swahili"
   },
   {
    "language": "sv",
    "name": "Swedish"
   },
   {
    "language": "tg",
    "name": "Tajik"
   },
   {
    "language": "th",
    "name": "Thai"
   },
   {
    "language": "tr",
    "name": "Turkish"
   },
   {
    "language": "uk",
    "name": "Ukrainian"
   },
   {
    "language": "uz",
    "name": "Uzbek"
   },
   {
    "language": "vi",
    "name": "Vietnamese"
   },
   {
    "language": "cy",
    "name": "Welsh"
   },
   {
    "language": "xh",
    "name": "Xhosa"
   },
   {
    "language": "yi",
    "name": "Yiddish"
   },
   {
    "language": "yo",
    "name": "Yoruba"
   }
  ]

  var LANGS: Lang[] = tmpLangs.map(i => {
    return {"code":i.language, "title":i.name}
  })

  export {LANGS}
