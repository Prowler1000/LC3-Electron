const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');
const IncludeOnly = [
  "/dist",
  "/electron",
  "/package.json",
]
function ignoreFunction(path) {
  ignore = path !== "" && !IncludeOnly.includes(path);
  if (ignore) {
    IncludeOnly.forEach(element => {
        if (path.startsWith(element)) {
          ignore = false;
        }
    });
  }
  return ignore
}

module.exports = {
  packagerConfig: {
    asar: true,
    ignore: ignoreFunction,
    prune: true,
  },
  hooks: {
    readPackageJson: async (forgeConfig, packageJson) => {
      Object.keys(packageJson).forEach((key) => {
        switch (key) {
          case 'name':
            break;
          case 'version':
            break;
          case 'main':
            break;
          case 'author':
            break;
          case 'description':
            break;
          case 'devDependencies':
            break;
          default: 
            delete packageJson[key]
            break;
        }
      })
    }
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};
