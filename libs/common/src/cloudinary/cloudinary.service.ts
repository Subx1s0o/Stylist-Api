import { Injectable, Logger } from '@nestjs/common';
import * as toStream from 'buffer-to-stream';
import {
  UploadApiErrorResponse,
  UploadApiResponse,
  v2 as cloudinary,
} from 'cloudinary';
@Injectable()
export default class CloudinaryService {
  logger: Logger = new Logger();
  async uploadServicePhoto(
    file: Express.Multer.File,
    productId: string,
    folder: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    if (!file || !file.buffer) {
      this.logger.error('File buffer is missing');
      throw new Error('File buffer is missing');
    }

    try {
      const fileName = `${productId}`;
      this.logger.log('Uploading file to Cloudinary:', fileName);

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
              this.logger.error('Error uploading file: ' + error.message);
              return reject(new Error('Error uploading file'));
            }

            resolve(result);
          },
        );

        toStream(file.buffer).pipe(uploadStream);
      });
    } catch (error) {
      this.logger.error('Error uploading file: ' + error.message);
      throw new Error('Error uploading file');
    }
  }

  async deleteServicePhoto(id: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(id);
      this.logger.log(`Photo with public_id ${id} deleted successfully`);
    } catch (error) {
      this.logger.error('Error deleting file: ' + error.message);
      throw new Error('Error deleting file');
    }
  }
}
