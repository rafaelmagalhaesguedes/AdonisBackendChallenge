import vine from '@vinejs/vine'
import { errors } from '@vinejs/vine'
import { FieldContext, ErrorReporterContract } from '@vinejs/vine/types'

vine.errorReporter = () => new JSONAPIErrorReporter()

export class JSONAPIErrorReporter implements ErrorReporterContract {
  hasErrors: boolean = false
  errors: any[] = []

  report(message: string, rule: string, field: FieldContext, meta?: any) {
    this.hasErrors = true

    /**
     * Collecting errors as per the JSONAPI spec
     */
    this.errors.push({
      message: message,
      field: field.wildCardPath,
      code: rule,
      ...(meta ? { meta } : {}),
    })
  }

  createError() {
    return new errors.E_VALIDATION_ERROR(this.errors)
  }
}
