import { Controller, OnModuleInit } from '@nestjs/common';
import {
	Client,
	ClientKafkaProxy,
	MessagePattern,
	Payload,
	Transport,
} from '@nestjs/microservices';

@Controller()
export class KafkaController implements OnModuleInit {
	@Client({
		transport: Transport.KAFKA,
		options: {
			client: {
				clientId: 'nestjs-app',
				brokers: ['localhost:9092'],
			},
			consumer: {
				groupId: 'nestjs-consumer-group',
			},
		},
	})
	client: ClientKafkaProxy;

	async onModuleInit() {
		console.log('initialize');
		this.client.subscribeToResponseOf('test-topic');
		await this.client.connect();
		console.log('connected!');
	}

	@MessagePattern('test-topic')
	async handleMessage(@Payload() data: any) {
		console.log('Received Kafka message:', data);
		return {
			status: 'processed',
			data: data,
			timestamp: new Date().toISOString(),
		};
	}
}
