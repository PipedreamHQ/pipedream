/* import {
  amazon, arkose, audio, bounding, capy, click, cloudflare, cutcaptcha,
  cyber, datadome, draw, friendly, geetest, geetestProxy, grid, hcap,
  key, lemin, mt, normal, reEnter, rev2, rev3, rotate, text,
} from "../common/taskProps/index.mjs"; */
import {
  amazon,
  arkose,
  audio,
  bounding,
  capy,
  click,
  cloudflare,
  cutcaptcha,
  cyber,
  datadome,
  draw,
  friendly,
  geetest,
  grid,
  hcap,
  key,
  lemin,
  mt,
  normal,
  reEnter,
  rev2, rev3,
  rotate,
  text,
} from "../common/taskProps/index.mjs";

export const filterProxy = [
  "audio",
  "bounding",
  "click",
  "draw",
  "grid",
  "rev3",
  "rotate",
  "text",
];

export const taskProps = {
  amazon,
  arkose,
  audio,
  bounding,
  capy,
  click,
  cloudflare,
  cutcaptcha,
  cyber,
  datadome,
  draw,
  friendly,
  geetest,
  grid,
  hcap,
  key,
  lemin,
  mt,
  normal,
  reEnter,
  rev2,
  rev3,
  rotate,
  text,
};

export const TASK_TYPE_OPTIONS = [
  {
    label: "Normal CAPTCHA",
    value: "normal",
  },
  {
    label: "reCAPTCHA V2",
    value: "rev2",
  },
  {
    label: "reCAPTCHA V3",
    value: "rev3",
  },
  {
    label: "Arkose Labs CAPTCHA",
    value: "arkose",
  },
  {
    label: "hCAPTCHA",
    value: "hcap",
  },
  {
    label: "GeeTest CAPTCHA",
    value: "geetest",
  },
  {
    label: "Cloudflare Turnstile",
    value: "cloudflare",
  },
  {
    label: "reCAPTCHA Enterprise",
    value: "reEnter",
  },
  {
    label: "Capy Puzzle CAPTCHA",
    value: "capy",
  },
  {
    label: "KeyCAPTCHA",
    value: "key",
  },
  {
    label: "Lemin CAPTCHA",
    value: "lemin",
  },
  {
    label: "Amazon CAPTCHA",
    value: "amazon",
  },
  {
    label: "Text CAPTCHA",
    value: "text",
  },
  {
    label: "Rotate CAPTCHA",
    value: "rotate",
  },
  {
    label: "Click CAPTCHA",
    value: "click",
  },
  {
    label: "Draw Around",
    value: "draw",
  },
  {
    label: "Grid CAPTCHA",
    value: "grid",
  },
  {
    label: "Audio CAPTCHA",
    value: "audio",
  },
  {
    label: "CyberSiARA",
    value: "cyber",
  },
  {
    label: "MTCAPTCHA",
    value: "mt",
  },
  {
    label: "DataDome CAPTCHA",
    value: "datadome",
  },
  {
    label: "Friendly Captcha",
    value: "friendly",
  },
  {
    label: "Bounding Box",
    value: "bounding",
  },
  {
    label: "Cutcaptcha",
    value: "cutcaptcha",
  },
];
