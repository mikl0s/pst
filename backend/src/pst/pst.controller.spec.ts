import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { PstController } from './pst.controller';
import { PstService } from './pst.service';
import { UploadPstDto } from './dto/upload-pst.dto';
import { Readable } from 'stream';

describe('PstController', () => {
  let controller: PstController;
  let service: PstService;

  const mockService = {
    uploadPst: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PstController],
      providers: [
        {
          provide: PstService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<PstController>(PstController);
    service = module.get<PstService>(PstService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

    const mockUploadDto: UploadPstDto = {
      description: 'Test PST file',
    };

    it('should successfully upload a PST file', async () => {
      const expectedResult = {
        id: 'test-id',
        filename: 'test.pst',
        filepath: '/tmp/test.pst',
        size: 1024,
        metadata: {
          description: 'Test PST file',
        },
      };

      mockService.uploadPst.mockResolvedValue(expectedResult);

      const result = await controller.uploadPst(mockFile, mockUploadDto);

      expect(result).toBe(expectedResult);
      expect(mockService.uploadPst).toHaveBeenCalledWith(
        mockFile,
        mockUploadDto.description,
      );
    });

    it('should throw BadRequestException when service fails', async () => {
      mockService.uploadPst.mockRejectedValue(new Error('Upload failed'));

      await expect(
        controller.uploadPst(mockFile, mockUploadDto),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
