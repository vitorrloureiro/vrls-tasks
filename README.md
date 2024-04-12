# vrls-tasks

`vrls-tasks` is an efficient, lightweight library for asynchronous task management in JavaScript and TypeScript projects. It provides mechanisms for organizing and executing tasks with precision and ease, featuring the `PromiseTaskQueue` for streamlined, sequential task processing. This library is ideal for developers aiming to boost their applications' performance and reliability through scalable and maintainable asynchronous workflows.

## Features

- **Efficient Task Management:** Organizes and executes asynchronous operations in a manageable, orderly fashion.
- **Sequential Execution:** Guarantees that tasks are processed in the sequence they are added to the queue.
- **Error Handling:** Offers robust error management, ensuring tasks' failures do not halt the queue's operation.
- **TypeScript Support:** Provides comprehensive type definitions for a strongly-typed development approach.
- **Modern Integration:** Designed with ES Module support, facilitating integration into contemporary web development projects.
- **Multiple Task Enqueueing:** Allows adding multiple tasks at once with `enqueueMultiple`, returning a tuple of promises corresponding to the tasks' resolutions.
- **Event-Driven Notifications:** Supports event handling to notify when all tasks in the queue have been completed with the `queuefinished` event.
- **Run State Monitoring:** Exposes a `isRunning` property to allow monitoring whether the queue is currently processing tasks.

## Installation

To integrate `vrls-tasks` into your project, use pnpm:

\```bash
pnpm add vrls-tasks
\```

## Usage

Begin with `vrls-tasks` effortlessly:

\```javascript
import { PromiseTaskQueue } from "vrls-tasks";

const queue = new PromiseTaskQueue();

// Sample tasks
const task1 = () => new Promise((resolve) => setTimeout(() => resolve("Task 1 completed"), 1000));
const task2 = () => new Promise((resolve) => setTimeout(() => resolve("Task 2 completed"), 500));

// Enqueueing a single task
queue.enqueue(task1).then(console.log); // Logs: Task 1 completed
queue.enqueue(task2).then(console.log); // Logs: Task 2 completed

// Enqueueing multiple tasks simultaneously
const [task1Promise, task2Promise] = queue.enqueueMultiple([task1, task2]);

Promise.all([task1Promise, task2Promise]).then(console.log); // Logs: ["Task 1 completed", "Task 2 completed"]

// Event handling for queue completion
queue.addEventListener('queuefinished', () => console.log('All tasks have been processed.'));
\```

This example demonstrates not only how to add individual tasks to the queue but also how to utilize `enqueueMultiple` to add several tasks at once, and how to handle events when all tasks are completed.

## Contributing

We welcome contributions to `vrls-tasks`! Whether through bug reports, feature suggestions, or code contributions, your feedback is invaluable in refining and enhancing this library for the community.

## License

`vrls-tasks` is distributed under the MIT license, accommodating both personal and commercial usage. Consult the [LICENSE](https://github.com/vitorrloureiro/vrls-tasks/blob/main/LICENSE) file for more information.

## Acknowledgements

- Development and build processes are streamlined with [Vite](https://vitejs.dev/).
- [Vitest](https://vitest.dev/) supports our testing efforts.

Visit the [GitHub repository](https://github.com/vitorrloureiro/vrls-tasks) for comprehensive documentation, additional examples, and the latest updates.
