import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  UploadApiErrorResponse,
  UploadApiResponse,
  v2 as cloudinary,
} from 'cloudinary';

@Injectable()
export default class CloudinaryService {
  async uploadPhoto(
    image: string,
    id: string,
    folder: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    if (!image) {
      throw new Error('Base64 image is missing');
    }

    try {
      const matches = image.match(/^data:(image\/\w+);base64,(.+)$/);
      if (!matches) {
        throw new Error('Invalid Base64 image format');
      }

      const mimeType = matches[1];
      const base64Data = matches[2];

      const fileName = `${id}`;

      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
          `data:${mimeType};base64,${base64Data}`,
          {
            folder: folder,
            public_id: fileName,
            quality: 'auto:good',
            fetch_format: 'auto',
            format: 'avif',
          },
          (error, result) => {
            if (error) {
              return reject(
                new InternalServerErrorException('Error uploading file'),
              );
            }

            resolve(result);
          },
        );
      });
    } catch (error) {
      throw new InternalServerErrorException('Error uploading file');
    }
  }

  async deletePhoto(id: string): Promise<void> {
    try {
      await cloudinary.api.delete_resources([id]);
    } catch (error) {
      throw new InternalServerErrorException('Error deleting file');
    }
  }
}
