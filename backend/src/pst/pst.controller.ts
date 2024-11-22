import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  BadRequestException,
  MaxFileSizeValidator,
  ParseFilePipe,
  FileTypeValidator,
  Optional,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PstService } from './pst.service';
import { UploadPstDto } from './dto/upload-pst.dto';
import { PstFile } from './entities/pst-file.entity';

@ApiTags('PST Files')
@Controller('pst')
export class PstController {
  constructor(private readonly pstService: PstService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload a PST file' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'File uploaded successfully', type: PstFile })
  @ApiResponse({ status: 400, description: 'Invalid file or request' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadPst(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 1024 }), // 1GB
          new FileTypeValidator({ fileType: 'application/vnd.ms-outlook' }),
        ],
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
    @Body() uploadPstDto: UploadPstDto,
  ): Promise<PstFile> {
    try {
      return await this.pstService.uploadPst(file, uploadPstDto.description);
    } catch (error) {
      throw new BadRequestException(
        `Failed to process PST file: ${error.message}`,
      );
    }
  }
}
