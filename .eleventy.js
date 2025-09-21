export default async function(eleventyConfig) {
  // Copy static assets
  eleventyConfig.addPassthroughCopy({
    "src/assets/css": "assets/css",
    "src/assets/vite/css": "assets/css",
    "src/assets/vite/js": "assets/js",
  });

  // Add library assets
  eleventyConfig.addPassthroughCopy({
    "node_modules/water.css/out/water.min.css": "assets/water.min.css",
  });

  // Watch for changes
  eleventyConfig.addWatchTarget("src/");
  eleventyConfig.addWatchTarget("src/assets/js/");
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
