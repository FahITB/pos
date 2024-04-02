import { ApiProperty } from '@nestjs/swagger';

export class UpdateAdminDto {
  @ApiProperty({
    required: false,
    description: 'The username of the admin',
    type: String,
    example: 'superAdmin',
  })
  username: string;

  @ApiProperty({
    required: false,
    description: 'The password of the admin',
    type: String,
    example: 'superAdmin',
  })
  role: string;

  @ApiProperty({
    required: false,
    description: 'The firstName of the admin',
    type: String,
    example: 'cat',
  })
  firstNameEN: string;

  @ApiProperty({
    required: false,
    description: 'The firstName of the admin',
    type: String,
    example: 'ແມວ',
  })
  firstNameLO: string;

  @ApiProperty({
    required: false,
    description: 'The lastName of the admin',
    type: String,
    example: 'orange cat',
  })
  lastNameEN: string;

  @ApiProperty({
    required: false,
    description: 'The lastName of the admin',
    type: String,
    example: 'ແມວສົ້ມ',
  })
  lastNameLO: string;

  @ApiProperty({
    required: false,
    description: 'The phone of the admin',
    type: String,
    example: '9999 9999',
  })
  phone: string;

  @ApiProperty({
    required: false,
    description: 'The email of the admin',
    type: String,
    example: 'cat@gmail.com',
  })
  email: string;

  @ApiProperty({
    required: false,
    description: 'The provinceEN of the admin',
    type: String,
    example: 'cat@gmail.com',
  })
  provinceEN: string;

  @ApiProperty({
    required: false,
    description: 'The provinceLO of the admin',
    type: String,
    example: 'ນະຄອນຫລວງວຽງຈັນ',
  })
  provinceLO: string;

  @ApiProperty({
    required: false,
    description: 'The districtEN of the admin',
    type: String,
    example: 'cat@gmail.com',
  })
  districtEN: string;

  @ApiProperty({
    required: false,
    description: 'The districtLO of the admin',
    type: String,
    example: 'ໄຊເສດຖາ',
  })
  districtLO: string;

  @ApiProperty({
    required: false,
    description: 'The village of the admin',
    type: String,
    example: 'cat',
  })
  villageEN: string;

  @ApiProperty({
    required: false,
    description: 'The village of the admin',
    type: String,
    example: 'ແມວ',
  })
  villageLO: string;

  @ApiProperty({
    required: false,
    description: 'The username of the admin',
    type: String,
    format: 'binary',
  })
  profileImage: Express.Multer.File;
}


export class ResetPasswordDto {
  @ApiProperty({
    required: true,
    description: 'The id of the admin',
    type: String,
    example: '6U5wOBCpHoGozq3DA5Fz',
  })
  id: string;

  @ApiProperty({
    required: true,
    description: 'The password of the admin',
    type: String,
    example: '123456',
  })
  password: string;
}