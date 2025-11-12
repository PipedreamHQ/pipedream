import campaignCleaner from "../../campaign_cleaner.app.mjs";
import { clearObj } from "../../common/utils.mjs";

export default {
  key: "campaign_cleaner-send-campaign",
  name: "Send Campaign",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Send in a campaign to be processed and analyzed. [See the documentation](https://api-docs.campaigncleaner.com/#540a9e44-bd17-4bb4-ac8f-150ecbc8066a)",
  type: "action",
  props: {
    campaignCleaner,
    campaignHtml: {
      type: "string",
      label: "Campaign HTML",
      description: "The full HTML of your campaign.",
    },
    campaignName: {
      type: "string",
      label: "Campaign Name",
      description: "The name of your campaign - campaign name must pass our sanitization checks.",
    },
    adjustFontColors: {
      type: "boolean",
      label: "Adjust Font Colors",
      description: " If true, certain bright colors are spam triggers, like **red** or **#FF0000**, will be adjusted to a slightly different color like **#FF0101**, it will look the same, but won't trigger some spam filters.",
      optional: true,
    },
    adjustFontSize: {
      type: "boolean",
      label: "Adjust Font Size",
      description: "If true, you will be able to define the min and max font size allowed in pixels. If your newsletter contains larger or small font's it will adjust them to the min/max you define.",
      optional: true,
    },
    convertHToPTags: {
      type: "boolean",
      label: "Convert H To P Tags",
      description: "If true, this will change all the H tags to P tags and set the correct font-size.",
      optional: true,
    },
    convertTablesToDivs: {
      type: "boolean",
      label: "Convert Tables To Divs",
      description: "This is an experimental feature to convert all the tables to divs, in certain instances with a complicated table structure you might need to edit the HTML. We recommend leaving this as false or not setting it.",
      optional: true,
    },
    customInfo: {
      type: "string",
      label: "Custom Info",
      description: "This field is for you to pass any additional data you want to send us, it will also be passed back to you when you call the get_campaign API. It's limited to 500 characters. - It must pass our sanitization checks.",
      optional: true,
    },
    imageMaxWidth: {
      type: "integer",
      label: "Image Max Width",
      description: "When this is specified, it will add an max-width style to all images. it is not desirable for the image width to exceed the default campaign width.",
      optional: true,
    },
    minFontSizeAllowed: {
      type: "integer",
      label: "Min Font Size Allowed",
      description: "The `Min Font Size` must be smaller or equal to the `Max Font Size` in pixels.",
      max: 100,
      optional: true,
    },
    maxFontSizeAllowed: {
      type: "integer",
      label: "Max Font Size Allowed",
      description: "The `Max Font Size` must be smaller or equal to the `Min Font Size` in pixels.",
      max: 100,
      optional: true,
    },
    minifyHtml: {
      type: "boolean",
      label: "Minify HTML",
      description: "If true, removes all whitespace, tabs, etc. Condensing the HTML.",
      optional: true,
    },
    removeClassesAndIds: {
      type: "boolean",
      label: "Remove Classes And Ids",
      description: "If true, removes all the class and ID attributes after CSS Inlining.",
      optional: true,
    },
    removeComments: {
      type: "boolean",
      label: "Remove Comments",
      description: "If true, comments are stripped from both CSS and HTML. Comments are invisible in html and can trigger spam filters.",
      optional: true,
    },
    removeCssInheritance: {
      type: "boolean",
      label: "Remove CSS Inheritance",
      description: "If true, removes all elements of CSS that are inherited. Once CSS is inlined, the inherited CSS will be removed, for example if font-size of a parent tag is 15 pixels, there is no need for the font-size of the child tag to be specified as 15 pixels because it's inherited or computed from the parent tag, this reduces the size of your HTML Campaign.",
      optional: true,
    },
    removeControlNonPrintable: {
      type: "boolean",
      label: "Remove Control Non Printable",
      description: "If true, all non-printable and control characters are removed.",
      optional: true,
    },
    removeImageHeight: {
      type: "boolean",
      label: "Remove Image Height",
      description: "if true, the height style is removed from all images, preventing any image distortions. Only the width property should be set on images sent in emails.",
      optional: true,
    },
    removeLargeWidthsOver: {
      type: "integer",
      label: "Remove Large Widths Over",
      description: "Experimental: If sets removes all defined widths over the value set on non images and table tags.",
      optional: true,
    },
    removeSuccessivePunctuation: {
      type: "boolean",
      label: "Remove Successive Punctuation",
      description: "if true, this will remove succession punctuation like ..., !!!!, $$$ to a single occurrence.",
      optional: true,
    },
    relativeLinksBaseUrl: {
      type: "string",
      label: "Relative Links Base URL",
      description: "If set this needs to be a full base URL like \"https://campaigncleaner.com/\", if your email campaign has any relative paths, it will be converted to an absolute URL. In most instances, you won't need to set this.",
      optional: true,
    },
    replaceDiacritics: {
      type: "boolean",
      label: "Replace Diacritics",
      description: "If true, replaces diacritic characters like á with normal characters equivalent, if you're sending emails in English emails, this is a must.",
      optional: true,
    },
    replaceNonAsciiCharacters: {
      type: "boolean",
      label: "Replace Non Ascii Characters",
      description: "If true, replaces all non-ascii characters with their ascii equivalent. For example, ❝ will be replaced with \". Non-ascii characters is of of the major spam trigger.",
      optional: true,
    },
    maxWitdh: {
      type: "string",
      label: "Surrounding Div Max Witdh",
      description: "The **Max Width** style applied to the surrounding \"div\" can be specified in pixels as an integer value. It is typically set to the desired maximum width of the campaign, which is commonly either 600 or 900 pixels.",
      optional: true,
    },
    textAlign: {
      type: "string",
      label: "Surrounding Div Text Align",
      description: "All content within the surrounding \"div\" will be aligned according to your specified style. However, you can use the \"text-align\" property on inner tags within the \"div\" to customize the appearance of your email.",
      options: [
        "left",
        "center",
        "right",
      ],
      optional: true,
    },
    fontSize: {
      type: "string",
      label: "Surrounding Div Font Size",
      description: "The pixel size that you want everything in the surrounding div to adhere to, setting this, will add an \"!important\" to the font-size in the surrounding \"div\". Font sizes that are set on any tag in the HTML will retain their original size. While all unspecified font sizes to the size you chose.",
      optional: true,
    },
    centerToParent: {
      type: "boolean",
      label: "Surrounding Div Center To Parent",
      description: "Using this feature will enable the surrounding \"div\" to be centered in any parent tags in which it is placed. This is particularly helpful when inserting an HTML snippet into a template.",
      optional: true,
    },
    treatAsFragment: {
      type: "boolean",
      label: "Treat As Fragment",
      description: "If true, all information before and after and including the body tag is removed.",
      optional: true,
    },
    webhookUrl: {
      type: "string",
      label: "Webhook URL",
      description: "An endpoint that you provide us and when your campaign is fully processed we will send the results back that is found in the Get Campaign API. You can utilize the webhook section under API Management to troubleshoot and test your endpoint.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.campaignCleaner.sendCampaign({
      $,
      data: clearObj({
        send_campaign: {
          campaign_html: this.campaignHtml,
          campaign_name: this.campaignName,
          adjust_font_colors: this.adjustFontColors,
          adjust_font_size: this.adjustFontSize,
          convert_h_to_p_tags: this.convertHToPTags,
          convert_tables_to_divs: this.convertTablesToDivs,
          custom_info: this.customInfo,
          image_max_width: this.imageMaxWidth,
          min_font_size_allowed: this.minFontSizeAllowed,
          max_font_size_allowed: this.maxFontSizeAllowed,
          minify_html: this.minifyHtml,
          remove_classes_and_ids: this.removeClassesAndIds,
          remove_comments: this.removeComments,
          remove_css_inheritance: this.removeCssInheritance,
          remove_control_non_printable: this.removeControlNonPrintable,
          remove_image_height: this.removeImageHeight,
          remove_large_widths_over: this.removeLargeWidthsOver,
          remove_successive_punctuation: this.removeSuccessivePunctuation,
          relative_links_base_url: this.relativeLinksBaseUrl,
          replace_diacritics: this.replaceDiacritics,
          replace_non_ascii_characters: this.replaceNonAsciiCharacters,
          surrounding_div: {
            max_witdh: this.maxWitdh,
            text_align: this.textAlign,
            font_size: this.fontSize,
            center_to_parent: this.centerToParent,
          },
          treat_as_fragment: this.treatAsFragment,
          webhook_url: this.webhookUrl,
        },
      }),
    });

    if (response.error) throw new Error(response.error);

    $.export("$summary", `A new campaign with Id: ${response.campaign?.id} was successfully sent!`);
    return response;
  },
};
