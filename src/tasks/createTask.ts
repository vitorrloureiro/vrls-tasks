import type { Task } from "./types/Task";

export function createTask<T>(callback: () => Promise<T>): Task<T> {
  let resolve: Task<T>["resolve"] = () => {
    throw new Error("Resolve function not initialized.");
  };
  let reject: Task<T>["reject"] = () => {
    throw new Error("Reject function not initialized.");
  };

  const controlPromise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { callback, resolve, reject, controlPromise };
}
