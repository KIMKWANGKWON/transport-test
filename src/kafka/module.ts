import { Module } from '@nestjs/common';
import { KafkaController } from './controller';

@Module({
	controllers: [KafkaController],
	imports: [],
	providers: [],
})
export class KafkaModule {}
