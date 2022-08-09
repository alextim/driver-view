import { IEventEmitter } from '../types';
class EventEmitter implements IEventEmitter {
  private callbacks: Record<string, any>;

  constructor() {
    this.callbacks = {
      base: {},
    };
  }

  on(_names: string, callback: (arg0: any) => any) {
    // Errors
    if (!_names) {
      console.warn('wrong names');
      return false;
    }

    if (typeof callback === 'undefined') {
      console.warn('wrong callback');
      return false;
    }

    const that = this;

    // Resolve names
    const names = this.resolveNames(_names);

    // Each name
    names.forEach((_name) => {
      console.log('on:', _name)
      // Resolve name
      const name = that.resolveName(_name);

      // Create namespace if not exist
      if (!(that.callbacks[name.namespace] instanceof Object)) {
        that.callbacks[name.namespace] = {};
      }

      // Create callback if not exist
      if (!(that.callbacks[name.namespace][name.value] instanceof Array)) {
        that.callbacks[name.namespace][name.value] = [];
      }

      // Add callback
      that.callbacks[name.namespace][name.value].push(callback);
    });

    return this;
  }

  off(_names: string) {
    // Errors
    if (!_names) {
      console.warn('wrong name');
      return false;
    }

    const that = this;

    // Resolve names
    const names = this.resolveNames(_names);

    // Each name
    names.forEach((_name) => {
      // Resolve name
      const name = that.resolveName(_name);

      // Remove namespace
      if (name.namespace !== 'base' && name.value === '') {
        delete that.callbacks[name.namespace];
      } else {
        // Remove specific callback in namespace
        // Default
        if (name.namespace === 'base') {
          // Try to remove from each namespace
          for (const namespace in that.callbacks) {
            if (that.callbacks[namespace] instanceof Object && that.callbacks[namespace][name.value] instanceof Array) {
              delete that.callbacks[namespace][name.value];

              // Remove namespace if empty
              if (Object.keys(that.callbacks[namespace]).length === 0) {
                delete that.callbacks[namespace];
              }
            }
          }
        }

        // Specified namespace
        else if (that.callbacks[name.namespace] instanceof Object && that.callbacks[name.namespace][name.value] instanceof Array) {
          delete that.callbacks[name.namespace][name.value];

          // Remove namespace if empty
          if (Object.keys(that.callbacks[name.namespace]).length === 0) {
            delete that.callbacks[name.namespace];
          }
        }
      }
    });

    return this;
  }

  /**
   * Trigger
   */
  trigger(_name: string, _args: any[] = []) {
    // Errors
    if (!_name) {
      console.warn('wrong name');
      return false;
    }

    // Default args
    if (!(_args instanceof Array)) {
      console.warn('wrong args');
      return false;
    }

    const that = this;
    let finalResult: any = null;
    let result = null;

    // Resolve names (should on have one event)
    const names = this.resolveNames(_name);

    // Resolve name
    const name = this.resolveName(names[0]);

    // Default namespace
    if (name.namespace === 'base') {
      // Try to find callback in each namespace
      for (const namespace in that.callbacks) {
        if (that.callbacks[namespace] instanceof Object && that.callbacks[namespace][name.value] instanceof Array) {
          that.callbacks[namespace][name.value].forEach((callback: any) => {
            result = callback.apply(that, _args);

            if (typeof finalResult === 'undefined') {
              finalResult = result;
            }
          });
        }
      }
    }

    // Specified namespace
    else if (this.callbacks[name.namespace] instanceof Object) {
      if (name.value === '') {
        console.warn('wrong name');
        return this;
      }

      that.callbacks[name.namespace][name.value].forEach((callback: any) => {
        result = callback.apply(that, _args);

        if (typeof finalResult === 'undefined') {
          finalResult = result;
        }
      });
    }

    return finalResult;
  }

  private resolveNames(names: string) {
    return names
      .replace(/[^a-zA-Z0-9 ,/.]/g, '')
      .replace(/[,/]+/g, ' ')
      .split(' ');
  }

  private resolveName(name: string) {
    const parts = name.split('.');

    return {
      original: name,
      value: parts[0],
      namespace: parts.length > 1 && parts[1] !== '' ? parts[1] : 'base',
    };
  }
}

export default EventEmitter;
