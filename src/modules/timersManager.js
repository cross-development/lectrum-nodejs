const TimerValidator = require('../helpers/timerValidator');

class TimersManager {
  constructor() {
    this.timers = [];
  }

  #checkTimer(timer) {
    const existedTimersName = this.timers.map(item => item.name);

    if (existedTimersName.includes(timer.name)) {
      const resultObject = TimerValidator.generateResultObject({
        message: 'Such timer name already exists',
      });

      throw new Error(JSON.stringify(resultObject));
    }

    const validationResult = TimerValidator.validate(timer);

    if (!validationResult.success) {
      throw new Error(JSON.stringify(validationResult));
    }
  }

  #clearTask(index) {
    if (this.timers[index].interval) {
      clearInterval(this.timers[index].task);

      this.timers[index].task = null;
    } else {
      clearTimeout(this.timers[index].task);

      this.timers[index].task = null;
    }
  }

  #handlerTask(timer) {
    return () => {
      timer.job(...timer.params);
    };
  }

  #startTask(index) {
    if (this.timers[index].interval) {
      this.timers[index].task = setInterval(
        this.#handlerTask(this.timers[index]),
        this.timers[index].delay,
      );
    } else {
      this.timers[index].task = setTimeout(
        this.#handlerTask(this.timers[index]),
        this.timers[index].delay,
      );
    }
  }

  add(timer, ...props) {
    this.#checkTimer(timer);

    timer.params = props;

    this.timers.push(timer);

    return this;
  }

  remove(timerName) {
    const index = this.pause(timerName);

    return index >= 0 ? this.timers.splice(index, 1) : this;
  }

  start() {
    for (let i = 0; i < this.timers.length; i++) {
      if (!this.timers[i].task) {
        this.#startTask(i);
      }
    }
  }

  stop() {
    for (let i = 0; i < this.timers.length; i++) {
      if (this.timers[i].task) {
        this.#clearTask(i);
      }
    }
  }

  pause(timerName) {
    if (typeof timerName !== 'string') {
      const resultObject = TimerValidator.generateResultObject({
        message: 'Timer name must be a string',
      });

      throw new Error(JSON.stringify(resultObject));
    }

    for (let i = 0; i < this.timers.length; i++) {
      if (this.timers[i].name === timerName) {
        if (!this.timers[i].task) {
          return null;
        }

        this.#clearTask(i);

        return i;
      }
    }

    return -1;
  }

  resume(timerName) {
    if (typeof timerName !== 'string') {
      const resultObject = TimerValidator.generateResultObject({
        message: 'Timer name must be a string',
      });

      throw new Error(JSON.stringify(resultObject));
    }

    for (let i = 0; i < this.timers.length; i++) {
      if (this.timers[i].name === timerName) {
        if (this.timers[i].task) {
          return null;
        }

        this.#startTask(i);

        return i;
      }
    }

    return -1;
  }
}

module.exports = TimersManager;
