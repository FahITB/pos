import { ApiProperty } from '@nestjs/swagger';

export class CreateAdminDto {
  @ApiProperty({
    description: 'The username of the admin',
    type: String,
    example: 'superAdmin',
  })
  username: string;

  @ApiProperty({
    description: 'The password of the admin',
    type: String,
    example: '12345678',
  })
  password: string;
}
