module.exports = {
    inputDir: "./client/src/icons", // (required)
    outputDir: "./client/src/fonts", // (required)
    fontTypes: ["eot", "svg", "ttf", "woff2", "woff"],
    assetTypes: ['scss'],
    fontsUrl: "../../fonts",
    pathOptions: {
        scss: "./client/src/scss/core/_icons.scss",
    },
    getIconId: ({
        basename,
        relativeDirPath,
        absoluteFilePath,
        relativeFilePath,
        index,
    }) => [basename].join("_"),
};
