class TimerValidator {
  static generateResultObject({ success = false, fieldName = null }) {
    return {
      success,
      fieldName,
      message: success ? null : `The field "${fieldName}" is not valid`,
    };
  }

  static validate({ name, delay, interval, job }) {
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

class TimersManager {
  constructor() {
    this.timers = [];
  }

  #createTimerHandler(isInterval) {
    return (...args) => (isInterval ? setInterval(...args) : setTimeout(...args));
  }

  #checkTimerName(name) {
    return this.timers.find(timer => timer.name === name);
  }

  add(timer, ...args) {
    const validationResult = TimerValidator.validate(timer);

    if (!validationResult.success) {
      throw Error(JSON.stringify(validationResult));
    }

    const hasExistedTimer = this.#checkTimerName(timer.name);

    if (hasExistedTimer) {
      const resultObject = TimerValidator.generateResultObject({ fieldName: 'name' });

      throw Error(JSON.stringify(resultObject));
    }

    const timerHandler = this.#createTimerHandler(timer.interval);

    const newTimer = {
      name: timer.name,
      timerHandler: () => timerHandler(timer.job, timer.delay, ...args),
    };

    this.timers.push(newTimer);

    return this;
  }

  remove() {}

  start() {}

  stop() {}

  pause() {}

  resume() {}
}

module.exports = TimersManager;
