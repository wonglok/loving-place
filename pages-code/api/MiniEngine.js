import EventEmitter from "events";
export class MiniEngine {
  constructor({ name, window, domElement, mounter3D }) {
    this.resource = new Map();
    this.get = (k) => {
      return new Promise((resolve) => {
        let ttt = 0;
        ttt = setInterval(() => {
          if (this.resource.has(k)) {
            clearInterval(ttt);
            resolve(this.resource.get(k));
          }
        });
      });
    };
    this.set = (k, v) => {
      this.resource.set(k, v);
    };

    this.name = name;
    this.domElement = domElement;
    this.getRect = () => {
      return domElement.getBoundingClientRect();
    };

    this.isAborted = false;
    this.tasks = [];
    this.resizeTasks = [];
    this.cleanTasks = [];
    this.onLoop = (fnc, num = 0) => {
      if (num >= 0) {
        this.tasks.push(fnc);
      } else {
        this.tasks.unshift(fnc);
      }
    };

    this.onResize = (fnc) => {
      fnc();
      this.resizeTasks.push(fnc);
    };

    this.onClean = (func) => {
      this.cleanTasks.push(func);
    };

    let intv = 0;
    let internalResize = () => {
      clearTimeout(intv);
      intv = setTimeout(() => {
        this.resizeTasks.forEach((e) => e());
      }, 16.8888);
    };

    window.addEventListener("resize", () => {
      internalResize();
    });

    let isPaused = false;
    this.toggle = () => {
      isPaused = !isPaused;
    };
    this.pause = () => {
      isPaused = true;
    };
    this.play = () => {
      isPaused = false;
    };

    this.clean = () => {
      this.isAborted = true;
      try {
        this.cleanTasks.forEach((e) => e());
      } catch (e) {
        console.error(e);
      }
    };

    this.work = () => {
      if (this.isAborted) {
        return {
          name: this.name,
          duration: 0,
        };
      }
      if (isPaused) {
        return {
          name: this.name,
          duration: 0,
        };
      }
      let start = window.performance.now();
      try {
        this.tasks.forEach((e) => e());
      } catch (e) {
        console.error(e);
      }
      let end = window.performance.now();
      let duration = end - start;

      return {
        name: this.name,
        duration,
      };
    };

    this.event = new EventEmitter();
    this.ready = new Proxy(
      {},
      {
        get: (obj, key) => {
          return this.get(key);
        },
      }
    );
  }
}

export class MiniSubEngine {
  constructor(mini) {
    this.mini = mini;
    this.reseizers = [];
    this.tasks = [];
    this.cleanups = [];
    this.active = true;

    this.mini.onResize(() => {
      if (this.active) {
        this.reseizers.forEach((r) => {
          try {
            r();
          } catch (e) {
            console.log(e);
          }
        });
      }
    });

    this.mini.onLoop(() => {
      if (this.active) {
        this.tasks.forEach((t) => {
          try {
            t();
          } catch (e) {
            console.log(e);
          }
        });
      }
    });

    this.destroy = () => {
      this.active = false;
      this.cleanups.forEach((cl) => {
        try {
          cl();
        } catch (e) {
          console.log(e);
        }
      });
    };

    // apis
    this.ready = this.mini.ready;
    this.event = this.mini.event;
    this.set = this.mini.set;
    this.get = this.mini.get;
    this.resource = this.mini.resource;
    this.getRect = this.mini.getRect;
    this.onClean = (v) => {
      this.cleanups.push(v);
    };
    this.onLoop = (v) => {
      this.tasks.push(v);
    };
    this.onResize = (v) => {
      this.reseizers.push(v);
    };
    this.domElement = mini.domElement;
  }
}
