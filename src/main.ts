import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
	ClientProxyFactory,
	MicroserviceOptions,
	Transport,
} from '@nestjs/microservices';
import { Observable } from 'rxjs';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	// TCP 마이크로서비스 연결
	app.connectMicroservice<MicroserviceOptions>({
		transport: Transport.TCP,
		options: {
			port: 3100,
		},
	});

	app.connectMicroservice<MicroserviceOptions>({
		transport: Transport.KAFKA,
		options: {
			client: {
				brokers: ['localhost:9092'],
				clientId: 'nestjs-app',
			},
			consumer: {
				groupId: 'nestjs-consumer-group',
			},
		},
	});
	console.log('Kafka Microservice connected successfully');

	await app.listen(3000);
	await app.startAllMicroservices();
	console.log('Application is running on: http://localhost:3000');
	console.log('TCP Microservice is running on: tcp://localhost:3100');
}

bootstrap();
