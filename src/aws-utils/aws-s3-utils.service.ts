import { Injectable, Logger, LoggerService } from "@nestjs/common";
import * as S3 from 'aws-sdk/clients/s3';
import * as csv from 'csvtojson';

@Injectable()
export class AWSS3UtilsService {


    /**
     * Logger of the class
     */
    private readonly logger: LoggerService = new Logger(AWSS3UtilsService.name);

    /**
     * S3 configuration
     */
    private readonly config: S3.ClientConfiguration;

    /**
     * S3 instance
     */
    private awsS3: S3;

    /**
     * Class constructor
     * @param {LoggerService} logger 
     */
    constructor() {
        // TODO: define the AWS env variables
        this.config = {
            region: process.env.AWS_REGION,
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        };
        this.awsS3 = new S3(this.config);
    }

    /**
     * Get Bucket file from S3
     * @param {string} bucket Bucket name 
     * @param {string} fileKey File key name
     * @returns S3 Object result
     */
    public getBucketFile(bucket: string, fileKey: string) {
        return this.awsS3.getObject({
            Bucket: bucket,
            Key: fileKey,
        }).promise().catch(e => {
            this.logger.error({
                Context: AWSS3UtilsService.name,
                Title: `Error retrieving bucket at AWSS3UtilsService.getBucketFile`,
                Bucket: bucket,
                FileKey: fileKey,
                Error: e?.message
            });
            return null;
        });
    }

    /**
     * Parses from a S3 Bucket Response to JSON
     * @param bucketBody 
     * @param contentType 
     * @returns any[]
     */
    public async fromBucketCsvToJson(bucketBody: S3.Body, contentType: S3.ContentType): Promise<any[]> {
        if (contentType !== 'text/csv') {
            return Promise.reject(new Error('Bucket content-type is not text/csv'));
        }
        return csv().fromString(bucketBody.toString());
    }


}