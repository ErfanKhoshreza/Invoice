import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import { InvoicesModule } from './modules/invoices/invoice.module';
import { EmailConsumerModule } from './modules/email-consumer/email-consumer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    ScheduleModule.forRoot(), // Enable ScheduleModule for cron jobs
    InvoicesModule,
    EmailConsumerModule

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
