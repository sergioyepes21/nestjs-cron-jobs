import { Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AWSS3UtilsService } from 'src/aws-utils/aws-s3-utils.service';
import { AfterTask } from '../../decorators/after-task.decorator';

@Injectable()
export class ReadBucketS3TaskService {

    /**
     * Class constructor
     * @param {LoggerService} logger Logger service 
     * @param {AWSS3UtilsService} awsS3 AWS S3 utils service 
     */
    constructor(
        @Inject(Logger) private readonly logger: LoggerService,
        @Inject(AWSS3UtilsService) private readonly awsS3: AWSS3UtilsService,
    ) { }

    /**
     * Reads a bucket from AWS S3 every 10 minutes to process
     */
    @Cron(CronExpression.EVERY_10_MINUTES)
    @AfterTask(Logger)
    async readBucketS3(): Promise<void> {
        // TODO: define a bucket s3 name
        const bucketName = '';
        // TODO: define a file key name
        const fileKey = '';
        const bucketFile = await this.awsS3.getBucketFile(bucketName, fileKey);
        if (!bucketFile) {
            this.logger.log({
                Title: `It was not possible to process ${fileKey} file`,
                Message: `Check the logs for more info`,
            });
            return;
        }
        const list: any[] = await this.awsS3.fromBucketCsvToJson(bucketFile.Body, bucketFile.ContentType)
            .catch(e => {
                this.logger.error({
                    Context: ReadBucketS3TaskService.name,
                    Title: 'Error parsing at readBucketS3.fromBucketCsvToJson',
                    Error: e?.message
                });
                return [];
            });

        // TODO: Processing from fields of the .csv file 
        this.logger.log({
            Title: `Processing from fields of the ${fileKey} file`,
            Message: `Total of users on file: ${list.length}`
        });

    }
}