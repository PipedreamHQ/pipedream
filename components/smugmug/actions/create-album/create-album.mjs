import smugmug from "../../smugmug.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "smugmug-create-album",
  name: "Create Album",
  description: "Creates an album. [See the docs here](https://api.smugmug.com/api/v2/doc/reference/album.html)",
  //version: "2.0.1",
  version: "2.0.13",
  type: "action",
  props: {
    smugmug,
    folder: {
      propDefinition: [
        smugmug,
        "folder",
      ],
    },
    niceName: {
      type: "string",
      description: "The user-configurable component of the album's webUri. Use UrlName instead.",
      optional: true,
    },
    urlName: {
      type: "string",
      description: "The user-configurable component of the album's webUri.",
      optional: true,
    },
    title: {
      type: "string",
      description: "The human-readable title. Use Name instead.",
      optional: true,
    },
    name: {
      type: "string",
      description: "The human-readable title.",
      optional: true,
    },
    privacy: {
      type: "string",
      description: "Private is not supported on legacy accounts.\nIt can be Private, Unlisted, or Public.",
      optional: true,
      options: constants.PRIVACY_OPTIONS,
    },
    printmarkUri: {
      type: "string",
      description: "Uri of an image to use in print orders of your photos, usually, a team, company logo, your signature.",
      optional: true,
    },
    watermarkUri: {
      type: "string",
      description: "Uri of an image to be applied on your photos as a watermark for protection.",
      optional: true,
    },
    themeUri: {
      type: "string",
      description: "Only applies to legacy accounts.",
      optional: true,
    },
    templateUri: {
      type: "string",
      description: "Uri of template, preset settings to be applied on the album.",
      optional: true,
    },
    allowDownloads: {
      type: "boolean",
      description: "Allow downloads of this album?",
      optional: true,
    },
    backprinting: {
      type: "string",
      description: "Text to appear in the back of print orders of your photos.",
      optional: true,
    },
    boutiquePackaging: {
      type: "string",
      description: "Is this album available for Boutique Packaging in your customers orders?",
      optional: true,
      options: constants.BOUTIQUE_PACKAGING_OPTIONS,
    },
    canRank: {
      type: "boolean",
      description: "Enable Canrank property of the album.",
      optional: true,
    },
    clean: {
      type: "boolean",
      description: "Enable Clean property of the album.",
      optional: true,
    },
    comments: {
      type: "boolean",
      description: "Allow other users leave comments in the album?",
      optional: true,
    },
    description: {
      type: "string",
      description: "The human-readable description",
      optional: true,
    },
    downloadPassword: {
      type: "string",
      description: "The password used for protecting album download.",
      optional: true,
    },
    EXIF: {
      type: "string",
      description: "Display a photo's EXIF information.",
      optional: true,
    },
    external: {
      type: "boolean",
      description: "An old setting that no longer has any function.",
      optional: true,
    },
    familyEdit: {
      type: "boolean",
      description: "Enable FamilyEdit property of the album.",
      optional: true,
    },
    filenames: {
      type: "boolean",
      description: "Enable Filenames property of the album.",
      optional: true,
    },
    friendEdit: {
      type: "string",
      description: "Allow this album available for granting special privileges to friends and family with an Smugmug account?",
      optional: true,
    },
    geography: {
      type: "boolean",
      description: "Enable Geography property of the album.",
      optional: true,
    },
    header: {
      type: "string",
      description: "Use a customer header for the album appearance?",
      optional: true,
      options: constants.HEADER_OPTIONS,
    },
    hideOwner: {
      type: "boolean",
      description: "Hide owner information from the album?",
      optional: true,
    },
    interceptShipping: {
      type: "string",
      description: "Personal Delivery.",
      optional: true,
    },
    keywords: {
      type: "string",
      description: "A semicolon-separated list of keywords.",
      optional: true,
    },
    largestSize: {
      type: "string",
      description: "Largest display sizes for images in the album.",
      optional: true,
    },
    packagingBranding: {
      type: "boolean",
      description: "Enable PackagingBranding property of the album.",
      optional: true,
    },
    password: {
      type: "string",
      description: "The password used for protecting album access.",
      optional: true,
    },
    passwordHint: {
      type: "string",
      description: "The hint for the album-access password.",
      optional: true,
    },
    printable: {
      type: "string",
      description: "Allow images of this album to be available for printing?",
      optional: true,
    },
    proofDays: {
      type: "string",
      description: "A proof-delay between 1 and 7 business days for customer orders.",
      optional: true,
    },
    protected: {
      type: "boolean",
      description: "Enable right-click protection?",
      optional: true,
    },
    share: {
      type: "boolean",
      description: "Allow this album to be shared?",
      optional: true,
    },
    slideshow: {
      type: "boolean",
      description: "Enable the slideshow content block on this album?",
      optional: true,
    },
    sortDirection: {
      type: "string",
      description: "Specifies the direction in which to sort album images.",
      optional: true,
      options: constants.SORT_DIRECTION_OPTIONS,
    },
    sortMethod: {
      type: "string",
      description: "Album's image property to use for sorting?",
      optional: true,
      options: constants.SORT_METHOD_OPTIONS,
    },
    squareThumbs: {
      type: "boolean",
      description: "Enable thumbnails in album's images (only available in SmugMug style).",
      optional: true,
    },
    uploadKey: {
      type: "string",
      description: "A key for your guests to upload images to the album.",
      optional: true,
    },
    watermark: {
      type: "boolean",
      description: "Automatically apply watermark to uploaded images?",
      optional: true,
    },
    worldSearchable: {
      type: "string",
      description: "Allow this album to appear in external search results? Can be \"No\" or \"Inherit from User\".",
      optional: true,
      options: constants.SEARCHABLE_OPTIONS,
    },
    autoRename: {
      type: "boolean",
      description: "Auto-rename conflicting album NiceNames?",
      optional: true,
    },
    securityType: {
      type: "string",
      description: "Access protection method for the folder.",
      optional: true,
    },
    highlightAlbumImageUri: {
      type: "string",
      description: "Uri of an image which can be used as a representative of the entire album.",
      optional: true,
    },
    albumTemplateUri: {
      type: "string",
      description: "Specify default album presets by providing an AlbumTemplateUri.",
      optional: true,
    },
    smugSearchable: {
      type: "string",
      description: "Allow this album to appear in SmugMug search results? Can be \"No\" or \"Inherit from User\".",
      optional: true,
      options: constants.SEARCHABLE_OPTIONS,
    },
  },
  async run({ $ }) {
    const data = {
      Type: "album",
      NiceName: this.niceName,
      UrlName: this.urlName,
      Title: this.title,
      Name: this.name,
      Privacy: this.privacy,
      PrintmarkUri: this.printmarkUri,
      WatermarkUri: this.watermarkUri,
      ThemeUri: this.themeUri,
      TemplateUri: this.templateUri,
      AllowDownloads: this.allowDownloads,
      Backprinting: this.backprinting,
      BoutiquePackaging: this.boutiquePackaging,
      CanRank: this.canRank,
      Clean: this.clean,
      Comments: this.comments,
      Description: this.description,
      DownloadPassword: this.downloadPassword,
      EXIF: this.EXIF,
      External: this.external,
      FamilyEdit: this.familyEdit,
      Filenames: this.filenames,
      FriendEdit: this.friendEdit,
      Geography: this.geography,
      Header: this.header,
      HideOwner: this.hideOwner,
      InterceptShipping: this.interceptShipping,
      Keywords: this.keywords,
      LargestSize: this.largestSize,
      PackagingBranding: this.packagingBranding,
      Password: this.password,
      PasswordHint: this.passwordHint,
      Printable: this.printable,
      ProofDays: this.proofDays,
      Protected: this.protected,
      Share: this.share,
      Slideshow: this.slideshow,
      SortDirection: this.sortDirection,
      SortMethod: this.sortMethod,
      SquareThumbs: this.squareThumbs,
      UploadKey: this.uploadKey,
      Watermark: this.watermark,
      WorldSearchable: this.worldSearchable,
      AutoRename: this.AatoRename,
      SecurityType: this.securityType,
      HighlightAlbumImageUri: this.highlightAlbumImageUri,
      AlbumTemplateUri: this.albumTemplateUri,
      SmugSearchable: this.smugSearchable,
    };

    const response = await this.smugmug.createAlbum(this.folder, {
      $,
      data,
    });
    if (response) {
      $.export("$summary", `Created album with key ${response.Response.Album.AlbumKey}`);
    }
    return response;
  },
};
