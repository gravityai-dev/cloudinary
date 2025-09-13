import { getPlatformDependencies, type EnhancedNodeDefinition } from "@gravityai-dev/plugin-base";
import { CloudinaryFileContentExecutor } from "./executor";

export const NODE_TYPE = "CloudinaryFileContent";

function createNodeDefinition(): EnhancedNodeDefinition {
  const { NodeInputType } = getPlatformDependencies();
  
  return {
    packageVersion: "1.0.6",
    type: NODE_TYPE,
    name: "Cloudinary File Content",
    description: "Get content and metadata for a Cloudinary file",
    category: "storage",
    logoUrl: "https://res.cloudinary.com/sonik/image/upload/v1754502687/gravity/icons/cloudinary_logo.png",
    color: "#3448C5", // Cloudinary Blue
    inputs: [
      {
        name: "file",
        type: NodeInputType.OBJECT,
        description: "Cloudinary file object from CloudinaryFiles or Loop node",
      },
    ],
    outputs: [
      {
        name: "fileContent",
        type: NodeInputType.OBJECT,
        description: "File content with download URL and metadata",
      },
    ],
    configSchema: {
      type: "object",
      properties: {
        file: {
          type: "object",
          title: "File Object",
          description: "Cloudinary file object with publicId",
          default: "",
          "ui:field": "template",
        },
        transformation: {
          type: "string",
          title: "Transformation",
          description: "Cloudinary transformation string (e.g., 'w_300,h_300,c_fill')",
          default: "",
          "ui:placeholder": "e.g., w_300,h_300,c_fill,g_face",
          "ui:help": "See Cloudinary transformation reference for options",
        },
        format: {
          type: "string",
          title: "Output Format",
          description: "Convert to a different format (e.g., 'jpg', 'png', 'webp')",
          default: "jpg",
          "ui:placeholder": "e.g., jpg, png, webp",
        },
      },
    },
    credentials: [
      {
        name: "cloudinaryCredential",
        required: true,
        displayName: "Cloudinary",
        description: "Cloudinary credentials for media access",
      },
    ],
  };
}

const definition = createNodeDefinition();

export const CloudinaryFileContentNode = {
  definition,
  executor: CloudinaryFileContentExecutor,
};

export { createNodeDefinition };
