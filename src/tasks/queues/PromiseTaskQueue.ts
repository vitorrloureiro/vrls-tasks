import type { Task } from "../types/Task";
import type { CallbacksArray } from "../types/CallbacksArray";

import { createTask } from "../createTask";

type EnqueueMultipleReturn<T extends CallbacksArray> = { [K in keyof T]: ReturnType<T[K]> };
export class PromiseTaskQueue {
  #queue: Task<any>[] = [];
  #isRunning = false;

  enqueue<T>(callback: () => Promise<T>) {
    const task = createTask(callback);
    this.#queue.push(task);

    this.#runTasks();
    return task.controlPromise;
  }

  enqueueMultiple<T extends CallbacksArray>(callbacks: [...T]): EnqueueMultipleReturn<T> {
    const promises: Promise<any>[] = [];

    callbacks.forEach((callback) => {
      const task = createTask(callback);
      promises.push(task.controlPromise);
      this.#queue.push(task);
    });

    this.#runTasks();
    return promises as EnqueueMultipleReturn<T>;
  }

  async #runTasks() {
    if (this.#isRunning) {
      return;
    }

    this.#isRunning = true;

    while (this.#queue.length) {
      const currentTask = this.#queue.shift();

      try {
        const taskResult = await currentTask?.callback();
        currentTask?.resolve(taskResult);
      } catch (error) {
        currentTask?.reject(error);
      }
    }
    this.#isRunning = false;
  }
}
