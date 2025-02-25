import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class FilesRequiredPipe implements PipeTransform {
  transform(
    value: Express.Multer.File[] | undefined,
    metadata: ArgumentMetadata,
  ) {
    if (!value || value.length === 0) {
      throw new BadRequestException('파일이 반드시 필요합니다.');
    }
    return value;
  }
}
