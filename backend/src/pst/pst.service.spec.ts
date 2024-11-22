import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { PstService } from './pst.service';
import { PstFile } from './entities/pst-file.entity';
import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import * as path from 'path';
import { Readable } from 'stream';

jest.mock('fs');
jest.mock('fs/promises');
jest.mock('uuid', () => ({
  v4: () => 'test-uuid',
}));

describe('PstService', () => {
  let service: PstService;
  let repository: Repository<PstFile>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PstService,
        {
          provide: getRepositoryToken(PstFile),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<PstService>(PstService);
    repository = module.get<Repository<PstFile>>(getRepositoryToken(PstFile));

    // Reset mock implementations
    jest.clearAllMocks();

    // Mock mkdir to resolve
    (fsPromises.mkdir as jest.Mock).mockResolvedValue(undefined);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('uploadPst', () => {
    const mockFile = {
      fieldname: 'file',
      originalname: 'test.pst',
      encoding: '7bit',
      mimetype: 'application/vnd.ms-outlook',
      size: 1024,
      destination: '/tmp',
      filename: 'test.pst',
      path: '/tmp/test.pst',
      buffer: Buffer.from('test'),
      stream: new Readable(),
    } as Express.Multer.File;

    const mockDescription = 'Test PST file';

    beforeEach(() => {
      // Mock file system operations
      (fs.createWriteStream as jest.Mock).mockReturnValue({
        on: jest.fn().mockImplementation(function(event, handler) {
          if (event === 'finish') {
            handler();
          }
          return this;
        }),
        write: jest.fn(),
        end: jest.fn(),
      });
    });

    it('should successfully upload a PST file', async () => {
      const expectedPstFile = {
        id: 'test-uuid',
        filename: 'test.pst',
        filepath: expect.any(String),
        size: 1024,
        metadata: {
          description: mockDescription,
          mimetype: 'application/vnd.ms-outlook',
          originalName: 'test.pst',
        },
      };

      mockRepository.create.mockReturnValue(expectedPstFile);
      mockRepository.save.mockResolvedValue(expectedPstFile);

      const result = await service.uploadPst(mockFile, mockDescription);

      expect(result).toEqual(expectedPstFile);
      expect(mockRepository.create).toHaveBeenCalledWith(expect.objectContaining({
        id: 'test-uuid',
        filename: 'test.pst',
      }));
      expect(mockRepository.save).toHaveBeenCalledWith(expectedPstFile);
    });

    it('should throw BadRequestException when file save fails', async () => {
      const writeError = new Error('Write failed');
      (fs.createWriteStream as jest.Mock).mockReturnValue({
        on: jest.fn().mockImplementation(function(event, handler) {
          if (event === 'error') {
            handler(writeError);
          }
          return this;
        }),
        write: jest.fn(),
        end: jest.fn(),
      });

      await expect(
        service.uploadPst(mockFile, mockDescription),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when database save fails', async () => {
      mockRepository.save.mockRejectedValue(new Error('Database error'));

      await expect(
        service.uploadPst(mockFile, mockDescription),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
