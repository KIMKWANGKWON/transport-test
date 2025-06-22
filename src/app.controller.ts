import {
	Controller,
	Get,
	Inject,
	OnModuleDestroy,
	OnModuleInit,
} from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Transport } from '@nestjs/microservices';
import { from, mergeMap, Observable } from 'rxjs';
import { setTimeout } from 'node:timers/promises';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	getHello(): string {
		return this.appService.getHello();
	}

	async makeNum() {
		console.log('aa');
		// await this.sleep(1000);
		console.log('dd');
		return [1, 2, 3, 4, 5];
	}

	async *streamTokens() {
		const promises = [
			Promise.resolve('token1'),
			Promise.resolve('token2'),
			Promise.resolve('token3'),
		];
		for await (const token of promises) {
			yield token;
		}
	}

	@MessagePattern({ cmd: 'sum' }, Transport.TCP)
	accumulate(data: number[]): Observable<String> {
		const a = new Promise<String>(async resolve => {
			(
				await setTimeout(1000, () => {
					resolve('it executed');
				})
			)();
			// resolve('Good!');
		});
		const promises = [
			Promise.resolve(a),
			Promise.resolve('token1'),
			Promise.resolve('token2'),
			Promise.resolve('token3'),
		];

		const c = from(promises).pipe(
			mergeMap(p => p), // Promise<string> -> Observable<string>
		);

		return c;
	}
}
