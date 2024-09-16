import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as toStream from 'buffer-to-stream';
import {
  UploadApiErrorResponse,
  UploadApiResponse,
  v2 as cloudinary,
} from 'cloudinary';
@Injectable()
export default class CloudinaryService {
  async uploadServicePhoto(
    file: Express.Multer.File,
    productId: string,
    folder: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    if (!file || !file.buffer) {
      throw new Error('File buffer is missing');
    }

    try {
      const fileName = `${productId}`;

      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: folder,
            public_id: fileName,
            quality: 'auto',
            fetch_format: 'auto',
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

        toStream(file.buffer).pipe(uploadStream);
      });
    } catch (error) {
      throw new InternalServerErrorException('Error uploading file');
    }
  }

  async deleteServicePhoto(id: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(id);
    } catch (error) {
      throw new InternalServerErrorException('Error deleting file');
    }
  }
}
