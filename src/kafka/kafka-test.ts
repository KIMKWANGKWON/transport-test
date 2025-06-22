import { Kafka } from 'kafkajs';

async function testKafkaConnection() {
	const kafka = new Kafka({
		clientId: 'nestjs-app',
		brokers: ['localhost:9092'],
	});

	const producer = kafka.producer();
	const consumer = kafka.consumer({ groupId: 'nestjs-consumer-group' });

	try {
		// Producer 연결
		await producer.connect();
		console.log('Producer connected successfully');

		// Consumer 연결
		await consumer.connect();
		console.log('Consumer connected successfully');

		// 토픽 구독
		await consumer.subscribe({ topic: 'test-topic', fromBeginning: true });
		console.log('Subscribed to test-topic');

		// 메시지 전송
		await producer.send({
			topic: 'test-topic',
			messages: [{ value: 'Hello from kafkajs!' }],
		});
		console.log('Message sent successfully');

		// 메시지 수신
		await consumer.run({
			eachMessage: async ({ topic, partition, message }) => {
				console.log('Received message:', {
					topic,
					partition,
					value: message.value?.toString(),
				});
			},
		});

		// 5초 후 연결 해제
		setTimeout(async () => {
			await producer.disconnect();
			await consumer.disconnect();
			console.log('Disconnected from Kafka');
		}, 5000);
	} catch (error) {
		console.error('Kafka connection error:', error);
	}
}

testKafkaConnection();
