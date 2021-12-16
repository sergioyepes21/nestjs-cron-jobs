import { Logger, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './tasks/tasks.module';

@Module({
  providers: [
    Logger,
  ],
  imports: [ScheduleModule.forRoot(), TasksModule],
  controllers: [],
})
export class AppModule { }
