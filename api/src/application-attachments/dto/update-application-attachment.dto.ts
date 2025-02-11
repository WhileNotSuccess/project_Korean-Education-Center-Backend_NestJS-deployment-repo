import { PartialType } from '@nestjs/mapped-types';
import { CreateApplicationAttachmentDto } from './create-application-attachment.dto';

export class UpdateApplicationAttachmentDto extends PartialType(CreateApplicationAttachmentDto) {}
