// legacy_hash_id: a_xqiqPe
import { axios } from "@pipedream/platform";

export default {
  key: "smugmug-create-album",
  name: "Create Album",
  description: "Creates an album.",
  version: "2.0.0",
  type: "action",
  props: {
    smugmug: {
      type: "app",
      app: "smugmug",
    },
    nickname_name: {
      type: "string",
      description: "Nickname of the user creating the album, part of the url.",
    },
    folder_name: {
      type: "string",
      description: "Name of folder where the album will be created. Case sensitive.",
    },
    NiceName: {
      type: "string",
      description: "The user-configurable component of the album's webUri. Use UrlName instead.",
      optional: true,
    },
    UrlName: {
      type: "string",
      description: "The user-configurable component of the album's webUri.",
      optional: true,
    },
    Title: {
      type: "string",
      description: "The human-readable title. Use Name instead.",
      optional: true,
    },
    Name: {
      type: "string",
      description: "The human-readable title.",
      optional: true,
    },
    privacy: {
      type: "string",
      description: "Private is not supported on legacy accounts.\nIt can be Private, Unlisted, or Public.",
      optional: true,
      options: [
        "Public",
        "Unlisted",
        "Private",
      ],
    },
    PrintmarkUri: {
      type: "string",
      description: "Uri of an image to use in print orders of your photos, usually, a team, company logo, your signature.",
      optional: true,
    },
    WatermarkUri: {
      type: "string",
      description: "Uri of an image to be applied on your photos as a watermark for protection.",
      optional: true,
    },
    ThemeUri: {
      type: "string",
      description: "Only applies to legacy accounts.",
      optional: true,
    },
    TemplateUri: {
      type: "string",
      description: "Uri of template, preset settings to be applied on the album.",
      optional: true,
    },
    AllowDownloads: {
      type: "boolean",
      description: "Allow downloads of this album?",
      optional: true,
    },
    Backprinting: {
      type: "string",
      description: "Text to appear in the back of print orders of your photos.",
      optional: true,
    },
    BoutiquePackaging: {
      type: "string",
      description: "Is this album available for Boutique Packaging in your customers orders?",
      optional: true,
      options: [
        "No",
        "Yes",
        "Inherit from User",
      ],
    },
    CanRank: {
      type: "boolean",
      description: "Enable Canrank property of the album.",
      optional: true,
    },
    Clean: {
      type: "boolean",
      description: "Enable Clean property of the album.",
      optional: true,
    },
    Comments: {
      type: "boolean",
      description: "Allow other users leave comments in the album?",
      optional: true,
    },
    Description: {
      type: "string",
      description: "The human-readable description",
      optional: true,
    },
    DownloadPassword: {
      type: "string",
      description: "The password used for protecting album download.",
      optional: true,
    },
    EXIF: {
      type: "string",
      description: "Display a photo's EXIF information.",
      optional: true,
    },
    External: {
      type: "boolean",
      description: "An old setting that no longer has any function.",
      optional: true,
    },
    FamilyEdit: {
      type: "boolean",
      description: "Enable FamilyEdit property of the album.",
      optional: true,
    },
    Filenames: {
      type: "boolean",
      description: "Enable Filenames property of the album.",
      optional: true,
    },
    FriendEdit: {
      type: "string",
      description: "Allow this album available for granting special privileges to friends and family with an Smugmug account?",
      optional: true,
    },
    Geography: {
      type: "boolean",
      description: "Enable Geography property of the album.",
      optional: true,
    },
    Header: {
      type: "string",
      description: "Use a customer header for the album appearance?",
      optional: true,
      options: [
        "Custom",
        "SmugMug",
      ],
    },
    HideOwner: {
      type: "boolean",
      description: "Hide owner information from the album?",
      optional: true,
    },
    InterceptShipping: {
      type: "string",
      description: "Personal Delivery.",
      optional: true,
    },
    Keywords: {
      type: "string",
      description: "A semicolon-separated list of keywords.",
      optional: true,
    },
    LargestSize: {
      type: "string",
      description: "Largest display sizes for images in the album.",
      optional: true,
    },
    PackagingBranding: {
      type: "boolean",
      description: "Enable PackagingBranding property of the album.",
      optional: true,
    },
    Password: {
      type: "string",
      description: "The password used for protecting album access.",
      optional: true,
    },
    PasswordHint: {
      type: "string",
      description: "The hint for the album-access password.",
      optional: true,
    },
    Printable: {
      type: "string",
      description: "Allow images of this album to be available for printing?",
      optional: true,
    },
    ProofDays: {
      type: "string",
      description: "A proof-delay between 1 and 7 business days for customer orders.",
      optional: true,
    },
    Protected: {
      type: "boolean",
      description: "Enable right-click protection?",
      optional: true,
    },
    Share: {
      type: "boolean",
      description: "Allow this album to be shared?",
      optional: true,
    },
    Slideshow: {
      type: "boolean",
      description: "Enable the slideshow content block on this album?",
      optional: true,
    },
    SortDirection: {
      type: "string",
      description: "Specifies the direction in which to sort album images.",
      optional: true,
      options: [
        "Ascending",
        "Descending",
      ],
    },
    SortMethod: {
      type: "string",
      description: "Album's image property to use for sorting?",
      optional: true,
      options: [
        "Position",
        "Caption",
        "Filename",
        "Date Uploaded",
        "Date Modified",
        "Date Taken",
      ],
    },
    SquareThumbs: {
      type: "boolean",
      description: "Enable thumbnails in album's images (only available in SmugMug style).",
      optional: true,
    },
    UploadKey: {
      type: "string",
      description: "A key for your guests to upload images to the album.",
      optional: true,
    },
    Watermark: {
      type: "boolean",
      description: "Automatically apply watermark to uploaded images?",
      optional: true,
    },
    WorldSearchable: {
      type: "string",
      description: "Allow this album to appear in external search results? Can be \"No\" or \"Inherit from User\".",
      optional: true,
      options: [
        "No",
        "Inherit from User",
      ],
    },
    AutoRename: {
      type: "boolean",
      description: "Auto-rename conflicting album NiceNames?",
      optional: true,
    },
    SecurityType: {
      type: "string",
      description: "Access protection method for the folder.",
      optional: true,
    },
    HighlightAlbumImageUri: {
      type: "string",
      description: "Uri of an image which can be used as a representative of the entire album.",
      optional: true,
    },
    AlbumTemplateUri: {
      type: "string",
      description: "Specify default album presets by providing an AlbumTemplateUri.",
      optional: true,
    },
    SmugSearchable: {
      type: "string",
      description: "Allow this album to appear in SmugMug search results? Can be \"No\" or \"Inherit from User\".",
      optional: true,
      options: [
        "No",
        "Inherit from user",
      ],
    },
  },
  async run({ $ }) {
  //See the API docs here: https://api.smugmug.com/api/v2/doc/reference/album.html

    const config = {
      method: "post",
      url: `https://www.smugmug.com/api/v2/folder/user/${this.nickname_name}/${this.folder_name}!albums`,
      headers: {
        "Authorization": `Bearer ${this.smugmug.$auth.oauth_access_token}`,
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      data: {
        NiceName: this.NiceName,
        UrlName: this.UrlName,
        Title: this.Title,
        Name: this.Name,
        Privacy: this.privacy,
        PrintmarkUri: this.PrintmarkUri,
        WatermarkUri: this.WatermarkUri,
        ThemeUri: this.ThemeUri,
        TemplateUri: this.TemplateUri,
        AllowDownloads: this.AllowDownloads,
        Backprinting: this.Backprinting,
        BoutiquePackaging: this.BoutiquePackaging,
        CanRank: this.CanRank,
        Clean: this.Clean,
        Comments: this.Comments,
        Description: this.Description,
        DownloadPassword: this.DownloadPassword,
        EXIF: this.EXIF,
        External: this.External,
        FamilyEdit: this.FamilyEdit,
        Filenames: this.Filenames,
        FriendEdit: this.FriendEdit,
        Geography: this.Geography,
        Header: this.Header,
        HideOwner: this.HideOwner,
        InterceptShipping: this.InterceptShipping,
        Keywords: this.Keywords,
        LargestSize: this.LargestSize,
        PackagingBranding: this.PackagingBranding,
        Password: this.Password,
        PasswordHint: this.PasswordHint,
        Printable: this.Printable,
        ProofDays: this.ProofDays,
        Protected: this.Protected,
        Share: this.Share,
        Slideshow: this.Slideshow,
        SortDirection: this.SortDirection,
        SortMethod: this.SortMethod,
        SquareThumbs: this.SquareThumbs,
        UploadKey: this.UploadKey,
        Watermark: this.Watermark,
        WorldSearchable: this.WorldSearchable,
        AutoRename: this.AutoRename,
        SecurityType: this.SecurityType,
        HighlightAlbumImageUri: this.HighlightAlbumImageUri,
        AlbumTemplateUri: this.AlbumTemplateUri,
        SmugSearchable: this.SmugSearchable,
      },
    };

    const signature = {
      token: {
        key: this.smugmug.$auth.oauth_access_token,
        secret: this.smugmug.$auth.oauth_refresh_token,
      },
      oauthSignerUri: this.smugmug.$auth.oauth_signer_uri,
    };

    return await axios($, config, signature);
  },
};
