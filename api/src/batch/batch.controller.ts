import { Controller } from '@nestjs/common';
import { BatchService } from './batch.service';
import { Cron } from '@nestjs/schedule';

@Controller('batch')
export class BatchController {
  constructor(private readonly batchService: BatchService) {}

  @Cron('0 0 4 * * 4') // 목요일 4시에 작동
    async deleteRestedFiles() {
      await this.batchService.deleteNotUsedFiles();
    }
}
