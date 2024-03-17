import { PipeTransform, ArgumentMetadata, ValidationError, Injectable, BadRequestException } from '@nestjs/common';
import { validateSync } from 'class-validator';

@Injectable()
export class ValidationPipeWithFormattedMessage implements PipeTransform<any> {
  transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const errors = validateSync(value);
    if (errors.length) {
      const formattedErrors = errors.map((error) => {
        // Similar message formatting logic as in the controller approach
      });
      throw new BadRequestException(formattedErrors.join('\n'));
    }
    return value;
  }

  private toValidate(metatype: any): boolean {
    return !this.isPrimitive(metatype) && metatype !== String && metatype !== Object;
  }

  private isPrimitive(val: any): boolean {
    return (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') && val === val;
  }
}
