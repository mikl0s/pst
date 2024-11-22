import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createReadStream, createWriteStream } from 'fs';
import { join } from 'path';
import { mkdir } from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import { PstFile } from './entities/pst-file.entity';

@Injectable()
export class PstService {
  private readonly uploadDir = join(process.cwd(), 'uploads');

  constructor(
    @InjectRepository(PstFile)
    private readonly pstFileRepository: Repository<PstFile>,
  ) {
    this.initializeUploadDirectory();
  }

  private async initializeUploadDirectory(): Promise<void> {
    try {
      await mkdir(this.uploadDir, { recursive: true });
    } catch (err) {
      console.error('Failed to create upload directory:', err);
    }
  }

  async uploadPst(
    file: Express.Multer.File,
    description?: string,
  ): Promise<PstFile> {
    const fileId = uuidv4();
    const filename = `${fileId}-${file.originalname}`;
    const filepath = join(this.uploadDir, filename);

    try {
      // Save file to disk using streams for efficient memory usage
      await this.saveFileToDisk(file.buffer, filepath);

      // Create database record
      const pstFile = this.pstFileRepository.create({
        id: fileId,
        filename: file.originalname,
        filepath,
        size: file.size,
        metadata: {
          description,
          mimetype: file.mimetype,
          originalName: file.originalname,
        },
      });

      return await this.pstFileRepository.save(pstFile);
    } catch (error) {
      throw new BadRequestException(
        `Failed to save PST file: ${error.message}`,
      );
    }
  }

  private async saveFileToDisk(
    buffer: Buffer,
    filepath: string,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const writeStream = createWriteStream(filepath);
      
      writeStream.on('error', (error) => {
        reject(error);
      });

      writeStream.on('finish', () => {
        resolve();
      });

      writeStream.write(buffer);
      writeStream.end();
    });
  }
}
