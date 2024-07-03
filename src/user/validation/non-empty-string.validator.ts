// non-empty-string.validator.ts
import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
    registerDecorator,
    ValidationOptions,
  } from 'class-validator';
  
  @ValidatorConstraint({ name: 'isNotEmptyString', async: false })
  export class IsNotEmptyStringConstraint implements ValidatorConstraintInterface {
    validate(text: string, args: ValidationArguments) {
      return typeof text === 'string' && text.trim().length > 0;
    }
  
    defaultMessage(args: ValidationArguments) {
      return 'Text ($value) should not be empty or just whitespace';
    }
  }
  
  export function IsNotEmptyString(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
      registerDecorator({
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        constraints: [],
        validator: IsNotEmptyStringConstraint,
      });
    };
  }
  