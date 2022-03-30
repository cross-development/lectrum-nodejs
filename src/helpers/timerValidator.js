class TimerValidator {
  static #requiredProperties = ['name', 'delay', 'interval', 'job'];

  static generateResultObject({ success = false, fieldName = null, message = null }) {
    return {
      success,
      fieldName,
      message: !fieldName ? message : `The field "${fieldName}" is not valid`,
    };
  }

  static validate(timer) {
    if (typeof timer !== 'object') {
      return this.generateResultObject({
        message:
          'Timer must be an object:\n{\n' +
          '\tname*:     String, // timer name\n' +
          '\tdelay*:    Number,  // timer delay in ms\n' +
          '\tinterval*: Boolean, // is timer or interval\n' +
          '\tjob*:      Function, // timer job\n' +
          '}\n',
      });
    }

    for (let i = 0; i < this.#requiredProperties.length; i++) {
      if (!Object.keys(timer).includes(this.#requiredProperties[i])) {
        return this.generateResultObject({
          message: `Property ${this.#requiredProperties[i]} is required`,
        });
      }
    }

    const { name, delay, interval, job } = timer;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return this.generateResultObject({ fieldName: 'name' });
    }

    if (typeof delay !== 'number' || (delay < 0 && delay > 5000)) {
      return this.generateResultObject({ fieldName: 'delay' });
    }

    if (typeof interval !== 'boolean') {
      return this.generateResultObject({ fieldName: 'interval' });
    }

    if (typeof job !== 'function') {
      return this.generateResultObject({ fieldName: 'job' });
    }

    return this.generateResultObject({ success: true });
  }
}

module.exports = TimerValidator;
