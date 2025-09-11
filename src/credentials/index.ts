/**
 * Cloudinary Credentials Definition
 */

export const CloudinaryCredential = {
  name: "cloudinaryCredential",
  displayName: "Cloudinary",
  description: "Cloudinary API credentials for media management",
  properties: {
    cloud_name: {
      type: "string",
      title: "Cloud Name",
      description: "Your Cloudinary cloud name",
      required: true,
    },
    api_key: {
      type: "string", 
      title: "API Key",
      description: "Your Cloudinary API key",
      required: true,
    },
    api_secret: {
      type: "string",
      title: "API Secret", 
      description: "Your Cloudinary API secret",
      required: true,
      "ui:widget": "password",
    },
  },
};
