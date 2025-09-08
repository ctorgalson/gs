module.exports = function(eleventyConfig) {
  // Copy static assets
  eleventyConfig.addPassthroughCopy("src/assets");

  // Add library assets
  eleventyConfig.addPassthroughCopy({
    "node_modules/nunjucks/browser/nunjucks.min.js": "assets/nunjucks.min.js",
    "node_modules/prettier/plugins/postcss.js": "assets/postcss.js",
    "node_modules/prettier/standalone.js": "assets/standalone.js",
    "node_modules/prismjs/components/prism-css.min.js": "assets/prism-css-extras.min.js",
    "node_modules/prismjs/components/prism-css.min.js": "assets/prism-css.min.js",
    "node_modules/prismjs/plugins/line-numbers/prism-line-numbers.min.css": "assets/prism-line-numbers.min.css",
    "node_modules/prismjs/plugins/line-numbers/prism-line-numbers.min.js": "assets/prism-line-numbers.min.js",
    "node_modules/prismjs/prism.js": "assets/prism.js",
    "node_modules/prismjs/themes/prism-tomorrow.min.css": "assets/prism-tomorrow.min.css",
    "node_modules/water.css/out/water.min.css": "assets/water.min.css",
  });

  // Watch for changes
  eleventyConfig.addWatchTarget("src/");

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      layouts: "_layouts"
    },
    templateFormats: ["njk", "md", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};
