import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { ResetPasswordDto, UpdateAdminDto } from './dto/update-admin.dto';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/config/guard/auth.guard';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  // @ApiConsumes('multipart/form-data')
  // @UseInterceptors(FileInterceptor('profileImage'))
  @Post()
  async create(
    @Body() createAdminDto: CreateAdminDto,
    // @UploadedFile() profileImage: Express.Multer.File,
  ) {
    return await this.adminService.create(createAdminDto);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get()
  async findAll() {
    return await this.adminService.findAll();
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.adminService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('profileImage'))
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
    @UploadedFile() profileImage: Express.Multer.File,
  ) {
    return await this.adminService.update(id, updateAdminDto, profileImage);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.adminService.remove(id);
  }

  //NOTE - reset password
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Patch('reset-password/:id')
  async resetPassword(@Body() resetPassword: ResetPasswordDto) {
    return await this.adminService.resetPassword(resetPassword);
  }
}
