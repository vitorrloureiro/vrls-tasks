import { bench } from "vitest";
import { PromiseTaskQueue } from "../main";
import { PromiseTaskQueueGeneratorBased } from "../tasks/queues/PromiseTaskQueueGeneratorBased";

let mockTaskQueue: PromiseTaskQueue | PromiseTaskQueueGeneratorBased;

let callbacksToEnqueue: (() => Promise<any>)[] = [];

function fillCallbacksToEnqueue() {
  for (let i = 0; i < 1_000; i++) {
    callbacksToEnqueue.push(async () => undefined);
  }
}

bench(
  "ARRAY run 1_000 tasks",
  async () => {
    mockTaskQueue.enqueueMultiple(callbacksToEnqueue);
  },
  {
    setup: () => {
      mockTaskQueue = new PromiseTaskQueue();
      fillCallbacksToEnqueue();
    },
    teardown: () => {
      callbacksToEnqueue = [];
    },
  }
);

bench(
  "GENERATOR run 1_000 tasks",
  async () => {
    mockTaskQueue.enqueueMultiple(callbacksToEnqueue);
  },
  {
    setup: () => {
      mockTaskQueue = new PromiseTaskQueueGeneratorBased();
      fillCallbacksToEnqueue();
    },
    teardown: () => {
      callbacksToEnqueue = [];
    },
  }
);
