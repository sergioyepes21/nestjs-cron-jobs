import { LoggerService } from "@nestjs/common";
import { performance } from "perf_hooks";

/**
 * Method decorator to print execution time after every CronJob
 * @param {LoggerService} loggerService Logger service instance 
 * @returns PropertyDescriptor
 */
export const AfterTask = (loggerService: LoggerService) => (
    target: Object,
    propertyKey: string,
    descriptor: PropertyDescriptor
) => {
    const { name: loggerContext } = target.constructor;
    const cronJobName = `${loggerContext}.${propertyKey}`;
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args) {
        const start = performance.now();
        const result = await originalMethod.apply(this, args);
        const finish = performance.now();
        const executionTimeSec = ((finish - start) / 1000).toFixed(3)
        loggerService.log({
            Context: loggerContext,
            Title: `Job Done ${cronJobName}`,
            Message: `Execution time for ${cronJobName} Cron Job: ${executionTimeSec} seconds`,
        });
        return result;
    };
    return descriptor;
}