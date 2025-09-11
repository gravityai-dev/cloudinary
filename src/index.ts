import { createPlugin, type GravityPluginAPI } from "@gravityai-dev/plugin-base";
import packageJson from "../package.json";

const plugin = createPlugin({
  name: packageJson.name,
  version: packageJson.version,
  description: packageJson.description,

  async setup(api: GravityPluginAPI) {
    // Initialize platform dependencies
    const { initializePlatformFromAPI } = await import("@gravityai-dev/plugin-base");
    initializePlatformFromAPI(api);

    // Import and register CloudinaryFiles node
    const { CloudinaryFilesNode } = await import("./CloudinaryFiles/node/index");
    api.registerNode(CloudinaryFilesNode);

    // Import and register CloudinaryFileContent node
    const { CloudinaryFileContentNode } = await import("./CloudinaryFileContent/node/index");
    api.registerNode(CloudinaryFileContentNode);

    // Import and register Cloudinary credential
    const { CloudinaryCredential } = await import("./credentials/index");
    api.registerCredential(CloudinaryCredential);
  },
});

export default plugin;
