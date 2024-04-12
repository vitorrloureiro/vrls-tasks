import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { PromiseTaskQueue } from "../PromiseTaskQueue";

describe("PromiseTaskQueue", () => {
  const TASK1_TIMEOUT = 1000000;
  const TASK2_TIMEOUT = 1000;

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe("enqueue", () => {
    it("should run tasks sequentially", async () => {
      const mockPromiseQueue = new PromiseTaskQueue();
      const expectedString = "string";
      const expectedNumber = 3.14;

      const mockTask1 = vi.fn(() => new Promise<string>((res) => setTimeout(() => res(expectedString), TASK1_TIMEOUT)));
      const mockTask2 = vi.fn(() => new Promise<number>((res) => setTimeout(() => res(expectedNumber), TASK2_TIMEOUT)));

      const promise1 = mockPromiseQueue.enqueue(mockTask1);
      const promise2 = mockPromiseQueue.enqueue(mockTask2);

      await vi.advanceTimersByTimeAsync(TASK2_TIMEOUT);

      expect(mockTask1).toHaveBeenCalled();
      expect(mockTask2).not.toHaveBeenCalled();

      await vi.runAllTimersAsync();

      await expect(promise1).resolves.toBe(expectedString);
      await expect(promise2).resolves.toBe(expectedNumber);

      expect(mockTask1).toHaveBeenCalled();
      expect(mockTask2).toHaveBeenCalled();
    });

    it("should handle task errors without stopping the queue", async () => {
      const mockPromiseQueue = new PromiseTaskQueue();
      const errorMessage = "Error in task";
      const expectedNumber = 3.14;

      const failingTask = vi.fn(
        () => new Promise((_, rej) => setTimeout(() => rej(new Error(errorMessage)), TASK1_TIMEOUT))
      );
      const succeedingTask = vi.fn(() => new Promise((res) => setTimeout(() => res(expectedNumber), TASK2_TIMEOUT)));

      const promise1 = mockPromiseQueue.enqueue(failingTask);
      const promise2 = mockPromiseQueue.enqueue(succeedingTask);

      const rejectedPromise = expect(promise1).rejects.toThrow(errorMessage);
      const resolvedPromise = expect(promise2).resolves.toBe(expectedNumber);

      await vi.runAllTimersAsync();

      await rejectedPromise;
      await resolvedPromise;

      expect(failingTask).toHaveBeenCalled();
      expect(succeedingTask).toHaveBeenCalled();
    });
  });

  describe("enqueueMultiple", () => {
    it("should run multiple tasks sequentially and resolve their promises", async () => {
      const mockPromiseQueue = new PromiseTaskQueue();
      const expectedString = "string";
      const expectedNumber = 3.14;

      const mockTask1 = vi.fn(() => new Promise<string>((res) => setTimeout(() => res(expectedString), TASK1_TIMEOUT)));
      const mockTask2 = vi.fn(() => new Promise<number>((res) => setTimeout(() => res(expectedNumber), TASK2_TIMEOUT)));

      const [promise1, promise2] = mockPromiseQueue.enqueueMultiple([mockTask1, mockTask2]);

      await vi.advanceTimersByTimeAsync(TASK2_TIMEOUT);

      expect(mockTask1).toHaveBeenCalled();
      expect(mockTask2).not.toHaveBeenCalled();

      await vi.runAllTimersAsync();

      await expect(promise1).resolves.toBe(expectedString);
      await expect(promise2).resolves.toBe(expectedNumber);

      expect(mockTask1).toHaveBeenCalled();
      expect(mockTask2).toHaveBeenCalled();
    });

    it("should handle errors in one of the tasks without stopping the queue", async () => {
      const mockPromiseQueue = new PromiseTaskQueue();
      const errorMessage = "Error in task";
      const expectedNumber = 3.14;

      const failingTask = vi.fn(
        () => new Promise((_, rej) => setTimeout(() => rej(new Error(errorMessage)), TASK1_TIMEOUT))
      );
      const succeedingTask = vi.fn(() => new Promise((res) => setTimeout(() => res(expectedNumber), TASK2_TIMEOUT)));

      const [promise1, promise2] = mockPromiseQueue.enqueueMultiple([failingTask, succeedingTask]);

      const rejectedPromise = expect(promise1).rejects.toThrow(errorMessage);
      const resolvedPromise = expect(promise2).resolves.toBe(expectedNumber);

      await vi.runAllTimersAsync();

      await rejectedPromise;
      await resolvedPromise;

      expect(failingTask).toHaveBeenCalled();
      expect(succeedingTask).toHaveBeenCalled();
    });
  });

  it("should dispatch 'queuefinished' when queue is finished", async () => {
    const mockPromiseQueue = new PromiseTaskQueue();
    const mockDispatchEvent = vi.fn();
    vi.spyOn(mockPromiseQueue, "dispatchEvent").mockImplementation(mockDispatchEvent);

    const promises1 = mockPromiseQueue.enqueueMultiple([() => Promise.resolve(), () => Promise.resolve()]);
    expect(mockDispatchEvent).not.toBeCalled();
    await Promise.all(promises1);
    expect(mockDispatchEvent).toBeCalledTimes(1);

    const promises2 = mockPromiseQueue.enqueueMultiple([() => Promise.resolve(), () => Promise.resolve()]);
    await Promise.all(promises2);
    expect(mockDispatchEvent).toBeCalledTimes(2);
  });

  it("should correctly return isRunning state", async () => {
    const mockPromiseQueue = new PromiseTaskQueue();

    expect(mockPromiseQueue.isRunning).toBe(false);

    const promises = mockPromiseQueue.enqueueMultiple([
      () => new Promise((res) => setTimeout(res, TASK1_TIMEOUT)),
      () => new Promise((res) => setTimeout(res, TASK2_TIMEOUT)),
    ]);

    expect(mockPromiseQueue.isRunning).toBe(true);
    await vi.runAllTimersAsync();
    await Promise.all(promises);
    expect(mockPromiseQueue.isRunning).toBe(false);
  });
});
