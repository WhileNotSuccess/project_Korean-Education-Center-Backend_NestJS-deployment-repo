import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApplicationFormService } from './application-form.service';
import { CreateApplicationFormDto } from './dto/create-application-form.dto';
import { UpdateApplicationFormDto } from './dto/update-application-form.dto';

@Controller('application-form')
export class ApplicationFormController {
  constructor(private readonly applicationFormService: ApplicationFormService) {}

  @Post()
  create(@Body() createApplicationFormDto: CreateApplicationFormDto) {
    return this.applicationFormService.create(createApplicationFormDto);
  }

  @Get()
  findAll() {
    return this.applicationFormService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.applicationFormService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateApplicationFormDto: UpdateApplicationFormDto) {
    return this.applicationFormService.update(+id, updateApplicationFormDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.applicationFormService.remove(+id);
  }
}
