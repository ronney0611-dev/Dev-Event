import { v2 as cloudinary } from 'cloudinary';

// ==========================================
// CLOUDINARY CONNECTION
// ==========================================

export interface CloudinaryConnectionConfig {
  cloudName?: string;
  apiKey?: string;
  apiSecret?: string;
}

export interface ConnectionStatus {
  connected: boolean;
  message: string;
  error?: string;
}

/**
 * Initialize and connect to Cloudinary
 * Validates environment variables and configures the SDK
 */
export const cloudinaryConnect = (
  config?: CloudinaryConnectionConfig
): ConnectionStatus => {
  try {
    const cloudName =
      config?.cloudName || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = config?.apiKey || process.env.CLOUDINARY_API_KEY;
    const apiSecret = config?.apiSecret || process.env.CLOUDINARY_API_SECRET;

    // Validate all required env variables
    if (!cloudName || !apiKey || !apiSecret) {
      const missing = [];
      if (!cloudName) missing.push('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME');
      if (!apiKey) missing.push('CLOUDINARY_API_KEY');
      if (!apiSecret) missing.push('CLOUDINARY_API_SECRET');

      return {
        connected: false,
        message: `Missing required environment variables: ${missing.join(', ')}`,
        error: `Missing: ${missing.join(', ')}`,
      };
    }

    // Configure Cloudinary SDK
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });

    return {
      connected: true,
      message: 'Successfully connected to Cloudinary',
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return {
      connected: false,
      message: 'Failed to connect to Cloudinary',
      error: errorMessage,
    };
  }
};

/**
 * Get the configured Cloudinary instance
 */
export const getCloudinaryInstance = () => {
  return cloudinary;
};

// ==========================================
// UPLOAD FUNCTION
// ==========================================

export interface UploadResponse {
  success: boolean;
  url?: string;
  secure_url?: string;
  publicId?: string;
  format?: string;
  width?: number;
  height?: number;
  size?: number;
  error?: string;
}

/**
 * Upload image to Cloudinary
 */
export const uploadImage = async (
  buffer: Buffer,
  fileName: string,
  folder: string = 'dev-event/images'
): Promise<UploadResponse> => {
  try {
    if (!buffer) {
      throw new Error('File buffer is required');
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (buffer.length > maxSize) {
      throw new Error(`Image size exceeds 10MB limit`);
    }

    const publicId = fileName.replace(/\.[^/.]+$/, '');

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          public_id: publicId,
          overwrite: true,
          resource_type: 'auto',
          quality: 'auto',
          format: 'webp',
          fetch_format: 'auto',
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve({
              success: true,
              url: result?.url,
              secure_url: result?.secure_url,
              publicId: result?.public_id,
              format: result?.format,
              width: result?.width,
              height: result?.height,
              size: result?.bytes,
            });
          }
        }
      );

      uploadStream.end(buffer);
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Image upload failed';
    return {
      success: false,
      error: errorMessage,
    };
  }
};

// Initialize connection on module load
cloudinaryConnect();
