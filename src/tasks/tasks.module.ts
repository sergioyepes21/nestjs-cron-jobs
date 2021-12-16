import { Logger, Module } from '@nestjs/common';
import { AWSS3UtilsService } from 'src/aws-utils/aws-s3-utils.service';
import { ReadBucketS3TaskService } from './read-bucket-s3-task/read-bucket-s3-task.service';

@Module({
    providers: [
        Logger,
        AWSS3UtilsService,
        ReadBucketS3TaskService
    ],
})
export class TasksModule { }