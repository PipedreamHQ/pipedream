import { axios } from "@pipedream/platform";
import { prepareList } from "./common/utils.mjs";

export default {
  type: "app",
  app: "bitport",
  propDefinitions: {
    folderCode: {
      type: "string",
      label: "Folder Code",
      description: "The code of the folder to add the item to",
      async options() {
        const { data } = await this.listFolders();

        return prepareList({
          items: data,
          foldersOnly: true,
        }).map((item) => ({
          label: item.fullName,
          value: item.code,
        }));
      },
    },
  },
  methods: {
    _apiUrl() {
      return "https://api.bitport.io/v2";
    },
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: this._getHeaders(),
        ...opts,
      });
    },
    search({
      query, ...opts
    }) {
      return this._makeRequest({
        path: `/search/${query}`,
        ...opts,
      });
    },
    listFolders() {
      return this._makeRequest({
        path: "/cloud/byPath",
        params: {
          scope: "recursive",
        },
      });
    },
    listFiles() {
      return {
		    "status": "success",
		    "data": [
          {
		        "name": "My files",
		        "code": null,
		        "size": 118230773819,
		        "folders": [
		            {
		                "name": "Big buck bunny",
		                "code": "j4f02eidbb",
		                "size": "5233819",
                "folders": [],
                "files": [],
		                "created_at": {
		                    "date": "2016-03-11 8:51:32.000000",
		                    "timezone_type": 3,
		                    "timezone": "UTC",
		                },
		                "files_count": "3",
		            },
		            {
		                "name": "Videos",
		                "code": "9kw6nh1h2z",
		                "size": "2814299",
		                "created_at": {
		                    "date": "2016-03-11 8:54:29.000000",
		                    "timezone_type": 3,
		                    "timezone": "UTC",
		                },
		                "files_count": "53",
                "folders": [],
                "files": [],
		            },
		        ],
		        "files": [
              {
                "name": "Big.Buck.Bunny.4K.UHD.HFR.60fps.FLAC.mkv",
                "crc32": null,
                "created_at": {
                  "date": "2016-02-09 15:36:47.000000",
                  "timezone_type": 3,
                  "timezone": "UTC",
                },
                "code": "0phkm9kpro",
                "parent_folder_code": null,
                "size": 892862006,
                "video": true,
                "conversion_status": "unconverted",
                "screenshots": {
                  "small": "https://static.bitport.io/1a338b413f21cbe0_s01.jpg",
                  "medium": "https://static.bitport.io/1a338b413f21cbe0_m01.jpg",
                  "big": "https://static.bitport.io/1a338b413f21cbe0_l01.jpg",
                },
                "extension": "mkv",
                "type": "audio",
                "virus": false,
              },
              {
                "name": "2Big.Buck.Bunny.4K.UHD.HFR.60fps.FLAC.mkv",
                "crc32": null,
                "created_at": {
                  "date": "2016-02-09 15:36:47.000000",
                  "timezone_type": 3,
                  "timezone": "UTC",
                },
                "code": "0phkm9kpro2",
                "parent_folder_code": null,
                "size": 892862006,
                "video": true,
                "conversion_status": "unconverted",
                "screenshots": {
                  "small": "https://static.bitport.io/1a338b413f21cbe0_s01.jpg",
                  "medium": "https://static.bitport.io/1a338b413f21cbe0_m01.jpg",
                  "big": "https://static.bitport.io/1a338b413f21cbe0_l01.jpg",
                },
                "extension": "mkv",
                "type": "document",
                "virus": false,
              },
              {
                "name": "3Big.Buck.Bunny.4K.UHD.HFR.60fps.FLAC.mkv",
                "crc32": null,
                "created_at": {
                  "date": "2016-02-09 15:36:47.000000",
                  "timezone_type": 3,
                  "timezone": "UTC",
                },
                "code": "0phkm9kpro3",
                "parent_folder_code": null,
                "size": 892862006,
                "video": true,
                "conversion_status": "unconverted",
                "screenshots": {
                  "small": "https://static.bitport.io/1a338b413f21cbe0_s01.jpg",
                  "medium": "https://static.bitport.io/1a338b413f21cbe0_m01.jpg",
                  "big": "https://static.bitport.io/1a338b413f21cbe0_l01.jpg",
                },
                "extension": "mkv",
                "type": "image",
                "virus": false,
              },
              {
                "name": "4Big.Buck.Bunny.4K.UHD.HFR.60fps.FLAC.mkv",
                "crc32": null,
                "created_at": {
                  "date": "2016-02-09 15:36:47.000000",
                  "timezone_type": 3,
                  "timezone": "UTC",
                },
                "code": "0phkm9kpro4",
                "parent_folder_code": null,
                "size": 892862006,
                "video": true,
                "conversion_status": "unconverted",
                "screenshots": {
                  "small": "https://static.bitport.io/1a338b413f21cbe0_s01.jpg",
                  "medium": "https://static.bitport.io/1a338b413f21cbe0_m01.jpg",
                  "big": "https://static.bitport.io/1a338b413f21cbe0_l01.jpg",
                },
                "extension": "mkv",
                "type": "video",
                "virus": false,
              },
		        ],
		        "parent_folder": null,
		    },
        ],
		    "errors": null,
      };
      // return this._makeRequest({
      //   path: "/cloud/byPath",
      //   params: {
      //     scope: "recursive",
      //   },
      // });
    },
    addItem(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/transfers",
        ...opts,
      });
    },

    /*async *paginate({
      fn, params = {}, maxResults = null,
    }) {
      let lastPage = false;
      let count = 0;
      let page = 0;

      do {
        params.page = ++page;
        const {
          data,
          meta: {
            current_page, last_page,
          },
        } = await fn({params});
        for (const d of data) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        lastPage = !(current_page == last_page);

      } while (lastPage);
    },*/
  },
};
