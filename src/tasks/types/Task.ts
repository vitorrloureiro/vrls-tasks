export type Task<T> = {
  callback: () => Promise<T>;
  controlPromise: Promise<T>;
  resolve: (value: T) => void;
  reject: (reason?: unknown) => void;
};
