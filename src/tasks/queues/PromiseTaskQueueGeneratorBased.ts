import type { Task } from "../types/Task";
import type { CallbacksArray } from "../types/CallbacksArray";

import { SimpleEventTarget } from "vrls-simple-event-target";

import { createTask } from "../createTask";

type EnqueueMultipleReturn<T extends CallbacksArray> = { [K in keyof T]: ReturnType<T[K]> };
type EventsMap = {
  queuefinished: () => void;
};
export class PromiseTaskQueueGeneratorBased extends SimpleEventTarget<EventsMap> {
  #isRunning = false;
  #taskRunner: AsyncGenerator<void, void, Task<any>>;

  constructor() {
    super(["queuefinished"]);
    this.#taskRunner = this.#createTaskRunner();
    this.#taskRunner.next();
  }

  get isRunning() {
    return this.#isRunning;
  }

  enqueue<T>(callback: () => Promise<T>) {
    const task = createTask(callback);
    this.#taskRunner.next(task);
    return task.controlPromise;
  }

  enqueueMultiple<T extends CallbacksArray>(callbacks: [...T]): EnqueueMultipleReturn<T> {
    const promises: Promise<any>[] = [];

    callbacks.forEach((callback) => {
      const task = createTask(callback);
      promises.push(task.controlPromise);
      this.#taskRunner.next(task);
    });

    return promises as EnqueueMultipleReturn<T>;
  }

  async *#createTaskRunner() {
    let taskToRun: Task<unknown>;

    while (true) {
      taskToRun = yield;
      try {
        const taskResult = await taskToRun.callback();
        taskToRun.resolve(taskResult);
      } catch (e) {
        taskToRun.reject(e);
      }
    }
  }
}
