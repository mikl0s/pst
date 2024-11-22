import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PstController } from './pst.controller';
import { PstService } from './pst.service';
import { PstFile } from './entities/pst-file.entity';
import { PstEmail } from './entities/pst-email.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PstFile, PstEmail]),
  ],
  controllers: [PstController],
  providers: [PstService],
})
export class PstModule {}
