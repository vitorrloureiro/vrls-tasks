import { bench } from "vitest";
import { PromiseTaskQueue } from "../main";
import { PromiseTaskQueueGeneratorBased } from "../tasks/queues/PromiseTaskQueueGeneratorBased";

let mockTaskQueue: PromiseTaskQueue | PromiseTaskQueueGeneratorBased;

bench(
  "ARRAY run 1_000 tasks",
  async () => {
    mockTaskQueue.enqueue(async () => undefined);
  },
  {
    setup: () => {
      mockTaskQueue = new PromiseTaskQueue();
    },
    iterations: 1_000,
  }
);

bench(
  "GENERATOR run 1_000 tasks",
  async () => {
    mockTaskQueue.enqueue(async () => undefined);
  },
  {
    setup: () => {
      mockTaskQueue = new PromiseTaskQueueGeneratorBased();
    },
    iterations: 1_000,
  }
);
