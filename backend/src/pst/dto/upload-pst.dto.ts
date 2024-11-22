import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UploadPstDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'PST file to upload',
  })
  @IsOptional() // File is handled by the FileInterceptor
  file?: Express.Multer.File;

  @ApiProperty({
    type: 'string',
    description: 'Optional description for the PST file',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
