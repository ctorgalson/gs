import manifest from './src/assets/vite/.vite/manifest.json' with { type: 'json' };

export default async function(eleventyConfig) {
  // Copy static assets
  eleventyConfig.addPassthroughCopy({
    "src/assets/vite/css": "assets/css",
    "src/assets/vite/js": "assets/js",
  });

  // Add library assets
  eleventyConfig.addPassthroughCopy({});

  // Watch for changes
  eleventyConfig.addWatchTarget("src/_includes/layouts/");
  eleventyConfig.addWatchTarget("src/_includes/data/");
  eleventyConfig.addWatchTarget("src/index.liquid");
  eleventyConfig.addWatchTarget("src/_includes/assets/vite/.vite/manifest.json");
  // eleventyConfig.addWatchTarget("src/assets/css/");
  // eleventyConfig.addWatchTarget("src/assets/js/");
  // eleventyConfig.addWatchTarget("src/assets/vite/");

  eleventyConfig.addFilter('asset', (filename) => {
    const entry = manifest[filename];
    return `/assets/${entry?.file || filename}`;
  });

  eleventyConfig.addFilter('assetCss', (filename) => {
    const entry = manifest[filename];
    return `/assets/${entry?.css?.[0] || filename}`;
  });
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
