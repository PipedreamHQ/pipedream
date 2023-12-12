<template>
  <nav v-if="userLinks.length || repoLink" class="nav-links">
    <!-- user links -->
    <div
      v-for="item in userLinks"
      :key="item.link"
      class="nav-item"
      :class="item.className"
    >
      <DropdownLink v-if="item.type === 'links'" :item="item" />
      <NavbarGrid v-else-if="item.grid" :item="item" />
      <NavLink v-else :item="item" />
    </div>
  </nav>
</template>

<script>
import DropdownLink from "@theme/components/DropdownLink.vue";
import NavbarGrid from "@theme/components/NavbarGrid.vue";
import { resolveNavLinkItem } from "../util";
import NavLink from "@theme/components/NavLink.vue";

export default {
  name: "NavLinks",

  props: ["slice"],

  components: {
    NavLink,
    DropdownLink,
    NavbarGrid,
  },

  computed: {
    userNav() {
      return (
        // this.$themeLocaleConfig.nav[this.slice] ||
        this.$site.themeConfig.nav[this.slice] || []
      );
    },

    nav() {
      const { locales } = this.$site;
      if (locales && Object.keys(locales).length > 1) {
        const currentLink = this.$page.path;
        const routes = this.$router.options.routes;
        const themeLocales = this.$site.themeConfig.locales || {};
        const languageDropdown = {
          text: this.$themeLocaleConfig.selectText || "Languages",
          ariaLabel: this.$themeLocaleConfig.ariaLabel || "Select language",
          items: Object.keys(locales).map((path) => {
            const locale = locales[path];
            const text =
              (themeLocales[path] && themeLocales[path].label) || locale.lang;
            let link;
            // Stay on the current page
            if (locale.lang === this.$lang) {
              link = currentLink;
            } else {
              // Try to stay on the same page
              link = currentLink.replace(this.$localeConfig.path, path);
              // fallback to homepage
              if (!routes.some((route) => route.path === link)) {
                link = path;
              }
            }
            return { text, link };
          }),
        };
        return [...this.userNav, languageDropdown];
      }
      return this.userNav;
    },

    userLinks() {
      return (this.nav || []).map((link) => {
        return Object.assign(resolveNavLinkItem(link), {
          items: (link.items || []).map(resolveNavLinkItem),
        });
      });
    },

    repoLink() {
      const { repo } = this.$site.themeConfig;
      if (repo) {
        return /^https?:/.test(repo) ? repo : `https://github.com/${repo}`;
      }
      return null;
    },

    repoLabel() {
      if (!this.repoLink) return;
      if (this.$site.themeConfig.repoLabel) {
        return this.$site.themeConfig.repoLabel;
      }

      const repoHost = this.repoLink.match(/^https?:\/\/[^/]+/)[0];
      const platforms = ["GitHub", "GitLab", "Bitbucket"];
      for (let i = 0; i < platforms.length; i++) {
        const platform = platforms[i];
        if (new RegExp(platform, "i").test(repoHost)) {
          return platform;
        }
      }

      return "Source";
    },
  },
};
</script>

<style lang="stylus">
.nav-links {
  display: flex;
  align-items: center;

  > * {
    margin-left: 1.2em;
    margin-right: 1.2em;
  }

  a {
    line-height: 1.4rem;
    color: inherit;

    // display: inline-block !important;
    &:hover, &.router-link-active {
      color: $accentColor;
    }
  }

  .nav-item {
    position: relative;
    display: inline-block;
    // margin-left: 1.5rem;
    // margin-right: 1.5rem;
    line-height: 2rem;

    &:first-child {
      margin-left: 0;
    }
  }

  .repo-link {
    margin-left: 0.75rem;
  }

  .docs-version {
    .dropdown-title, .nav-link {
      font-family: 'JetBrains Mono', monospace;
      font-weight: 700;
      font-size: 1.2em;
    }
  }
}

@media (max-width: $MQMobile) {
  .nav-links {
    .nav-item, .repo-link {
      margin-left: 0;
    }
  }

  .nav-links {
    margin-left: 0.1rem;
  }
}

@media (min-width: $MQMobile) {
  .nav-links a {
    &:hover, &.router-link-active {
      color: $textColor;
    }
  }

  .nav-item > a:not(.external) {
    &:hover, &.router-link-active {
      margin-bottom: -2px;
      border-bottom: 2px solid lighten($accentColor, 8%);
    }
  }
}

.navbar-icons {
  width: 24px !important;
  height: 24px !important;
}
</style>
