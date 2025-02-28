import { configuration, DefaultMarkdownCustomComponents } from "@codedoc/core";
import { msClarity } from "./plugins/ms-clarity";
import { customCSS } from "./plugins/css";
import { customJS } from "./plugins/js";
import { codingBlog } from "@codedoc/coding-blog-plugin"; // --> import the plugin
import { ColorBox } from "./components/colorbox"; // --> import the component
import { theme } from "./theme";

export const config = /*#__PURE__*/ configuration({
  theme, // --> add the theme. modify `./theme.ts` for changing the theme.
  dest: {
    namespace: "/guides", // --> your github pages namespace. remove if you are using a custom domain.
  },
  page: {
    favicon: "/assets/images/favicon.ico",
    title: {
      base: "Cashfree Payments Developer Guides", // --> the base title of your doc pages
    },
    fonts: {
      text: {
        url: "https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap",
        name: "Montserrat",
      },
    },
  },
  misc: {
    github: {
      user: "withshubh", // --> your github username (where your repo is hosted)
      repo: "cfguide", // --> your github repo name
    },
  },
  plugins: [msClarity(), codingBlog(), customCSS(), customJS()],
  markdown: {
    customComponents: {
      ...DefaultMarkdownCustomComponents,
      ColorBox, // --> add the component to the markdown custom components
    },
  },
});
