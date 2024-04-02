import { Module } from '@nestjs/common';
import { FireBaseService } from './fire-base.service';

@Module({
  controllers: [],
  providers: [FireBaseService],
})
export class FireBaseModule {}
