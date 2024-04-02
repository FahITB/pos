import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty({
    required: true,
    description: 'username of admin',
    example: 'superAdmin',
  })
  username: string;

  @ApiProperty({
    required: true,
    description: 'password of admin',
    example: '12345678',
  })
  password: string;
}
