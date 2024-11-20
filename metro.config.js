const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Add support for Firebase CJS modules
config.resolver.sourceExts.push("cjs");

// Export the config with NativeWind support
module.exports = withNativeWind(config, { input: "./app/global.css" });
