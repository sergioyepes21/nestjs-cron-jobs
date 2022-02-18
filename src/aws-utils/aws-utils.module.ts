import { Global, Logger, Module } from '@nestjs/common';
import { AWSS3UtilsService } from './aws-s3-utils.service';

@Global()
@Module({
    imports: [
        AWSS3UtilsService,
    ],
    exports: [
        AWSS3UtilsService,
    ],
})
export class AWSUtilsModule { }