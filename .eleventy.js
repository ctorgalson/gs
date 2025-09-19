export default async function(eleventyConfig) {
  // Copy static assets
  eleventyConfig.addPassthroughCopy("src/assets");

  // Add library assets
  eleventyConfig.addPassthroughCopy({
    "node_modules/liquidjs/dist/liquid.browser.min.js": "assets/liquid.browser.min.js",
    "node_modules/prettier/plugins/postcss.js": "assets/postcss.js",
    "node_modules/prettier/standalone.js": "assets/standalone.js",
    "node_modules/prismjs/components/prism-css.min.js": "assets/prism-css.min.js",
    "node_modules/prismjs/prism.js": "assets/prism.js",
    "node_modules/prismjs/themes/prism-tomorrow.min.css": "assets/prism-tomorrow.min.css",
    "node_modules/qs/dist/qs.js": "assets/qs.js",
    "node_modules/urlon/dist/urlon.umd.js": "assets/urlon.umd.js",
    "node_modules/water.css/out/water.min.css": "assets/water.min.css",
  });

  // Watch for changes
  eleventyConfig.addWatchTarget("src/");
};

export const config = {
  dir: {
    input: "src",
    output: "_site",
    includes: "_includes",
  },
  htmlTemplateEngine: "liquid",
  markdownTemplateEngine: "liquid",
  pathPrefix: "/gs/",
  templateFormats: ["liquid", "md", "html"],
};
