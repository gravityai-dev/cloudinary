/**
 * Cloudinary Upload Service
 * Handles uploading base64 images or URLs to Cloudinary
 */

import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryUploadConfig } from '../util/types';
import { getNodeCredentials, cloudinaryLogger as logger } from '../../shared/platform';

type CredentialContext = any;

interface CloudinaryCredentials {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
}

/**
 * Upload an image to Cloudinary
 */
export async function uploadImage(
  config: CloudinaryUploadConfig,
  context: CredentialContext,
  nodeLogger?: any
) {
  const log = nodeLogger || logger;

  try {
    // Fetch credentials
    const credentials = (await getNodeCredentials(context, "cloudinaryCredential")) as CloudinaryCredentials;

    if (!credentials?.cloudName || !credentials?.apiKey || !credentials?.apiSecret) {
      throw new Error("Cloudinary credentials are incomplete");
    }

    // Configure Cloudinary
    cloudinary.config({
      cloud_name: credentials.cloudName,
      api_key: credentials.apiKey,
      api_secret: credentials.apiSecret,
      secure: true,
    });

    log.info("Uploading image to Cloudinary", {
      folder: config.folder,
      publicId: config.publicId,
      resourceType: config.resourceType || 'image',
    });

    // Prepare upload options
    const uploadOptions: any = {
      resource_type: config.resourceType || 'image',
      overwrite: config.overwrite ?? false,
    };

    if (config.folder) {
      uploadOptions.folder = config.folder;
    }

    if (config.publicId) {
      uploadOptions.public_id = config.publicId;
    }

    if (config.tags) {
      uploadOptions.tags = config.tags.split(',').map(tag => tag.trim());
    }

    // Prepare image data
    let imageToUpload = config.imageData;

    // If it's base64 without data URI prefix, add it
    if (!imageToUpload.startsWith('data:') && !imageToUpload.startsWith('http')) {
      // Assume it's base64 PNG if no prefix
      imageToUpload = `data:image/png;base64,${imageToUpload}`;
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(imageToUpload, uploadOptions);

    log.info("Image uploaded successfully", {
      publicId: result.public_id,
      url: result.secure_url,
      format: result.format,
      bytes: result.bytes,
    });

    return {
      url: result.url,
      secureUrl: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
      createdAt: result.created_at,
      tags: result.tags || [],
    };
  } catch (error: any) {
    log.error("Failed to upload image to Cloudinary", { error: error.message });
    throw new Error(`Failed to upload image: ${error.message}`);
  }
}
