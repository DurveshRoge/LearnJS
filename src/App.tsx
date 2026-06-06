import { useEffect, useMemo, useRef, useState } from 'react'
import MonacoEditor from '@monaco-editor/react'
import './App.css'

type Topic = {
  title: string
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Practice'
  duration: string
  summary: string
  learn: string[]
  example: string
}

type TraceStep = {
  label: string
  stack: string[]
  microtasks: string[]
  tasks: string[]
  console: string[]
}

type TraceScenario = {
  title: string
  code: string
  steps: TraceStep[]
}

type Page = 'home' | 'roadmap' | 'topics' | 'quizzes' | 'editor' | 'visualizer'
type EditorOutputLevel = 'log' | 'warn' | 'error'

type EditorOutputEntry = {
  id: number
  level: EditorOutputLevel
  message: string
}

const topics: Topic[] = [
  {
    title: 'Introduction to JavaScript',
    level: 'Beginner',
    duration: '10 min',
    summary:
      'Understand what JavaScript is, where it runs, and how it powers browser and server applications.',
    learn: [
      'JavaScript runs in browsers, Node.js, and other runtimes.',
      'The runtime provides APIs such as timers, DOM access, fetch, and files.',
      'A JavaScript program is parsed, executed, and coordinated by the event loop.',
    ],
    example: 'console.log("JavaScript runs here");',
  },
  {
    title: 'Variables (var, let, const)',
    level: 'Beginner',
    duration: '12 min',
    summary:
      'Store values with the right declaration keyword and understand reassignment, scope, and hoisting.',
    learn: [
      'Use const by default when a binding should not be reassigned.',
      'Use let for values that change over time.',
      'Avoid var in modern code because it is function-scoped and hoisted differently.',
    ],
    example: 'const name = "Asha";\nlet score = 0;\nscore += 10;',
  },
  {
    title: 'Data Types',
    level: 'Beginner',
    duration: '11 min',
    summary:
      'Learn primitive and reference values including strings, numbers, booleans, null, undefined, symbols, arrays, and objects.',
    learn: [
      'Primitive values are copied by value.',
      'Objects and arrays are reference values.',
      'typeof helps inspect many values, but null is a historical exception.',
    ],
    example: 'typeof "hello"; // string\ntypeof 42; // number\ntypeof null; // object',
  },
  {
    title: 'Operators',
    level: 'Beginner',
    duration: '9 min',
    summary:
      'Use arithmetic, comparison, logical, assignment, spread, optional chaining, and nullish coalescing operators.',
    learn: [
      'Prefer strict equality with === and !==.',
      'Logical operators return values, not only booleans.',
      '?? handles null or undefined without treating 0 or empty strings as missing.',
    ],
    example: 'const fallback = user.name ?? "Guest";',
  },
  {
    title: 'Conditionals',
    level: 'Beginner',
    duration: '10 min',
    summary:
      'Control program flow with if, else, switch, ternary expressions, and guard clauses.',
    learn: [
      'Use conditionals to run code only when a condition is true.',
      'Guard clauses keep functions flatter and easier to read.',
      'Switch works well for one value with many known cases.',
    ],
    example: 'if (score >= 80) {\n  console.log("Passed");\n}',
  },
  {
    title: 'Loops',
    level: 'Beginner',
    duration: '12 min',
    summary:
      'Repeat work with for, while, for...of, and array iteration methods.',
    learn: [
      'Use for...of for readable iteration over arrays.',
      'Use while when the stop condition is not tied to a fixed count.',
      'Use break and continue carefully to control loop flow.',
    ],
    example: 'for (const item of cart) {\n  console.log(item.name);\n}',
  },
  {
    title: 'Functions',
    level: 'Beginner',
    duration: '14 min',
    summary:
      'Package reusable logic with declarations, expressions, arrow functions, parameters, and return values.',
    learn: [
      'A function creates a reusable block of behavior.',
      'Return values let functions produce results.',
      'Arrow functions are concise and keep lexical this.',
    ],
    example: 'const double = (n) => n * 2;\nconsole.log(double(4));',
  },
  {
    title: 'Scope',
    level: 'Beginner',
    duration: '12 min',
    summary:
      'Understand where variables are visible: global scope, function scope, and block scope.',
    learn: [
      'let and const are block-scoped.',
      'Functions create their own local scope.',
      'Inner scopes can read outer variables, but outer scopes cannot read inner variables.',
    ],
    example: 'if (true) {\n  const message = "inside block";\n}',
  },
  {
    title: 'Hoisting',
    level: 'Intermediate',
    duration: '11 min',
    summary:
      'Learn how declarations are prepared before code executes and why var, let, const, and functions behave differently.',
    learn: [
      'Function declarations can be called before their line in code.',
      'var is hoisted and initialized as undefined.',
      'let and const are hoisted but stay in the temporal dead zone until declared.',
    ],
    example: 'sayHi();\nfunction sayHi() {\n  console.log("Hi");\n}',
  },
  {
    title: 'Arrays',
    level: 'Beginner',
    duration: '13 min',
    summary:
      'Work with ordered collections using map, filter, reduce, find, some, every, and mutation methods.',
    learn: [
      'map transforms every item.',
      'filter keeps matching items.',
      'reduce combines a list into one result.',
    ],
    example: 'const totals = prices.map((price) => price * 1.18);',
  },
  {
    title: 'Objects',
    level: 'Beginner',
    duration: '13 min',
    summary:
      'Model structured data with properties, methods, destructuring, spread, and computed keys.',
    learn: [
      'Objects store key-value pairs.',
      'Destructuring extracts properties into local variables.',
      'Object spread creates shallow copies.',
    ],
    example: 'const user = { name: "Asha", role: "student" };\nconst { name } = user;',
  },
  {
    title: 'DOM Manipulation',
    level: 'Intermediate',
    duration: '15 min',
    summary:
      'Select elements, update content, change classes, and build interactive browser interfaces.',
    learn: [
      'The DOM is the browser representation of HTML.',
      'querySelector finds elements using CSS selectors.',
      'classList and textContent are common safe update APIs.',
    ],
    example: 'document.querySelector("h1").textContent = "LearnJS";',
  },
  {
    title: 'Events',
    level: 'Intermediate',
    duration: '12 min',
    summary:
      'Respond to clicks, input, keyboard actions, form submissions, and browser events.',
    learn: [
      'addEventListener registers event handlers.',
      'Event objects describe what happened.',
      'Events can bubble from child elements to parents.',
    ],
    example: 'button.addEventListener("click", () => console.log("clicked"));',
  },
  {
    title: 'Closures',
    level: 'Intermediate',
    duration: '15 min',
    summary:
      'Use functions that remember variables from their original scope even after that scope has finished.',
    learn: [
      'Closures happen when an inner function uses outer variables.',
      'They are useful for private state and function factories.',
      'They explain many callback and async patterns.',
    ],
    example: 'function counter() {\n  let count = 0;\n  return () => ++count;\n}',
  },
  {
    title: 'Execution Context',
    level: 'Advanced',
    duration: '14 min',
    summary:
      'See how JavaScript creates global and function execution contexts while running code.',
    learn: [
      'Each function call creates a new execution context.',
      'Contexts track variables, scope links, and this.',
      'Execution contexts are pushed to and popped from the call stack.',
    ],
    example: 'function run() {\n  const value = 1;\n  return value;\n}',
  },
  {
    title: 'Call Stack',
    level: 'Advanced',
    duration: '12 min',
    summary:
      'Understand the LIFO structure that tracks currently executing functions.',
    learn: [
      'The top stack frame is the code currently running.',
      'Nested function calls add stack frames.',
      'Returning from a function removes its frame.',
    ],
    example: 'function a() { b(); }\nfunction b() { console.log("top"); }\na();',
  },
  {
    title: 'Web APIs',
    level: 'Advanced',
    duration: '13 min',
    summary:
      'Learn how browser-provided APIs such as timers, DOM events, and fetch work with JavaScript.',
    learn: [
      'Web APIs are provided by the browser, not the JavaScript language itself.',
      'Timers and network requests complete outside the call stack.',
      'Completed async work queues callbacks for the event loop.',
    ],
    example: 'setTimeout(() => console.log("later"), 1000);',
  },
  {
    title: 'Callback Queue',
    level: 'Advanced',
    duration: '12 min',
    summary:
      'Track macrotasks such as timers, DOM events, and message callbacks waiting to execute.',
    learn: [
      'Timer callbacks enter the task queue after their delay.',
      'The event loop runs one task per loop turn.',
      'Microtasks drain before the next task is selected.',
    ],
    example: 'setTimeout(() => console.log("task"), 0);',
  },
  {
    title: 'Microtask Queue',
    level: 'Advanced',
    duration: '12 min',
    summary:
      'Understand promise reactions and queueMicrotask callbacks that run before task queue callbacks.',
    learn: [
      'Promise .then callbacks are microtasks.',
      'Microtasks drain completely before the browser takes another task.',
      'Too many microtasks can delay rendering and timers.',
    ],
    example: 'Promise.resolve().then(() => console.log("microtask"));',
  },
  {
    title: 'Event Loop',
    level: 'Advanced',
    duration: '16 min',
    summary:
      'Connect the call stack, Web APIs, microtask queue, task queue, and rendering cycle.',
    learn: [
      'Synchronous code runs first on the call stack.',
      'Microtasks run after the stack clears.',
      'Tasks run later, one at a time, through the event loop.',
    ],
    example: 'console.log("A");\nsetTimeout(() => console.log("B"), 0);\nPromise.resolve().then(() => console.log("C"));',
  },
  {
    title: 'Promises',
    level: 'Intermediate',
    duration: '15 min',
    summary:
      'Represent future success or failure with then, catch, finally, resolve, reject, and chaining.',
    learn: [
      'A promise can be pending, fulfilled, or rejected.',
      'then handles fulfillment, catch handles rejection.',
      'Promise callbacks run as microtasks.',
    ],
    example: 'fetch("/api").then((res) => res.json()).catch(console.error);',
  },
  {
    title: 'Async/Await',
    level: 'Intermediate',
    duration: '15 min',
    summary:
      'Write promise-based code in a readable, top-to-bottom style using async functions and await.',
    learn: [
      'async functions always return a promise.',
      'await pauses inside the async function until a promise settles.',
      'Use try/catch for async error handling.',
    ],
    example: 'async function load() {\n  const data = await getData();\n  return data;\n}',
  },
  {
    title: 'Fetch API',
    level: 'Intermediate',
    duration: '14 min',
    summary:
      'Request resources over HTTP, handle responses, parse JSON, and manage network errors.',
    learn: [
      'fetch returns a promise for a Response object.',
      'response.ok helps detect HTTP error status codes.',
      'response.json() also returns a promise.',
    ],
    example: 'const res = await fetch("/users");\nconst users = await res.json();',
  },
  {
    title: 'ES6+',
    level: 'Intermediate',
    duration: '18 min',
    summary:
      'Use modern JavaScript features: template literals, destructuring, spread, classes, modules, and optional chaining.',
    learn: [
      'ES6 introduced many features used in modern apps.',
      'Template literals make string interpolation readable.',
      'Spread and destructuring reduce boilerplate.',
    ],
    example: 'const message = `Hello, ${user.name}`;',
  },
  {
    title: 'Modules',
    level: 'Intermediate',
    duration: '13 min',
    summary:
      'Split code across files with named exports, default exports, and imports.',
    learn: [
      'Modules make dependencies explicit.',
      'Named exports are useful for multiple utilities.',
      'Default exports are useful for one main value per file.',
    ],
    example: 'export const sum = (a, b) => a + b;\nimport { sum } from "./math.js";',
  },
  {
    title: 'OOP',
    level: 'Advanced',
    duration: '16 min',
    summary:
      'Model behavior with prototypes, classes, constructors, inheritance, and encapsulation.',
    learn: [
      'JavaScript objects delegate through prototypes.',
      'class syntax is built on top of prototypes.',
      'Use composition when inheritance becomes hard to reason about.',
    ],
    example: 'class User {\n  constructor(name) { this.name = name; }\n  greet() { return `Hi ${this.name}`; }\n}',
  },
  {
    title: 'Projects',
    level: 'Practice',
    duration: '30 min',
    summary:
      'Apply your JavaScript knowledge by building small apps that combine data, DOM, events, and async code.',
    learn: [
      'Build projects to connect topics together.',
      'Start small: quiz app, todo app, weather app, or mini visualizer.',
      'Read errors carefully and debug one assumption at a time.',
    ],
    example: 'Build: quiz app + localStorage + score summary.',
  },
]

const topicDocuments: Record<string, string> = {
  'Introduction to JavaScript': `# Introduction to JavaScript

## What is JavaScript?

JavaScript is a high-level, interpreted, single-threaded programming language used to create dynamic and interactive web applications.

Initially JavaScript was developed only for browsers, but today it can run:

- Browsers
- Servers (Node.js)
- Mobile Apps
- Desktop Applications
- IoT Devices

---

## Why JavaScript?

Without JavaScript websites would be static.

HTML → Structure

CSS → Styling

JavaScript → Behavior

Example:

\`\`\`html
<button id="btn">Click Me</button>
\`\`\`

Without JavaScript button does nothing.

\`\`\`js
document.getElementById("btn")
.addEventListener("click",()=>{
   alert("Button Clicked");
});
\`\`\`

Now website becomes interactive.

---

## Features of JavaScript

### Dynamic Typing

\`\`\`js
let x = 10;
x = "Hello";
\`\`\`

Variable type changes automatically.

---

### Interpreted Language

Code executes line by line.

\`\`\`js
console.log("Hello");
\`\`\`

No compilation required.

---

### Single Threaded

JavaScript executes one task at a time.

\`\`\`js
console.log("A");
console.log("B");
console.log("C");
\`\`\`

Output

\`\`\`js
A
B
C
\`\`\`

---

### Event Driven

Responds to events.

\`\`\`js
button.addEventListener("click",()=>{
   console.log("Clicked");
});
\`\`\`

---

## JavaScript Engine

Browser contains a JavaScript Engine.

Examples:

- Chrome → V8
- Firefox → SpiderMonkey
- Safari → JavaScriptCore

Engine converts code into machine code.

---

## How JavaScript Executes Code

Steps:

\`\`\`text
Source Code
      ↓
Parser
      ↓
AST
      ↓
Compiler
      ↓
Machine Code
      ↓
Execution
\`\`\`
`,

  'Variables (var, let, const)': `# Variables (var, let, const)

## What is a Variable?

A variable is a named storage location used to store data.

\`\`\`js
let name = "Durvesh";
\`\`\`

---

## Why Variables?

Without variables, values are repeated manually.

\`\`\`js
console.log("Durvesh");
console.log("Durvesh");
console.log("Durvesh");
\`\`\`

With a variable, the value is stored once and reused.

\`\`\`js
let name = "Durvesh";

console.log(name);
console.log(name);
console.log(name);
\`\`\`

---

## var

### Syntax

\`\`\`js
var age = 22;
\`\`\`

### Function Scoped

\`\`\`js
function test() {
  var x = 10;
}

console.log(x);
\`\`\`

This gives an error because x exists only inside the function.

### Redeclaration Allowed

\`\`\`js
var a = 10;
var a = 20;
\`\`\`

This is valid.

### Reassignment Allowed

\`\`\`js
var a = 10;
a = 20;
\`\`\`

This is also valid.

### Hoisted

\`\`\`js
console.log(a);
var a = 10;
\`\`\`

Output:

\`\`\`js
undefined
\`\`\`

Internally JavaScript treats it like this:

\`\`\`js
var a;
console.log(a);
a = 10;
\`\`\`

---

## let

let was introduced in ES6.

\`\`\`js
let age = 22;
\`\`\`

### Block Scope

\`\`\`js
if (true) {
  let x = 10;
}

console.log(x);
\`\`\`

This gives an error because x only exists inside the block.

### Cannot Redeclare

\`\`\`js
let a = 10;
let a = 20;
\`\`\`

This gives an error.

### Can Reassign

\`\`\`js
let a = 10;
a = 20;
\`\`\`

This is valid.

---

## const

const is used for fixed references.

\`\`\`js
const PI = 3.14;
\`\`\`

### Cannot Reassign

\`\`\`js
const PI = 3.14;
PI = 5;
\`\`\`

This gives an error.

### Objects with const

\`\`\`js
const user = {
  name: "Durvesh"
};

user.name = "John";
\`\`\`

This is allowed because the object content changed, but the variable still points to the same object.

---

## var vs let vs const

| Feature | var | let | const |
| --- | --- | --- | --- |
| Scope | Function | Block | Block |
| Redeclare | Yes | No | No |
| Reassign | Yes | Yes | No |
| Hoisting | Yes | Yes with TDZ | Yes with TDZ |

## Best Practice

- Use const by default.
- Use let when reassignment is required.
- Avoid var in modern JavaScript.`,

  'Data Types': `# Data Types

Data types define what kind of value a variable stores.

---

## Primitive Types

Primitive values are stored directly.

### Number

\`\`\`js
let age = 22;
let price = 99.99;
\`\`\`

### String

\`\`\`js
let name = "Durvesh";
\`\`\`

### Boolean

\`\`\`js
let isLoggedIn = true;
\`\`\`

### Undefined

A variable declared but not assigned has the value undefined.

\`\`\`js
let x;
console.log(x);
\`\`\`

Output:

\`\`\`js
undefined
\`\`\`

### Null

null means intentional empty value.

\`\`\`js
let data = null;
\`\`\`

### Symbol

Symbols create unique identifiers.

\`\`\`js
const id = Symbol();
\`\`\`

### BigInt

BigInt stores very large integers.

\`\`\`js
let big = 123456789012345678901234567890n;
\`\`\`

---

## Non Primitive Types

Non-primitive values are stored by reference.

### Object

\`\`\`js
const user = {
  name: "Durvesh"
};
\`\`\`

### Array

\`\`\`js
const arr = [1, 2, 3];
\`\`\`

### Function

\`\`\`js
function greet() {}
\`\`\`

---

## typeof Operator

\`\`\`js
typeof 10
\`\`\`

Output:

\`\`\`js
"number"
\`\`\`

### Strange Case

\`\`\`js
typeof null
\`\`\`

Output:

\`\`\`js
"object"
\`\`\`

This is a historical JavaScript bug.

## Summary

Understand the difference between primitive values and reference values. Many bugs in arrays and objects come from misunderstanding reference behavior.`,

  Operators: `# Operators

Operators perform operations on values.

---

## Arithmetic Operators

\`\`\`js
+
-
*
/
%
**
\`\`\`

Example:

\`\`\`js
let a = 10;
let b = 3;

console.log(a + b);
console.log(a - b);
console.log(a * b);
console.log(a / b);
console.log(a % b);
\`\`\`

---

## Comparison Operators

\`\`\`js
==
===
!=
!==
>
<
>=
<=
\`\`\`

### ==

Checks value only and allows type coercion.

\`\`\`js
5 == "5"
\`\`\`

Output:

\`\`\`js
true
\`\`\`

### ===

Checks value and type.

\`\`\`js
5 === "5"
\`\`\`

Output:

\`\`\`js
false
\`\`\`

---

## Logical Operators

\`\`\`js
&&
||
!
\`\`\`

Logical operators help combine conditions.

---

## Ternary Operator

\`\`\`js
let result = age >= 18 ? "Adult" : "Minor";
\`\`\`

## Best Practice

- Prefer === over ==.
- Keep complex ternaries readable.
- Use parentheses when operator precedence is not obvious.`,

  Conditionals: `# Conditionals

Conditionals allow decision making in programs.

---

## if

\`\`\`js
if (age >= 18) {
  console.log("Adult");
}
\`\`\`

---

## if else

\`\`\`js
if (age >= 18) {
  console.log("Adult");
} else {
  console.log("Minor");
}
\`\`\`

---

## else if

\`\`\`js
if (score >= 90) {
  console.log("A");
} else if (score >= 80) {
  console.log("B");
} else {
  console.log("C");
}
\`\`\`

---

## switch

Useful when checking one value against multiple cases.

\`\`\`js
switch (day) {
  case 1:
    console.log("Monday");
    break;

  case 2:
    console.log("Tuesday");
    break;

  default:
    console.log("Invalid");
}
\`\`\`

## Common Mistakes

- Forgetting break inside switch.
- Writing conditions that are too complex.
- Confusing assignment = with comparison ===.

## Best Practice

- Prefer === over == in conditions.
- Use early returns to avoid deep nesting.
- Always use braces with if/else to prevent bugs.

## Summary

Conditionals control the flow of your program. Master if, else if, switch, and the ternary operator to write clear and predictable logic.`,

  'Callback Queue': `# Callback Queue

## What is Callback Queue?

The Callback Queue (also called Task Queue or Macrotask Queue) is a queue where callback functions wait after their asynchronous operation completes.

JavaScript is single-threaded, so asynchronous tasks cannot directly enter the Call Stack while it is busy.

Instead:

\`\`\`text
Web API
   ↓
Callback Queue
   ↓
Event Loop
   ↓
Call Stack
\`\`\`

---

## Why Callback Queue Exists

Imagine:

\`\`\`js
console.log("Start");

setTimeout(() => {
  console.log("Timer");
}, 2000);

console.log("End");
\`\`\`

Output:

\`\`\`text
Start
End
Timer
\`\`\`

If Callback Queue didn't exist:

\`\`\`text
Start
Timer
End
\`\`\`

would occur, blocking execution.

---

## Internal Working

### Step 1

\`\`\`js
setTimeout(callback, 2000);
\`\`\`

moves timer handling to Browser Web API.

---

### Step 2

Timer finishes.

Callback moves to:

\`\`\`text
Callback Queue
\`\`\`

---

### Step 3

Event Loop checks:

\`\`\`text
Is Call Stack Empty?
\`\`\`

If yes:

\`\`\`text
Callback Queue → Call Stack
\`\`\`

---

## Example

\`\`\`js
console.log("A");

setTimeout(() => {
  console.log("B");
}, 0);

console.log("C");
\`\`\`

Output:

\`\`\`text
A
C
B
\`\`\`

Even though timeout is 0ms.

---

## Common Callback Queue Tasks

\`\`\`js
setTimeout()
setInterval()
DOM Events
MessageChannel
postMessage()
\`\`\`

---

## Interview Questions

### Why does setTimeout(0) not execute immediately?

Because callback first enters Callback Queue and waits for Call Stack to become empty.`,

  'Microtask Queue': `# Microtask Queue

## What is Microtask Queue?

Microtask Queue is a special queue with higher priority than Callback Queue.

Tasks inside it execute before any callback queue task.

---

## Sources of Microtasks

### Promise.then()

\`\`\`js
Promise.resolve()
.then(() => {
   console.log("Promise");
});
\`\`\`

---

### Promise.catch()

\`\`\`js
Promise.reject()
.catch(() => {});
\`\`\`

---

### Promise.finally()

\`\`\`js
promise.finally(() => {});
\`\`\`

---

### MutationObserver

Browser DOM observer.

---

## Internal Working

\`\`\`text
Call Stack Empty
        ↓
Run ALL Microtasks
        ↓
Run ONE Callback Queue Task
        ↓
Repeat
\`\`\`

---

## Example

\`\`\`js
console.log("Start");

setTimeout(() => {
   console.log("Timer");
}, 0);

Promise.resolve()
.then(() => {
   console.log("Promise");
});

console.log("End");
\`\`\`

Output:

\`\`\`text
Start
End
Promise
Timer
\`\`\`

---

## Why?

Because:

\`\`\`text
Promise → Microtask Queue
Timer → Callback Queue
\`\`\`

Microtask Queue gets priority.

---

## Multiple Microtasks

\`\`\`js
Promise.resolve().then(() => console.log(1));
Promise.resolve().then(() => console.log(2));
Promise.resolve().then(() => console.log(3));
\`\`\`

Output:

\`\`\`text
1
2
3
\`\`\`

All microtasks execute before any callback queue task.

---

## Interview Question

### Which has higher priority?

\`\`\`text
Microtask Queue
\`\`\`
`,

  'Event Loop': `# Event Loop

## Definition

Event Loop is the mechanism that continuously monitors:

- Call Stack
- Microtask Queue
- Callback Queue

and decides what executes next.

---

## Why Event Loop Exists

JavaScript is single-threaded.

Without Event Loop:

\`\`\`js
setTimeout()
fetch()
Promise
\`\`\`

would never work.

---

## Event Loop Cycle

\`\`\`text
1. Execute Call Stack

2. Stack Empty?

3. Run ALL Microtasks

4. Execute ONE Callback Task

5. Repeat Forever
\`\`\`

---

## Visual Diagram

\`\`\`text
          Call Stack
                ↑
                |
          Event Loop
           /      \
          /        \
Microtask Queue  Callback Queue
\`\`\`

---

## Example

\`\`\`js
console.log(1);

setTimeout(() => {
  console.log(2);
}, 0);

Promise.resolve()
.then(() => {
  console.log(3);
});

console.log(4);
\`\`\`

Output:

\`\`\`text
1
4
3
2
\`\`\`

---

## Complete Execution Flow

### Stack

\`\`\`text
console.log(1)
\`\`\`

Output:

\`\`\`text
1
\`\`\`

---

### Timer

\`\`\`js
setTimeout(...)
\`\`\`

goes to Web API.

---

### Promise

\`\`\`js
Promise.resolve()
\`\`\`

goes to Microtask Queue.

---

### Console

\`\`\`js
console.log(4)
\`\`\`

Output:

\`\`\`text
4
\`\`\`

---

### Stack Empty

Event Loop checks:

\`\`\`text
Microtask Queue First
\`\`\`

Output:

\`\`\`text
3
\`\`\`

---

### Then Callback Queue

Output:

\`\`\`text
2
\`\`\`
`,

  'Promises': `# Promises

## What is a Promise?

Promise represents a value that may be available now, later, or never.

---

## Why Promises?

Before Promises:

\`\`\`js
getUser(function(user){
   getPosts(user,function(posts){
      getComments(posts,function(comments){
      });
   });
});
\`\`\`

Callback Hell.

---

## Promise States

\`\`\`text
Pending
Fulfilled
Rejected
\`\`\`

---

## Creating Promise

\`\`\`js
const promise = new Promise(
(resolve,reject)=>{
   resolve("Success");
});
\`\`\`

---

## Consuming Promise

\`\`\`js
promise.then(result=>{
   console.log(result);
});
\`\`\`

---

## Rejecting Promise

\`\`\`js
const promise = new Promise(
(resolve,reject)=>{
   reject("Error");
});
\`\`\`

---

## Catch

\`\`\`js
promise.catch(err=>{
   console.log(err);
});
\`\`\`

---

## Finally

\`\`\`js
promise.finally(()=>{
   console.log("Always Runs");
});
\`\`\`

---

## Promise Chaining

\`\`\`js
fetchUser()
.then(getPosts)
.then(getComments)
.catch(handleError);
\`\`\`

---

## Internal Promise Flow

\`\`\`text
Pending
   ↓
Resolved / Rejected
   ↓
Microtask Queue
   ↓
Call Stack
\`\`\`
`,

  'Async/Await': `# Async/Await

## What is Async/Await?

Cleaner syntax built on top of Promises.

---

## Async Function

\`\`\`js
async function test(){
   return "Hello";
}
\`\`\`

Actually returns:

\`\`\`js
Promise.resolve("Hello")
\`\`\`

---

## Await

\`\`\`js
async function getData(){

   const result =
   await fetch(url);

   console.log(result);
}
\`\`\`

---

## Internal Working

\`\`\`js
await promise
\`\`\`

means:

\`\`\`js
promise.then(...)
\`\`\`

behind the scenes.

---

## Error Handling

\`\`\`js
async function getData(){

 try{

   const res =
   await fetch(url);

 }catch(err){

   console.log(err);

 }

}
\`\`\`

---

## Async vs Promise Chains

Promise:

\`\`\`js
fetch(url)
.then(res=>res.json())
.then(data=>console.log(data));
\`\`\`

Async:

\`\`\`js
const res =
await fetch(url);

const data =
await res.json();
\`\`\`

Cleaner.`,

  'Fetch API': `# Fetch API

## What is Fetch?

Modern browser API used to make HTTP requests.

---

## GET Request

\`\`\`js
fetch("https://api.com/users")
.then(res=>res.json())
.then(data=>console.log(data));
\`\`\`

---

## Async Version

\`\`\`js
async function getUsers(){

 const res =
 await fetch(url);

 const data =
 await res.json();

 console.log(data);

}
\`\`\`

---

## POST Request

\`\`\`js
fetch(url,{
 method:"POST",

 headers:{
   "Content-Type":
   "application/json"
 },

 body:JSON.stringify({
   name:"Durvesh"
 })
});
\`\`\`

---

## Response Object

\`\`\`js
response.ok
response.status
response.headers
response.json()
response.text()
\`\`\`
`,

  'ES6+': `# ES6+

## Major Features

### let

\`\`\`js
let x = 10;
\`\`\`

---

### const

\`\`\`js
const PI = 3.14;
\`\`\`

---

### Arrow Functions

\`\`\`js
const add =
(a,b)=>a+b;
\`\`\`

---

### Template Literals

\`\`\`js
\`Hello \${name}\`
\`\`\`

---

### Destructuring

\`\`\`js
const {name} = user;
\`\`\`

---

### Spread Operator

\`\`\`js
const copy =
[...arr];
\`\`\`

---

### Rest Operator

\`\`\`js
function sum(...nums){}
\`\`\`

---

### Default Parameters

\`\`\`js
function greet(name="Guest"){}
\`\`\`

---

### Optional Chaining

\`\`\`js
user?.address?.city
\`\`\`

---

### Nullish Coalescing

\`\`\`js
value ?? "Default"
\`\`\`
`,

  'Modules': `# Modules

## Why Modules?

Without modules:

\`\`\`js
10000 lines
in one file
\`\`\`

Hard to maintain.

---

## Export

\`\`\`js
export const name =
"Durvesh";
\`\`\`

---

## Import

\`\`\`js
import { name }
from "./user.js";
\`\`\`

---

## Default Export

\`\`\`js
export default function(){}
\`\`\`

Import:

\`\`\`js
import test
from "./user.js";
\`\`\`

---

## Benefits

- Reusability
- Maintainability
- Separation of Concerns`,

  'OOP': `# OOP

## What is OOP?

Programming style based on Objects and Classes.

---

## Class

\`\`\`js
class User{

 constructor(name){
   this.name=name;
 }

}
\`\`\`

---

## Object

\`\`\`js
const user =
new User("Durvesh");
\`\`\`

---

## Encapsulation

\`\`\`js
class User{
 #password;
}
\`\`\`

---

## Inheritance

\`\`\`js
class Admin
extends User{

}
\`\`\`

---

## Polymorphism

\`\`\`js
class Animal{

 sound(){
   console.log("Sound");
 }

}
\`\`\`

---

## Abstraction

Hide implementation details.`,

  'Projects': `# Projects

## Beginner

### Counter App

Concepts:

- Variables
- DOM
- Events

---

### Calculator

Concepts:

- Functions
- Conditionals

---

### Todo App

Concepts:

- Arrays
- Objects
- Local Storage

---

## Intermediate

### Weather App

Concepts:

- Fetch API
- Async/Await
- JSON

---

### Expense Tracker

Concepts:

- CRUD
- DOM
- Storage

---

### Quiz App

Concepts:

- Timers
- Arrays
- Events

---

## Advanced

### Chat App

Concepts:

- WebSockets
- Authentication
- Real Time Updates

---

### Kanban Board

Concepts:

- Drag and Drop
- State Management

---

### Collaborative Whiteboard

Concepts:

- Canvas
- WebSockets
- Real Time Collaboration

---

### AI Website Builder

Concepts:

- LLM APIs
- Dynamic Components
- Code Generation`,
}

type QuizQuestion = {
  question: string
  options: string[]
  answer: number
  explanation: string
}

type TopicQuiz = {
  topicTitle: string
  questions: QuizQuestion[]
}

const quizzes: TopicQuiz[] = [
  {
    topicTitle: 'Introduction to JavaScript',
    questions: [
      {
        question: 'Which engine does Chrome use to execute JavaScript?',
        options: ['SpiderMonkey', 'V8', 'JavaScriptCore', 'Chakra'],
        answer: 1,
        explanation: 'Chrome uses the V8 JavaScript engine developed by Google.',
      },
      {
        question: 'JavaScript is single-threaded. What does that mean?',
        options: ['It can only run on one CPU core', 'It executes one command at a time on the main call stack', 'It cannot handle async operations', 'It runs only in one browser tab'],
        answer: 1,
        explanation: 'Single-threaded means JavaScript executes one command at a time on the main call stack, though async APIs allow concurrency.',
      },
      {
        question: 'What is the correct order of JavaScript code execution stages?',
        options: ['Execution → AST → Parser → Machine Code', 'Parser → AST → Compiler → Machine Code → Execution', 'Compiler → Parser → AST → Execution', 'AST → Parser → Execution → Machine Code'],
        answer: 1,
        explanation: 'Source code is parsed into an AST, compiled to machine code, then executed.',
      },
      {
        question: 'Which of the following is NOT a feature of JavaScript?',
        options: ['Dynamic typing', 'Single-threaded', 'Static compilation before execution', 'Event-driven'],
        answer: 2,
        explanation: 'JavaScript is interpreted/JIT-compiled, not statically compiled before execution.',
      },
      {
        question: 'What role does JavaScript play in a web page alongside HTML and CSS?',
        options: ['Structure', 'Styling', 'Behavior', 'Database'],
        answer: 2,
        explanation: 'HTML provides structure, CSS provides styling, and JavaScript provides behavior and interactivity.',
      },
    ],
  },
  {
    topicTitle: 'Variables (var, let, const)',
    questions: [
      {
        question: 'What is the output of: console.log(a); var a = 10;',
        options: ['10', 'undefined', 'ReferenceError', 'null'],
        answer: 1,
        explanation: 'var is hoisted and initialized as undefined, so the log runs before the assignment.',
      },
      {
        question: 'Which keyword prevents both reassignment and redeclaration?',
        options: ['var', 'let', 'const', 'static'],
        answer: 2,
        explanation: 'const cannot be reassigned or redeclared after initialization.',
      },
      {
        question: 'What happens when you try: const obj = {a:1}; obj.a = 2;',
        options: ['TypeError', 'The value changes successfully', 'SyntaxError', 'The object is frozen'],
        answer: 1,
        explanation: 'const prevents reassignment of the variable, but object properties can still be mutated.',
      },
      {
        question: 'let x = 1; let x = 2; What is the result?',
        options: ['x becomes 2', 'SyntaxError', 'x becomes undefined', 'No error, x is 2'],
        answer: 1,
        explanation: 'let does not allow redeclaration in the same scope, so this throws a SyntaxError.',
      },
      {
        question: 'What is the scope of a variable declared with var inside a block?',
        options: ['Block scope', 'Function scope', 'Global scope only', 'Module scope'],
        answer: 1,
        explanation: 'var is function-scoped, meaning it is accessible throughout the function, not just the block.',
      },
    ],
  },
  {
    topicTitle: 'Data Types',
    questions: [
      {
        question: 'What does typeof null return?',
        options: ['"null"', '"undefined"', '"object"', '"boolean"'],
        answer: 2,
        explanation: 'typeof null returns "object" — this is a historical bug in JavaScript.',
      },
      {
        question: 'Which of the following is a primitive type?',
        options: ['Array', 'Object', 'Symbol', 'Function'],
        answer: 2,
        explanation: 'Symbol is a primitive type. Array, Object, and Function are reference types.',
      },
      {
        question: 'What happens when you assign an object to another variable?',
        options: ['A deep copy is created', 'A reference is shared', 'A new object is created', 'It throws an error'],
        answer: 1,
        explanation: 'Objects are reference types, so both variables point to the same object in memory.',
      },
      {
        question: 'What is the value of an uninitialized let variable?',
        options: ['null', '0', 'undefined', '""'],
        answer: 2,
        explanation: 'Variables declared with let that are not assigned have the value undefined.',
      },
      {
        question: 'Which data type would you use for a very large integer beyond Number.MAX_SAFE_INTEGER?',
        options: ['Number', 'String', 'BigInt', 'Float'],
        answer: 2,
        explanation: 'BigInt is designed for integers beyond the safe range of the Number type.',
      },
    ],
  },
  {
    topicTitle: 'Operators',
    questions: [
      {
        question: 'What does 5 === "5" evaluate to?',
        options: ['true', 'false', 'TypeError', 'undefined'],
        answer: 1,
        explanation: '=== checks both value and type. 5 is a number and "5" is a string, so it returns false.',
      },
      {
        question: 'What does: null ?? "default" return?',
        options: ['null', '"default"', 'undefined', 'TypeError'],
        answer: 1,
        explanation: 'The nullish coalescing operator ?? returns the right operand when the left is null or undefined.',
      },
      {
        question: 'What is the result of: 0 || "hello"?',
        options: ['0', '"hello"', 'false', 'true'],
        answer: 1,
        explanation: '0 is falsy, so || returns the right operand "hello".',
      },
      {
        question: 'What does: false ?? "fallback" return?',
        options: ['"fallback"', 'false', 'null', 'undefined'],
        answer: 1,
        explanation: '?? only triggers for null or undefined. false is a valid value, so it returns false.',
      },
      {
        question: 'Which operator has higher precedence: && or ||?',
        options: ['||', '&&', 'Same precedence', 'Depends on operands'],
        answer: 1,
        explanation: '&& has higher precedence than ||, so it binds tighter in expressions.',
      },
    ],
  },
  {
    topicTitle: 'Conditionals',
    questions: [
      {
        question: 'What happens if you forget break in a switch case?',
        options: ['Only that case runs', 'Execution falls through to the next case', 'SyntaxError', 'The switch exits immediately'],
        answer: 1,
        explanation: 'Without break, execution falls through to subsequent cases (fall-through behavior).',
      },
      {
        question: 'What does: let x = false ? "a" : "b" evaluate to?',
        options: ['"a"', '"b"', 'false', 'undefined'],
        answer: 1,
        explanation: 'The ternary operator returns the second operand when the condition is false.',
      },
      {
        question: 'Which is a valid guard clause pattern?',
        options: ['if (!valid) { process() }', 'if (!valid) return; process()', 'while (!valid) process()', 'for (!valid; ; ) process()'],
        answer: 1,
        explanation: 'A guard clause returns early when a condition is not met, keeping the rest of the function flat.',
      },
      {
        question: 'Can a switch case use === comparison?',
        options: ['No, it always uses ==', 'Yes, switch uses strict comparison by default', 'Only with a special flag', 'Only for string cases'],
        answer: 1,
        explanation: 'Switch uses strict comparison (===) by default when matching case values.',
      },
      {
        question: 'What is the result of: if (0) { console.log("yes") } else { console.log("no") }?',
        options: ['"yes"', '"no"', 'TypeError', 'No output'],
        answer: 1,
        explanation: '0 is falsy in JavaScript, so the else branch runs.',
      },
    ],
  },
  {
    topicTitle: 'Loops',
    questions: [
      {
        question: 'What does "break" do inside a loop?',
        options: ['Skips the current iteration', 'Exits the loop immediately', 'Restarts the loop', 'Throws an error'],
        answer: 1,
        explanation: 'break terminates the loop and continues execution after it.',
      },
      {
        question: 'Which loop is best for iterating over array elements by value?',
        options: ['for (let i = 0; i < arr.length; i++)', 'for...of', 'for...in', 'while'],
        answer: 1,
        explanation: 'for...of iterates over iterable values (like array elements) cleanly and readably.',
      },
      {
        question: 'What does "continue" do inside a loop?',
        options: ['Exits the loop', 'Skips the rest of the current iteration and moves to the next', 'Restarts from the first iteration', 'Pauses the loop'],
        answer: 1,
        explanation: 'continue skips the remaining code in the current iteration and proceeds to the next one.',
      },
      {
        question: 'What does for...in iterate over on an array?',
        options: ['Array values', 'Array indices as strings', 'Array length', 'Array methods'],
        answer: 1,
        explanation: 'for...in iterates over enumerable property names (indices as strings), which can cause issues with arrays.',
      },
      {
        question: 'What is the output of: for (let i = 0; i < 3; i++) { if (i === 1) continue; console.log(i); }?',
        options: ['0 1 2', '0 2', '1', '0 1'],
        answer: 1,
        explanation: 'When i is 1, continue skips the log, so only 0 and 2 are printed.',
      },
    ],
  },
  {
    topicTitle: 'Functions',
    questions: [
      {
        question: 'What does an arrow function without curly braces return?',
        options: ['undefined', 'The expression result implicitly', 'null', 'SyntaxError'],
        answer: 1,
        explanation: 'Arrow functions with a single expression implicitly return that expression\'s result.',
      },
      {
        question: 'What is a first-class function?',
        options: ['A function defined at the top of the file', 'A function that can be assigned to variables, passed as arguments, and returned', 'A function that runs first in execution', 'A function with no parameters'],
        answer: 1,
        explanation: 'First-class means functions are treated as values — they can be stored, passed, and returned.',
      },
      {
        question: 'What is the difference between a function declaration and a function expression?',
        options: ['No difference', 'Declarations are hoisted entirely; expressions are not', 'Expressions run faster', 'Declarations cannot take parameters'],
        answer: 1,
        explanation: 'Function declarations are fully hoisted (name + body), while expressions are only hoisted as variables.',
      },
      {
        question: 'What does a function without a return statement return?',
        options: ['null', '0', 'undefined', 'SyntaxError'],
        answer: 2,
        explanation: 'A function without an explicit return statement returns undefined.',
      },
      {
        question: 'What is the output of: const f = () => {}; console.log(f());?',
        options: ['null', 'undefined', '""', 'TypeError'],
        answer: 1,
        explanation: 'An arrow function with curly braces and no return returns undefined.',
      },
    ],
  },
  {
    topicTitle: 'Scope',
    questions: [
      {
        question: 'A variable declared with let inside an if block is accessible where?',
        options: ['Everywhere in the function', 'Only inside that if block', 'Everywhere in the file', 'Only after the block'],
        answer: 1,
        explanation: 'let is block-scoped, so it is only accessible within the if block where it was declared.',
      },
      {
        question: 'What is lexical scope?',
        options: ['Scope determined at runtime', 'Scope determined by where the function is written in the code', 'Scope that changes based on caller', 'Global-only scope'],
        answer: 1,
        explanation: 'Lexical scope means the scope is determined by where functions and variables are declared in the source code.',
      },
      {
        question: 'Can an inner function access variables from its outer function?',
        options: ['No', 'Yes, through lexical scope', 'Only if they are global', 'Only with the this keyword'],
        answer: 1,
        explanation: 'Inner functions can access outer function variables through lexical scope (closure).',
      },
      {
        question: 'What happens when you try to access a let variable before its declaration?',
        options: ['It returns undefined', 'ReferenceError due to the Temporal Dead Zone', 'It returns null', 'It works normally'],
        answer: 1,
        explanation: 'Accessing a let variable before its declaration throws a ReferenceError because of the Temporal Dead Zone.',
      },
      {
        question: 'What is scope chaining?',
        options: ['A loop that creates scopes', 'The process of the engine looking up variables through nested scopes', 'A method on the scope object', 'Chaining .scope() calls'],
        answer: 1,
        explanation: 'Scope chaining is how the engine resolves variables by looking from the innermost scope outward.',
      },
    ],
  },
  {
    topicTitle: 'Hoisting',
    questions: [
      {
        question: 'What is hoisted first: function declarations or variables?',
        options: ['Variables', 'Function declarations', 'They are hoisted simultaneously', 'Neither is hoisted'],
        answer: 1,
        explanation: 'Function declarations are hoisted before variable declarations during the creation phase.',
      },
      {
        question: 'What is the Temporal Dead Zone?',
        options: ['The time a function takes to execute', 'The period between entering a scope and the declaration of a let/const variable', 'When a variable is set to undefined', 'When a function is removed from memory'],
        answer: 1,
        explanation: 'The TDZ is the period from the start of a block to the line where a let/const variable is declared.',
      },
      {
        question: 'What does console.log(foo) print if: var foo = 10; is below it?',
        options: ['10', 'undefined', 'ReferenceError', 'null'],
        answer: 1,
        explanation: 'var is hoisted and initialized as undefined, so the log prints undefined before the assignment.',
      },
      {
        question: 'Are function expressions hoisted?',
        options: ['Yes, completely', 'Only the variable name is hoisted, not the function body', 'No, not at all', 'Only if they use the function keyword'],
        answer: 1,
        explanation: 'With var, only the variable name is hoisted (as undefined), not the function body.',
      },
      {
        question: 'Can you call a function declaration before its line in code?',
        options: ['No, it will throw a ReferenceError', 'Yes, because function declarations are fully hoisted', 'Only inside a module', 'Only in strict mode'],
        answer: 1,
        explanation: 'Function declarations are fully hoisted (name + body), so they can be called before their position in code.',
      },
    ],
  },
  {
    topicTitle: 'Arrays',
    questions: [
      {
        question: 'Which method creates a new array by transforming each element?',
        options: ['filter', 'reduce', 'map', 'forEach'],
        answer: 2,
        explanation: 'map transforms every element and returns a new array of the same length.',
      },
      {
        question: 'What does [1,2,3].reduce((acc, val) => acc + val, 0) return?',
        options: ['[1,2,3]', '6', '123', 'undefined'],
        answer: 1,
        explanation: 'reduce accumulates values: 0+1=1, 1+2=3, 3+3=6.',
      },
      {
        question: 'Does forEach return a new array?',
        options: ['Yes', 'No, it returns undefined', 'Only if you assign it', 'It returns the original array'],
        answer: 1,
        explanation: 'forEach executes a function for each element but returns undefined — it does not create a new array.',
      },
      {
        question: 'What does [1,2,3,4].filter(x => x > 2) return?',
        options: ['[1,2]', '[3,4]', 'true', '[2,3,4]'],
        answer: 1,
        explanation: 'filter keeps only elements where the callback returns true, so 3 and 4 remain.',
      },
      {
        question: 'Which method returns the first element that matches a condition?',
        options: ['filter', 'find', 'some', 'map'],
        answer: 1,
        explanation: 'find returns the first element that satisfies the testing function.',
      },
    ],
  },
  {
    topicTitle: 'Objects',
    questions: [
      {
        question: 'What does const { name } = user; do?',
        options: ['Creates a new object', 'Extracts the name property into a variable', 'Adds a name property', 'Deletes the name property'],
        answer: 1,
        explanation: 'Destructuring extracts the named property from the object into a local variable.',
      },
      {
        question: 'What does Object spread {...obj} create?',
        options: ['A deep clone', 'A shallow copy of the object', 'A reference to the same object', 'A frozen object'],
        answer: 1,
        explanation: 'The spread operator creates a shallow copy — top-level properties are copied, nested objects are still references.',
      },
      {
        question: 'How do you access a property with a dynamic key?',
        options: ['obj.dynamicKey', 'obj[dynamicKey]', 'obj->dynamicKey', 'obj{dynamicKey}'],
        answer: 1,
        explanation: 'Bracket notation obj[dynamicKey] allows accessing properties with variable or computed keys.',
      },
      {
        question: 'What happens when you assign an object to a new variable?',
        options: ['A deep copy is made', 'Both variables reference the same object', 'A new independent object is created', 'It throws an error'],
        answer: 1,
        explanation: 'Objects are reference types, so both variables point to the same object in memory.',
      },
      {
        question: 'What is the output of: const a = {x:1}; const b = a; b.x = 2; console.log(a.x);?',
        options: ['1', '2', 'undefined', 'TypeError'],
        answer: 1,
        explanation: 'Since a and b reference the same object, changing b.x also changes a.x to 2.',
      },
    ],
  },
  {
    topicTitle: 'DOM Manipulation',
    questions: [
      {
        question: 'Which method selects a single element by CSS selector?',
        options: ['getElementById', 'querySelector', 'querySelectorAll', 'getElementsByClassName'],
        answer: 1,
        explanation: 'querySelector returns the first element matching a CSS selector.',
      },
      {
        question: 'What does element.textContent = "Hello" do?',
        options: ['Sets the HTML content', 'Sets the plain text content', 'Appends text', 'Removes the element'],
        answer: 1,
        explanation: 'textContent sets or returns the plain text content, without interpreting HTML.',
      },
      {
        question: 'Which property adds or removes a CSS class safely?',
        options: ['element.style', 'element.class', 'element.classList', 'element.css'],
        answer: 2,
        explanation: 'classList provides add(), remove(), and toggle() methods for safe class manipulation.',
      },
      {
        question: 'What is the DOM?',
        options: ['A JavaScript framework', 'The browser\'s object representation of HTML that JavaScript can manipulate', 'A CSS preprocessor', 'A database for HTML'],
        answer: 1,
        explanation: 'The DOM (Document Object Model) is the browser\'s tree-structured representation of the HTML document.',
      },
      {
        question: 'What does document.createElement("div") do?',
        options: ['Selects an existing div', 'Creates a new div element in memory (not yet in the DOM)', 'Removes a div', 'Clones an existing div'],
        answer: 1,
        explanation: 'createElement creates a new element in memory. You must append it to the DOM to make it visible.',
      },
    ],
  },
  {
    topicTitle: 'Events',
    questions: [
      {
        question: 'What is event bubbling?',
        options: ['Events only trigger on the target element', 'Events propagate from the target element up to its ancestors', 'Events skip the target and fire on parents', 'Events fire in random order'],
        answer: 1,
        explanation: 'Bubbling means the event fires on the target first, then propagates upward through ancestor elements.',
      },
      {
        question: 'How do you stop event propagation?',
        options: ['event.stop()', 'event.stopPropagation()', 'event.cancel()', 'event.halt()'],
        answer: 1,
        explanation: 'stopPropagation() prevents the event from bubbling up to parent elements.',
      },
      {
        question: 'What does event.preventDefault() do?',
        options: ['Stops event bubbling', 'Prevents the browser\'s default action for the event', 'Removes the event listener', 'Reloads the page'],
        answer: 1,
        explanation: 'preventDefault() stops the default browser behavior (e.g., form submission, link navigation).',
      },
      {
        question: 'What is event delegation?',
        options: ['Assigning events to every child element', 'Attaching a single listener to a parent that handles events from its children', 'Removing all event listeners', 'Delegating events to another thread'],
        answer: 1,
        explanation: 'Event delegation uses a single listener on a parent to handle events from child elements via bubbling.',
      },
      {
        question: 'Which parameter of addEventListener makes the listener fire during the capture phase?',
        options: ['The first parameter', 'The third parameter (true or {capture: true})', 'The second parameter', 'There is no such option'],
        answer: 1,
        explanation: 'Passing true or {capture: true} as the third argument enables capture-phase listening.',
      },
    ],
  },
  {
    topicTitle: 'Closures',
    questions: [
      {
        question: 'What is a closure?',
        options: ['A function that has no return value', 'A function that remembers variables from its outer scope even after the outer function has returned', 'A function that closes the program', 'A method that deletes variables'],
        answer: 1,
        explanation: 'A closure is a function that retains access to its lexical scope even when executed outside that scope.',
      },
      {
        question: 'What does a counter function using closure return each time it is called?',
        options: ['0 always', 'An incrementing value each call', 'undefined', 'The function itself'],
        answer: 1,
        explanation: 'The inner function closes over the count variable, incrementing it on each call.',
      },
      {
        question: 'Why are closures useful for private state?',
        options: ['They make variables global', 'They encapsulate variables that cannot be accessed from outside', 'They slow down execution', 'They delete variables after use'],
        answer: 1,
        explanation: 'Closures allow creating variables that are only accessible through the returned inner function.',
      },
      {
        question: 'What happens to the outer variable in a closure after the outer function finishes?',
        options: ['It is garbage collected', 'It persists because the inner function still references it', 'It becomes undefined', 'It becomes global'],
        answer: 1,
        explanation: 'The variable persists in memory because the closure (inner function) maintains a reference to it.',
      },
      {
        question: 'What is the output of: function outer() { let x = 1; return function inner() { return x++; } } const fn = outer(); console.log(fn(), fn());?',
        options: ['1 1', '1 2', '0 1', 'undefined undefined'],
        answer: 1,
        explanation: 'The closure over x persists. First call returns 1 (then x becomes 2), second call returns 2.',
      },
    ],
  },
  {
    topicTitle: 'Execution Context',
    questions: [
      {
        question: 'What is created when a function is invoked?',
        options: ['A new global object', 'A new execution context with its own variable environment and scope chain', 'A new thread', 'A new DOM element'],
        answer: 1,
        explanation: 'Each function invocation creates a new execution context with its own variables, scope, and this binding.',
      },
      {
        question: 'What are the two phases of execution context?',
        options: ['Parse and Execute', 'Creation (memory creation) and Execution (code execution)', 'Compile and Run', 'Allocate and Deallocate'],
        answer: 1,
        explanation: 'The creation phase sets up variables and scope, the execution phase runs the code line by line.',
      },
      {
        question: 'What happens during the creation phase of an execution context?',
        options: ['Code is executed line by line', 'Variables are assigned their values', 'Memory is allocated for variables and functions, with var set to undefined', 'The function returns'],
        answer: 2,
        explanation: 'In the creation phase, memory is allocated: var variables are set to undefined, function declarations are stored.',
      },
      {
        question: 'What is the global execution context?',
        options: ['The context inside a function', 'The default context created for the entire script', 'A context only for modules', 'The context for async code'],
        answer: 1,
        explanation: 'The global execution context is created when the script starts and represents the top-level scope.',
      },
      {
        question: 'How are execution contexts managed by the engine?',
        options: ['In a queue', 'On the call stack (LIFO)', 'In a random order', 'In a circular buffer'],
        answer: 1,
        explanation: 'Execution contexts are pushed to and popped from the call stack in LIFO order.',
      },
    ],
  },
  {
    topicTitle: 'Call Stack',
    questions: [
      {
        question: 'What data structure does the call stack use?',
        options: ['Queue (FIFO)', 'Stack (LIFO)', 'Linked List', 'Tree'],
        answer: 1,
        explanation: 'The call stack uses LIFO — the last function pushed is the first one popped when it returns.',
      },
      {
        question: 'What causes a stack overflow?',
        options: ['Too many async callbacks', 'Too many nested function calls without returning (e.g., infinite recursion)', 'Too many event listeners', 'Memory leak'],
        answer: 1,
        explanation: 'A stack overflow occurs when recursive or deeply nested calls exceed the call stack limit.',
      },
      {
        question: 'What happens when a function returns?',
        options: ['Its frame stays on the stack', 'Its frame is popped off the stack', 'The entire stack is cleared', 'A new frame is created'],
        answer: 1,
        explanation: 'When a function returns, its execution context (stack frame) is popped off the call stack.',
      },
      {
        question: 'Which function is at the top of the call stack?',
        options: ['The first function called', 'The currently executing function', 'The main function', 'The last function that returned'],
        answer: 1,
        explanation: 'The top of the call stack always holds the currently executing function.',
      },
      {
        question: 'What is the bottom of the call stack in a browser?',
        options: ['The first user function', 'The global execution context', 'The DOM', 'The event loop'],
        answer: 1,
        explanation: 'The global execution context sits at the bottom of the call stack as the base frame.',
      },
    ],
  },
  {
    topicTitle: 'Web APIs',
    questions: [
      {
        question: 'Which of the following is a Web API, not part of the JS language itself?',
        options: ['Array.prototype.map', 'setTimeout', 'Promise', 'const'],
        answer: 1,
        explanation: 'setTimeout is provided by the browser/Node runtime, not the JavaScript language specification.',
      },
      {
        question: 'Where do Web API callbacks go after completion?',
        options: ['Directly to the call stack', 'To the callback queue (task queue)', 'To the microtask queue', 'Back to the Web API'],
        answer: 1,
        explanation: 'Completed Web API callbacks are placed in the callback (task) queue, waiting for the event loop.',
      },
      {
        question: 'What does fetch() return?',
        options: ['JSON data', 'A Promise that resolves to a Response object', 'An HTTP status code', 'The API response body'],
        answer: 1,
        explanation: 'fetch() returns a Promise that resolves with a Response object representing the HTTP response.',
      },
      {
        question: 'Can JavaScript access DOM directly from the call stack?',
        options: ['No, only through Web APIs', 'Yes, DOM is part of the JS language', 'Only in Node.js', 'Only in strict mode'],
        answer: 0,
        explanation: 'The DOM is provided by the browser as a Web API. JavaScript accesses it through these APIs.',
      },
      {
        question: 'What happens when setTimeout(callback, 0) is called?',
        options: ['The callback runs immediately', 'The callback is sent to Web APIs, then queued in the callback queue', 'The callback goes to the microtask queue', 'The callback runs before synchronous code'],
        answer: 1,
        explanation: 'Even with 0ms delay, the callback goes through Web APIs and then the callback queue before execution.',
      },
    ],
  },
  {
    topicTitle: 'Callback Queue',
    questions: [
      {
        question: 'Why does setTimeout(0) not execute immediately?',
        options: ['Because 0 is not a valid delay', 'Because the callback must go through the callback queue and wait for the call stack to empty', 'Because setTimeout is synchronous', 'Because the event loop ignores 0ms timers'],
        answer: 1,
        explanation: 'Even with 0ms delay, the callback enters the callback queue and must wait for the call stack to clear.',
      },
      {
        question: 'Which of these is NOT a macrotask (callback queue) source?',
        options: ['setTimeout', 'Promise.then', 'setInterval', 'DOM event handler'],
        answer: 1,
        explanation: 'Promise.then callbacks are microtasks, not macrotasks. They go to the microtask queue.',
      },
      {
        question: 'How many callback queue tasks does the event loop process per iteration?',
        options: ['All pending tasks', 'One task', 'Two tasks', 'Until the queue is empty'],
        answer: 1,
        explanation: 'The event loop picks one task from the callback queue per loop iteration, then rechecks microtasks.',
      },
      {
        question: 'What is the correct order: sync code, microtasks, or callback tasks?',
        options: ['Callback tasks, microtasks, sync code', 'Sync code, callback tasks, microtasks', 'Sync code, microtasks, callback tasks', 'Microtasks, sync code, callback tasks'],
        answer: 2,
        explanation: 'Synchronous code runs first, then all microtasks drain, then one callback queue task runs.',
      },
      {
        question: 'What happens if a macrotask schedules another macrotask?',
        options: ['It runs in the same iteration', 'It goes to the back of the callback queue for a future iteration', 'It runs immediately after', 'It replaces the current task'],
        answer: 1,
        explanation: 'Newly scheduled macrotasks are placed at the end of the callback queue for a future event loop iteration.',
      },
    ],
  },
  {
    topicTitle: 'Microtask Queue',
    questions: [
      {
        question: 'Which of the following creates a microtask?',
        options: ['setTimeout', 'Promise.then', 'setInterval', 'addEventListener'],
        answer: 1,
        explanation: 'Promise.then, .catch, and .finally callbacks are microtasks.',
      },
      {
        question: 'When are microtasks executed?',
        options: ['Before synchronous code', 'After the call stack clears but before the next callback queue task', 'After callback queue tasks', 'At the same time as macrotasks'],
        answer: 1,
        explanation: 'Microtasks drain completely after the call stack empties and before the next macrotask is picked.',
      },
      {
        question: 'What happens if a microtask queues another microtask?',
        options: ['It is deferred to the next loop iteration', 'It runs in the same microtask drain cycle before the next macrotask', 'It causes a stack overflow', 'It is ignored'],
        answer: 1,
        explanation: 'Newly queued microtasks during a microtask drain are also executed before moving to macrotasks.',
      },
      {
        question: 'What is the output order: console.log(1); Promise.resolve().then(() => console.log(2)); console.log(3);?',
        options: ['1, 2, 3', '1, 3, 2', '2, 1, 3', '3, 1, 2'],
        answer: 1,
        explanation: 'Sync logs 1 and 3 first, then the microtask logs 2 after the stack clears.',
      },
      {
        question: 'Can too many microtasks delay rendering and timers?',
        options: ['No', 'Yes, because microtasks drain completely before the next macrotask or render', 'Only in Node.js', 'Only if they throw errors'],
        answer: 1,
        explanation: 'Since microtasks drain fully before macrotasks and rendering, excessive microtasks can cause delays.',
      },
    ],
  },
  {
    topicTitle: 'Event Loop',
    questions: [
      {
        question: 'What does the event loop continuously monitor?',
        options: ['Only the call stack', 'The call stack, microtask queue, and callback queue', 'Only the callback queue', 'Only the microtask queue'],
        answer: 1,
        explanation: 'The event loop checks the call stack and both queues to decide what to execute next.',
      },
      {
        question: 'What is the correct event loop cycle order?',
        options: ['Run macrotask, run microtasks, execute stack', 'Execute stack, drain all microtasks, run one macrotask, repeat', 'Run microtasks, run macrotask, execute stack', 'Execute stack, run one macrotask, drain microtasks'],
        answer: 1,
        explanation: 'The correct cycle: execute sync code, drain ALL microtasks, run ONE macrotask, repeat.',
      },
      {
        question: 'What is the output: console.log(1); setTimeout(()=>console.log(2),0); Promise.resolve().then(()=>console.log(3)); console.log(4);?',
        options: ['1, 2, 3, 4', '1, 4, 3, 2', '1, 3, 4, 2', '1, 4, 2, 3'],
        answer: 1,
        explanation: 'Sync: 1,4. Then microtask: 3. Then macrotask: 2.',
      },
      {
        question: 'What would happen without the event loop?',
        options: ['JavaScript would run faster', 'Async operations like setTimeout, fetch, and Promises would never execute their callbacks', 'The call stack would be larger', 'Nothing would change'],
        answer: 1,
        explanation: 'Without the event loop, there would be no mechanism to move completed async callbacks onto the call stack.',
      },
      {
        question: 'Does the event loop run in a separate thread?',
        options: ['Yes, it is a background thread', 'No, it is part of the same single thread that runs JavaScript', 'It runs on the GPU', 'It runs only in Web Workers'],
        answer: 1,
        explanation: 'The event loop runs on the same single thread as JavaScript — it is not a separate thread.',
      },
    ],
  },
  {
    topicTitle: 'Promises',
    questions: [
      {
        question: 'What are the three states of a Promise?',
        options: ['Open, Closed, Error', 'Pending, Fulfilled, Rejected', 'Running, Done, Failed', 'Created, Resolved, Destroyed'],
        answer: 1,
        explanation: 'A Promise starts as Pending, then transitions to either Fulfilled (resolved) or Rejected.',
      },
      {
        question: 'Which queue do Promise.then callbacks enter?',
        options: ['Callback queue (macrotask)', 'Microtask queue', 'Call stack directly', 'Web API'],
        answer: 1,
        explanation: 'Promise.then, .catch, and .finally callbacks are microtasks.',
      },
      {
        question: 'What is promise chaining?',
        options: ['Calling multiple promises in parallel', 'Returning a promise from .then to continue sequentially', 'Catching all errors at once', 'Creating promises inside promises'],
        answer: 1,
        explanation: 'Chaining works by returning a value or promise from .then, which creates a new promise for the next .then.',
      },
      {
        question: 'What does Promise.all do if one promise rejects?',
        options: ['It resolves with the successful ones', 'It immediately rejects with the first rejection', 'It waits for all to settle', 'It retries the rejected one'],
        answer: 1,
        explanation: 'Promise.all rejects immediately when any input promise rejects (fail-fast behavior).',
      },
      {
        question: 'What is the output of: Promise.resolve(1).then(v => v + 1).then(v => console.log(v));?',
        options: ['1', '2', 'undefined', 'TypeError'],
        answer: 1,
        explanation: 'The first then returns 2 (1+1), which becomes the resolved value for the next then, logging 2.',
      },
    ],
  },
  {
    topicTitle: 'Async/Await',
    questions: [
      {
        question: 'What does an async function always return?',
        options: ['undefined', 'A Promise', 'A string', 'An object'],
        answer: 1,
        explanation: 'An async function always wraps its return value in a Promise.',
      },
      {
        question: 'What does await do internally?',
        options: ['Blocks the entire thread', 'Pauses the async function and yields control, equivalent to .then behind the scenes', 'Creates a new thread', 'Cancels the promise'],
        answer: 1,
        explanation: 'await suspends the async function and resumes it when the promise settles — like .then but with synchronous-looking syntax.',
      },
      {
        question: 'How do you handle errors in async/await?',
        options: ['Using .catch on the function', 'Using try/catch around the await', 'Using if/else', 'Errors cannot be caught'],
        answer: 1,
        explanation: 'Wrap await calls in try/catch blocks to handle rejected promises.',
      },
      {
        question: 'What is the output of: async function f() { return 42 } console.log(typeof f());?',
        options: ['"number"', '"object"', '"promise"', '"undefined"'],
        answer: 2,
        explanation: 'Async functions always return a Promise, so typeof f() returns "object" (since promises are objects), but the closest correct answer is that it returns a promise.',
      },
      {
        question: 'Can you use await at the top level of a regular script?',
        options: ['Yes, always', 'Only inside async functions or at the top level of ES modules', 'Only in Node.js', 'Never'],
        answer: 1,
        explanation: 'Top-level await is only allowed in ES modules. In regular scripts, await must be inside an async function.',
      },
    ],
  },
  {
    topicTitle: 'Fetch API',
    questions: [
      {
        question: 'What does fetch() return?',
        options: ['JSON data directly', 'A Promise that resolves to a Response object', 'The response body as a string', 'An XMLHttpRequest object'],
        answer: 1,
        explanation: 'fetch() returns a Promise that resolves with a Response object, not the data directly.',
      },
      {
        question: 'How do you check if an HTTP request was successful with fetch?',
        options: ['Checking if the promise rejects', 'Checking response.ok or response.status', 'Checking response.data', 'Using try/catch only'],
        answer: 1,
        explanation: 'fetch only rejects on network errors. For HTTP errors, check response.ok (boolean) or response.status.',
      },
      {
        question: 'What does response.json() return?',
        options: ['A JavaScript object directly', 'A Promise that resolves to the parsed JSON', 'A string', 'An array'],
        answer: 1,
        explanation: 'response.json() is async and returns a Promise that resolves to the parsed JavaScript value.',
      },
      {
        question: 'Does fetch reject on 404 or 500 HTTP status codes?',
        options: ['Yes', 'No, it only rejects on network failures', 'Only on 500', 'Only on 404'],
        answer: 1,
        explanation: 'fetch does not reject on HTTP error statuses — it resolves. You must check response.ok or status manually.',
      },
      {
        question: 'How do you make a POST request with fetch?',
        options: ['fetch.post(url, body)', 'fetch(url, { method: "POST", body: ... })', 'fetch(url, body, "POST")', 'fetch.post(url)'],
        answer: 1,
        explanation: 'Pass a second argument object with method, headers, and body to configure the request.',
      },
    ],
  },
  {
    topicTitle: 'ES6+',
    questions: [
      {
        question: 'What does the spread operator [...arr] create?',
        options: ['A reference to the same array', 'A shallow copy of the array', 'A deep clone', 'A string representation'],
        answer: 1,
        explanation: 'The spread operator creates a shallow copy of the array with new top-level references.',
      },
      {
        question: 'What does optional chaining user?.address?.city return if address is undefined?',
        options: ['TypeError', 'undefined', 'null', '""'],
        answer: 1,
        explanation: 'Optional chaining short-circuits and returns undefined when it encounters null or undefined.',
      },
      {
        question: 'What is the difference between rest and spread?',
        options: ['No difference', 'Rest collects elements into an array; spread expands an iterable', 'Rest is for objects; spread is for arrays', 'Spread is older syntax'],
        answer: 1,
        explanation: 'Rest (...args) collects remaining items into an array. Spread (...arr) expands an iterable into individual elements.',
      },
      {
        question: 'What does null ?? "default" return?',
        options: ['null', '"default"', 'undefined', 'TypeError'],
        answer: 1,
        explanation: 'The nullish coalescing operator ?? returns the right side when the left is null or undefined.',
      },
      {
        question: 'What does destructuring const {a, b} = obj; do?',
        options: ['Creates a new object', 'Extracts properties a and b as variables', 'Deletes properties a and b from obj', 'Merges a and b'],
        answer: 1,
        explanation: 'Destructuring extracts named properties from an object into standalone variables.',
      },
    ],
  },
  {
    topicTitle: 'Modules',
    questions: [
      {
        question: 'What does a named export look like?',
        options: ['export default function', 'export const name = "value"', 'module.export = name', 'exports.name'],
        answer: 1,
        explanation: 'Named exports use the export keyword directly before declarations.',
      },
      {
        question: 'How do you import a default export?',
        options: ['import { name } from "./file"', 'import name from "./file"', 'require("./file")', 'import * as name from "./file"'],
        answer: 1,
        explanation: 'Default exports are imported without curly braces: import name from "./file".',
      },
      {
        question: 'Can you have multiple named exports in one file?',
        options: ['No, only one per file', 'Yes, as many as needed', 'Only up to 10', 'Only in Node.js'],
        answer: 1,
        explanation: 'A module can have any number of named exports, but only one default export.',
      },
      {
        question: 'What is the benefit of modules?',
        options: ['They make code run faster', 'They make dependencies explicit and code reusable and maintainable', 'They reduce file size', 'They enable multithreading'],
        answer: 1,
        explanation: 'Modules make dependencies explicit, support encapsulation, and improve maintainability.',
      },
      {
        question: 'How many default exports can a module have?',
        options: ['Unlimited', 'One', 'Two', 'None'],
        answer: 1,
        explanation: 'A module can have at most one default export.',
      },
    ],
  },
  {
    topicTitle: 'OOP',
    questions: [
      {
        question: 'What does the constructor method do in a class?',
        options: ['Destroys the object', 'Initializes a new instance with properties', 'Creates a static method', 'Defines a getter'],
        answer: 1,
        explanation: 'The constructor is called when creating a new instance with new, initializing its properties.',
      },
      {
        question: 'What does extends do?',
        options: ['Creates a new file', 'Sets up inheritance between classes', 'Adds a static method', 'Exports a class'],
        answer: 1,
        explanation: 'extends creates a parent-child relationship where the child class inherits from the parent.',
      },
      {
        question: 'What does the # prefix mean on a class field?',
        options: ['It is a comment', 'It marks the field as private (encapsulation)', 'It makes the field static', 'It is a typo'],
        answer: 1,
        explanation: 'The # prefix makes a class field truly private — it cannot be accessed outside the class body.',
      },
      {
        question: 'What is polymorphism?',
        options: ['Having multiple constructors', 'A subclass providing its own implementation of a method defined in the parent', 'Using multiple classes in one file', 'Having multiple default exports'],
        answer: 1,
        explanation: 'Polymorphism allows a subclass to override a parent method with its own specific behavior.',
      },
      {
        question: 'What is the prototype chain?',
        options: ['A linked list of arrays', 'The chain of objects JavaScript follows to look up properties and methods', 'A way to chain method calls', 'A design pattern for modules'],
        answer: 1,
        explanation: 'Objects delegate property lookups through their prototype chain until the property is found or null is reached.',
      },
    ],
  },
  {
    topicTitle: 'Projects',
    questions: [
      {
        question: 'Which concepts are essential for building a Counter App?',
        options: ['Fetch API and Promises', 'Variables, DOM manipulation, and Events', 'Classes and Inheritance', 'Modules and Exports'],
        answer: 1,
        explanation: 'A counter needs variables for state, DOM to display the count, and events to handle button clicks.',
      },
      {
        question: 'What makes async/await necessary in a Weather App?',
        options: ['Nothing, it can be synchronous', 'Fetching data from an external API is asynchronous', 'DOM updates require await', 'Event listeners are async'],
        answer: 1,
        explanation: 'API calls with fetch are asynchronous, so async/await is needed to handle the response.',
      },
      {
        question: 'Which storage mechanism is commonly used in a Todo App?',
        options: ['SessionStorage', 'LocalStorage', 'Cookies', 'IndexedDB'],
        answer: 1,
        explanation: 'LocalStorage persists data in the browser and is commonly used for simple app data like todos.',
      },
      {
        question: 'What is a key challenge in building a Chat App?',
        options: ['CSS styling', 'Real-time bidirectional communication (e.g., WebSockets)', 'Using let instead of var', 'File organization'],
        answer: 1,
        explanation: 'Chat apps require real-time communication, typically implemented with WebSockets.',
      },
      {
        question: 'Which concept is critical for a Kanban Board?',
        options: ['Drag and Drop interaction', 'HTTP requests', 'Promises', 'Variable hoisting'],
        answer: 0,
        explanation: 'A Kanban Board relies heavily on drag and drop for moving tasks between columns.',
      },
    ],
  },
]

const scenarios: TraceScenario[] = [
  {
    title: 'setTimeout vs Promise',
    code: `console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
console.log("D");`,
    steps: [
      {
        label: 'Start global script',
        stack: ['global()'],
        microtasks: [],
        tasks: [],
        console: [],
      },
      {
        label: 'Run console.log("A")',
        stack: ['console.log("A")', 'global()'],
        microtasks: [],
        tasks: [],
        console: ['A'],
      },
      {
        label: 'Register timer in Web APIs',
        stack: ['setTimeout()', 'global()'],
        microtasks: [],
        tasks: ['timer callback: log B'],
        console: ['A'],
      },
      {
        label: 'Resolve promise and queue then callback',
        stack: ['Promise.then()', 'global()'],
        microtasks: ['promise callback: log C'],
        tasks: ['timer callback: log B'],
        console: ['A'],
      },
      {
        label: 'Run console.log("D")',
        stack: ['console.log("D")', 'global()'],
        microtasks: ['promise callback: log C'],
        tasks: ['timer callback: log B'],
        console: ['A', 'D'],
      },
      {
        label: 'Global script finishes',
        stack: [],
        microtasks: ['promise callback: log C'],
        tasks: ['timer callback: log B'],
        console: ['A', 'D'],
      },
      {
        label: 'Drain microtask queue',
        stack: ['promise callback: log C'],
        microtasks: [],
        tasks: ['timer callback: log B'],
        console: ['A', 'D', 'C'],
      },
      {
        label: 'Run next task',
        stack: ['timer callback: log B'],
        microtasks: [],
        tasks: [],
        console: ['A', 'D', 'C', 'B'],
      },
    ],
  },
  {
    title: 'async await',
    code: `async function run() {
  console.log("start");
  await Promise.resolve();
  console.log("after await");
}
run();
console.log("outside");`,
    steps: [
      {
        label: 'Call run()',
        stack: ['run()', 'global()'],
        microtasks: [],
        tasks: [],
        console: [],
      },
      {
        label: 'Log start',
        stack: ['console.log("start")', 'run()', 'global()'],
        microtasks: [],
        tasks: [],
        console: ['start'],
      },
      {
        label: 'await pauses run and queues continuation',
        stack: ['run()', 'global()'],
        microtasks: ['resume run() after await'],
        tasks: [],
        console: ['start'],
      },
      {
        label: 'Global code continues',
        stack: ['console.log("outside")', 'global()'],
        microtasks: ['resume run() after await'],
        tasks: [],
        console: ['start', 'outside'],
      },
      {
        label: 'Microtask resumes async function',
        stack: ['resume run() after await'],
        microtasks: [],
        tasks: [],
        console: ['start', 'outside', 'after await'],
      },
    ],
  },
]

const javascriptEditorDefault = `for(let i = 0; i < 5; i++){
  console.log(i);
}`
const javascriptEditorStorageKey = 'learnjs.editor.javascript'

function readStoredEditorValue(key: string, fallback: string) {
  if (typeof window === 'undefined') return fallback
  const storedValue = window.localStorage.getItem(key)
  return storedValue ?? fallback
}

function formatOutputValue(value: unknown) {
  if (typeof value === 'string') return value
  if (typeof value === 'undefined') return 'undefined'
  if (value instanceof Error) return value.stack || value.message

  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}

function formatRuntimeError(error: unknown) {
  if (error instanceof Error) return error.stack || error.message
  return String(error)
}

function App() {
  const [page, setPage] = useState<Page>(() => getRouteFromHash())
  const [selectedTopic, setSelectedTopic] = useState(topics[0])
  const [scenarioIndex, setScenarioIndex] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(700)

  const currentScenario = scenarios[scenarioIndex]
  const currentStep = currentScenario.steps[stepIndex]
  const levelCounts = useMemo(
    () =>
      topics.reduce<Record<string, number>>((counts, topic) => {
        counts[topic.level] = (counts[topic.level] ?? 0) + 1
        return counts
      }, {}),
    [],
  )

  useEffect(() => {
    const syncRoute = () => setPage(getRouteFromHash())

    window.addEventListener('hashchange', syncRoute)
    return () => window.removeEventListener('hashchange', syncRoute)
  }, [])


  useEffect(() => {
    if (!isPlaying) return

    const timer = window.setInterval(() => {
      setStepIndex((current) => {
        if (current >= currentScenario.steps.length - 1) {
          setIsPlaying(false)
          return current
        }

        return current + 1
      })
    }, speed)

    return () => window.clearInterval(timer)
  }, [currentScenario.steps.length, isPlaying, speed])

  const openTopic = (topic: Topic) => {
    setSelectedTopic(topic)
    setPage('topics')
    window.location.hash = '/topics'
    window.setTimeout(() => {
      document.getElementById('topic-detail')?.scrollIntoView({ behavior: 'smooth' })
    }, 0)
  }


  const selectScenario = (index: number) => {
    setScenarioIndex(index)
    setStepIndex(0)
    setIsPlaying(false)
  }

  const stepForward = () => {
    setIsPlaying(false)
    setStepIndex((current) => Math.min(current + 1, currentScenario.steps.length - 1))
  }

  const resetTrace = () => {
    setIsPlaying(false)
    setStepIndex(0)
  }

  return (
    <main className="app-shell">
      <header className="site-header">
        <nav className="nav-wrap" aria-label="Primary navigation">
          <a className="brand" href="#/home" aria-label="LearnJS home">
            <span className="brand-mark">JS</span>
            <span>LearnJS</span>
          </a>

          <div className="nav-links">
            <NavLink page={page} target="home" label="Home" />
            <NavLink page={page} target="roadmap" label="Roadmap" />
            <NavLink page={page} target="topics" label="Topics" />
            <NavLink page={page} target="quizzes" label="Quizzes" />
            <NavLink page={page} target="editor" label="Editor" />
            <NavLink page={page} target="visualizer" label="Visualizer" />
          </div>
        </nav>
      </header>

      {page === 'home' && (
        <HomePage
          beginnerCount={levelCounts.Beginner}
          topicCount={topics.length}
        />
      )}

      {page === 'roadmap' && <RoadmapPage openTopic={openTopic} />}

      {page === 'topics' && (
        <TopicsPage selectedTopic={selectedTopic} openTopic={openTopic} />
      )}

      {page === 'quizzes' && <QuizzesPage />}

      {page === 'editor' && <EditorPage />}

      {page === 'visualizer' && (
        <VisualizerPage
          currentScenario={currentScenario}
          currentStep={currentStep}
          isPlaying={isPlaying}
          resetTrace={resetTrace}
          scenarioIndex={scenarioIndex}
          selectScenario={selectScenario}
          setIsPlaying={setIsPlaying}
          setSpeed={setSpeed}
          speed={speed}
          stepForward={stepForward}
          stepIndex={stepIndex}
        />
      )}
    </main>
  )
}

function getRouteFromHash(): Page {
  const route = window.location.hash.replace('#/', '').replace('#', '')
  const allowed: Page[] = ['home', 'roadmap', 'topics', 'quizzes', 'editor', 'visualizer']

  return allowed.includes(route as Page) ? (route as Page) : 'home'
}

function NavLink({ page, target, label }: { page: Page; target: Page; label: string }) {
  return (
    <a className={page === target ? 'active' : ''} href={`#/${target}`}>
      {label}
    </a>
  )
}

function HomePage({
  beginnerCount,
  topicCount,
}: {
  beginnerCount: number
  topicCount: number
}) {
  return (
    <section className="hero-section page-view" id="home">
      <div className="hero-panel">
        <div className="hero-copy">
          <p className="browser-pill">
            <span aria-hidden="true"></span>
            No sign-up - 100% in your browser
          </p>

          <h1>
            Learn JavaScript the way it actually{' '}
            <span className="accent-word">runs</span>.
          </h1>

          <p className="hero-description">
            Topic-wise documentation, hands-on quizzes, a live code editor, and
            a runtime visualizer that shows the call stack, microtask and task
            queues in motion.
          </p>

          <div className="hero-actions">
            <a className="button primary-button" href="#/roadmap">
              Start learning
            </a>
            <a className="button ghost-button" href="#/visualizer">
              Open visualizer
            </a>
          </div>
        </div>
      </div>

      <div className="home-summary">
        <div className="summary-copy">
          <span className="section-kicker">Learning workspace</span>
          <h2>Everything you need after the first concept.</h2>
          <p>
            Move from notes to practice without leaving the platform. Follow the
            roadmap, open a topic, run code, then inspect what the runtime does.
          </p>
          <div className="summary-actions">
            <a href="#/roadmap">Open roadmap</a>
            <a href="#/topics">Browse topics</a>
          </div>
        </div>

        <div className="summary-board" aria-label="Platform overview">
          <div className="metric-card primary-metric">
            <span>{topicCount}</span>
            <p>Topic docs</p>
          </div>
          <div className="metric-card">
            <span>{beginnerCount}</span>
            <p>Beginner lessons</p>
          </div>
          <a className="workflow-card" href="#/editor">
            <span>01</span>
            <strong>Practice in editor</strong>
            <p>Write JavaScript and see console output instantly.</p>
          </a>
          <a className="workflow-card" href="#/visualizer">
            <span>02</span>
            <strong>Trace the runtime</strong>
            <p>Step through stack, microtasks, and task queue behavior.</p>
          </a>
        </div>
      </div>
    </section>
  )
}

function RoadmapPage({ openTopic }: { openTopic: (topic: Topic) => void }) {
  const completedCount = 0

  return (
    <section className="roadmap-section page-section page-view" id="roadmap">
      <div className="roadmap-header">
        <div>
          <h2>JavaScript roadmap</h2>
          <p>Follow the path in order, or jump directly into any topic.</p>
        </div>
        <div className="roadmap-progress-panel">
          <span className="progress-label">Overall progress</span>
          <div className="progress-counter">
            <strong>{completedCount}</strong> / {topics.length}
          </div>
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{ width: `${(completedCount / topics.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="roadmap-timeline">
        {topics.map((topic, index) => (
          <div
            className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
            key={topic.title}
          >
            <div className="timeline-node">{index + 1}</div>
            <button
              className="timeline-card"
              type="button"
              onClick={() => openTopic(topic)}
            >
              <div className="timeline-card-meta">
                <span className="timeline-level">{topic.level}</span>
                <span className="timeline-duration">{topic.duration}</span>
              </div>
              <h3>{topic.title}</h3>
              <p>{topic.summary}</p>
              <span className="timeline-status">Not started</span>
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}

function TopicsPage({
  selectedTopic,
  openTopic,
}: {
  selectedTopic: Topic
  openTopic: (topic: Topic) => void
}) {
  return (
    <section className="topics-section page-section page-view" id="topics">
      <div className="section-heading">
        <div>
          <h2>Pick a topic</h2>
          <p>Every topic includes focused notes, key ideas, and starter code.</p>
        </div>
        <a href="#topic-detail">View docs -&gt;</a>
      </div>

      <div className="topic-grid full-topic-grid">
        {topics.map((topic) => (
          <button
            className={`topic-card ${selectedTopic.title === topic.title ? 'selected' : ''}`}
            key={topic.title}
            type="button"
            onClick={() => openTopic(topic)}
          >
            <div className="card-meta">
              <span>{topic.level}</span>
              <span>{topic.duration}</span>
            </div>
            <h3>{topic.title}</h3>
            <p>{topic.summary}</p>
          </button>
        ))}
      </div>

      <article className="topic-reader" id="topic-detail">
        <div className="reader-sidebar">
          <span className="doc-label">{selectedTopic.level}</span>
          <h2>{selectedTopic.title}</h2>
          <p>{selectedTopic.summary}</p>
          <div className="reader-meta">
            <span>{selectedTopic.duration}</span>
            <span>Chapter notes</span>
          </div>
        </div>

        <div className="reader-document">
          <MarkdownDocument source={getTopicDocument(selectedTopic)} />
        </div>
      </article>
    </section>
  )
}

function getTopicDocument(topic: Topic) {
  return (
    topicDocuments[topic.title] ??
    `# ${topic.title}

## Definition

${topic.summary}

## Why It Exists

This topic is part of the JavaScript learning path because it helps you write clearer programs and understand how JavaScript behaves at runtime.

## Syntax

\`\`\`js
${topic.example}
\`\`\`

## Internal Working

JavaScript handles this concept during parsing, memory creation, and execution. The exact behavior depends on whether the value is primitive, reference-based, synchronous, asynchronous, browser-provided, or runtime-managed.

## Examples

\`\`\`js
${topic.example}
\`\`\`

## Common Interview Questions

- What problem does ${topic.title} solve?
- How does JavaScript handle it internally?
- What mistakes do beginners commonly make with this concept?

## Common Mistakes

- Memorizing syntax without understanding execution behavior.
- Ignoring edge cases.
- Not testing with small examples.

## Best Practices

${topic.learn.map((item) => `- ${item}`).join('\n')}

## Real-World Usage

You will use this concept while building UI interactions, data transformations, async flows, modules, and projects.

## Summary

Master this topic before moving ahead in the roadmap. It connects directly with later runtime and project chapters.`
  )
}

function MarkdownDocument({ source }: { source: string }) {
  const blocks = parseMarkdown(source)

  return (
    <>
      {blocks.map((block, index) => {
        if (block.type === 'h1') return <h1 key={index}>{block.content}</h1>
        if (block.type === 'h2') return <h2 key={index}>{block.content}</h2>
        if (block.type === 'h3') return <h3 key={index}>{block.content}</h3>
        if (block.type === 'hr') return <hr key={index} />
        if (block.type === 'code') {
          return (
            <pre className="reader-code" key={index}>
              <code>{block.content}</code>
            </pre>
          )
        }
        if (block.type === 'list') {
          return (
            <ul key={index}>
              {block.items?.map((item) => <li key={item}>{item}</li>)}
            </ul>
          )
        }
        if (block.type === 'table') {
          return (
            <div className="reader-table-wrap" key={index}>
              <table>
                <tbody>
                  {block.rows?.map((row, rowIndex) => (
                    <tr key={row.join('-')}>
                      {row.map((cell) =>
                        rowIndex === 0 ? (
                          <th key={cell}>{cell}</th>
                        ) : (
                          <td key={cell}>{cell}</td>
                        ),
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }

        return <p key={index}>{renderInlineCode(block.content)}</p>
      })}
    </>
  )
}

function renderInlineCode(text: string) {
  const parts = text.split(/(`[^`]+`)/g)

  return parts.map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={index}>{part.slice(1, -1)}</code>
    }

    return part
  })
}

function parseMarkdown(source: string) {
  const lines = source.trim().split('\n')
  const blocks: Array<{
    type: string
    content: string
    items?: string[]
    rows?: string[][]
  }> = []
  let index = 0

  while (index < lines.length) {
    const line = lines[index]

    if (!line.trim()) {
      index += 1
      continue
    }

    if (line.startsWith('```')) {
      const codeLines: string[] = []
      index += 1
      while (index < lines.length && !lines[index].startsWith('```')) {
        codeLines.push(lines[index])
        index += 1
      }
      blocks.push({ type: 'code', content: codeLines.join('\n') })
      index += 1
      continue
    }

    if (line.startsWith('# ')) {
      blocks.push({ type: 'h1', content: line.slice(2).trim() })
      index += 1
      continue
    }

    if (line.startsWith('## ')) {
      blocks.push({ type: 'h2', content: line.slice(3).trim() })
      index += 1
      continue
    }

    if (line.startsWith('### ')) {
      blocks.push({ type: 'h3', content: line.slice(4).trim() })
      index += 1
      continue
    }

    if (line.trim() === '---') {
      blocks.push({ type: 'hr', content: '' })
      index += 1
      continue
    }

    if (line.startsWith('- ') || line.startsWith('* ')) {
      const items: string[] = []
      while (
        index < lines.length &&
        (lines[index].startsWith('- ') || lines[index].startsWith('* '))
      ) {
        items.push(lines[index].slice(2).trim())
        index += 1
      }
      blocks.push({ type: 'list', content: '', items })
      continue
    }

    if (line.startsWith('|')) {
      const rows: string[][] = []
      while (index < lines.length && lines[index].startsWith('|')) {
        const row = lines[index]
          .split('|')
          .map((cell) => cell.trim())
          .filter(Boolean)
        if (!row.every((cell) => /^-+$/.test(cell))) rows.push(row)
        index += 1
      }
      blocks.push({ type: 'table', content: '', rows })
      continue
    }

    const paragraph: string[] = [line.trim()]
    index += 1
    while (
      index < lines.length &&
      lines[index].trim() &&
      !lines[index].startsWith('#') &&
      !lines[index].startsWith('```') &&
      !lines[index].startsWith('- ') &&
      !lines[index].startsWith('* ') &&
      !lines[index].startsWith('|') &&
      lines[index].trim() !== '---'
    ) {
      paragraph.push(lines[index].trim())
      index += 1
    }
    blocks.push({ type: 'p', content: paragraph.join(' ') })
  }

  return blocks
}

function QuizzesPage() {
  const [activeQuiz, setActiveQuiz] = useState<string | null>(null)
  const [currentQ, setCurrentQ] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [completedQuizzes, setCompletedQuizzes] = useState<Set<string>>(new Set())

  const quiz = quizzes.find((q) => q.topicTitle === activeQuiz)

  const startQuiz = (topicTitle: string) => {
    setActiveQuiz(topicTitle)
    setCurrentQ(0)
    setSelectedOption(null)
    setShowResult(false)
    setScore(0)
    setAnswered(false)
  }

  const selectOption = (index: number) => {
    if (answered) return
    setSelectedOption(index)
  }

  const checkAnswer = () => {
    if (selectedOption === null || !quiz) return
    setAnswered(true)
    if (selectedOption === quiz.questions[currentQ].answer) {
      setScore((s) => s + 1)
    }
  }

  const nextQuestion = () => {
    if (!quiz) return
    if (currentQ < quiz.questions.length - 1) {
      setCurrentQ((q) => q + 1)
      setSelectedOption(null)
      setAnswered(false)
    } else {
      setShowResult(true)
      setCompletedQuizzes((prev) => new Set(prev).add(activeQuiz!))
    }
  }

  const backToList = () => {
    setActiveQuiz(null)
    setCurrentQ(0)
    setSelectedOption(null)
    setShowResult(false)
    setScore(0)
    setAnswered(false)
  }

  // Quiz result view
  if (activeQuiz && showResult && quiz) {
    return (
      <section className="quiz-section page-section page-view" id="quizzes">
        <div className="quiz-result">
          <h2>Quiz Complete</h2>
          <div className="result-score">
            <span className="score-number">{score}</span>
            <span className="score-divider">/</span>
            <span className="score-total">{quiz.questions.length}</span>
          </div>
          <p className="score-message">
            {score === quiz.questions.length
              ? 'Perfect score! You really know your stuff.'
              : score >= quiz.questions.length * 0.6
                ? 'Good job! You have a solid understanding.'
                : 'Keep practicing! Review the topic and try again.'}
          </p>
          <div className="result-actions">
            <button className="run-button" type="button" onClick={() => startQuiz(activeQuiz!)}>
              Retry
            </button>
            <button className="ghost-control" type="button" onClick={backToList}>
              All quizzes
            </button>
          </div>
        </div>
      </section>
    )
  }

  // Active quiz question view
  if (activeQuiz && quiz) {
    const question = quiz.questions[currentQ]
    return (
      <section className="quiz-section page-section page-view" id="quizzes">
        <div className="quiz-header">
          <div>
            <h2>{quiz.topicTitle}</h2>
            <p>Question {currentQ + 1} of {quiz.questions.length}</p>
          </div>
          <div className="quiz-score-badge">
            Score: {score}
          </div>
        </div>

        <div className="quiz-progress-bar">
          <div
            className="quiz-progress-fill"
            style={{ width: `${((currentQ + (answered ? 1 : 0)) / quiz.questions.length) * 100}%` }}
          />
        </div>

        <div className="quiz-question-card">
          <h3>{question.question}</h3>
          <div className="quiz-options">
            {question.options.map((option, index) => (
              <button
                className={`quiz-option ${
                  selectedOption === index ? 'selected' : ''
                } ${
                  answered
                    ? index === question.answer
                      ? 'correct'
                      : selectedOption === index
                        ? 'wrong'
                        : ''
                    : ''
                }`}
                key={index}
                type="button"
                onClick={() => selectOption(index)}
              >
                <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                <span>{option}</span>
              </button>
            ))}
          </div>
          {answered && (
            <div className="quiz-explanation">
              <strong>Explanation:</strong> {question.explanation}
            </div>
          )}
          <div className="quiz-actions">
            {!answered ? (
              <button
                className="run-button"
                type="button"
                disabled={selectedOption === null}
                onClick={checkAnswer}
              >
                Check Answer
              </button>
            ) : (
              <button className="run-button" type="button" onClick={nextQuestion}>
                {currentQ < quiz.questions.length - 1 ? 'Next Question' : 'See Results'}
              </button>
            )}
            <button className="ghost-control" type="button" onClick={backToList}>
              Back
            </button>
          </div>
        </div>
      </section>
    )
  }

  // Quiz list view
  return (
    <section className="quiz-section page-section page-view" id="quizzes">
      <div className="section-heading">
        <div>
          <h2>Quizzes</h2>
          <p>Test your understanding with 5 questions per topic.</p>
        </div>
        <div className="roadmap-progress-panel">
          <span className="progress-label">Completed</span>
          <div className="progress-counter">
            <strong>{completedQuizzes.size}</strong> / {quizzes.length}
          </div>
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{ width: `${(completedQuizzes.size / quizzes.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
      <div className="quiz-grid">
        {quizzes.map((q) => {
          const topic = topics.find((t) => t.title === q.topicTitle)
          const isCompleted = completedQuizzes.has(q.topicTitle)
          return (
            <button
              className={`quiz-topic-card ${isCompleted ? 'completed' : ''}`}
              key={q.topicTitle}
              type="button"
              onClick={() => startQuiz(q.topicTitle)}
            >
              <div className="quiz-card-meta">
                <span className="timeline-level">{topic?.level ?? ''}</span>
                <span className="timeline-duration">{q.questions.length} questions</span>
              </div>
              <h3>{q.topicTitle}</h3>
              <p>{topic?.summary ?? ''}</p>
              <span className="timeline-status">
                {isCompleted ? 'Completed' : 'Not started'}
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}

function EditorPage() {
  const [jsCode, setJsCode] = useState(() =>
    readStoredEditorValue(javascriptEditorStorageKey, javascriptEditorDefault),
  )
  const [outputEntries, setOutputEntries] = useState<EditorOutputEntry[]>([])
  const [autoRun, setAutoRun] = useState(false)
  const outputIdRef = useRef(0)

  useEffect(() => {
    window.localStorage.setItem(javascriptEditorStorageKey, jsCode)
  }, [jsCode])

  const executeCode = () => {
    const entries: EditorOutputEntry[] = []
    let nextId = 0

    const originalLog = console.log
    const originalWarn = console.warn
    const originalError = console.error

    const capture = (level: EditorOutputLevel, ...args: unknown[]) => {
      const message = args.map(formatOutputValue).join(' ')
      entries.push({ id: nextId++, level, message })
    }

    console.log = (...args: unknown[]) => capture('log', ...args)
    console.warn = (...args: unknown[]) => capture('warn', ...args)
    console.error = (...args: unknown[]) => capture('error', ...args)

    try {
      // eslint-disable-next-line no-eval
      eval(jsCode)
    } catch (err: unknown) {
      entries.push({ id: nextId++, level: 'error', message: formatRuntimeError(err) })
    }

    console.log = originalLog
    console.warn = originalWarn
    console.error = originalError

    outputIdRef.current += entries.length
    for (const entry of entries) entry.id += outputIdRef.current - entries.length
    setOutputEntries(entries)
  }

  const clearOutput = () => {
    setOutputEntries([])
    outputIdRef.current = 0
  }

  useEffect(() => {
    if (!autoRun) return
    const timer = window.setTimeout(() => executeCode(), 300)
    return () => window.clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRun, jsCode])

  return (
    <section className="editor-section page-section page-view" id="editor">
      <div className="tool-heading">
        <h2>JavaScript Playground</h2>
        <p>
          Write JavaScript code and run it directly. Console output and errors
          appear in the panel on the right.
        </p>
      </div>

      <div className="js-playground">
        <div className="js-editor-pane">
          <div className="js-editor-bar">
            <span className="js-pane-label">JavaScript</span>
            <div className="js-editor-actions">
              <label className="auto-run-toggle">
                <input
                  type="checkbox"
                  checked={autoRun}
                  onChange={(e) => setAutoRun(e.target.checked)}
                />
                Auto Run
              </label>
              <button className="run-button" type="button" onClick={executeCode}>
                Run
              </button>
              <button className="ghost-control" type="button" onClick={clearOutput}>
                Clear
              </button>
            </div>
          </div>
      
          <div className="js-editor-body">
            <MonacoEditor
              height="100%"
              language="javascript"
              value={jsCode}
              onChange={(v) => setJsCode(v ?? '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: 'on',
                automaticLayout: true,
                tabSize: 2,
                scrollBeyondLastLine: false,
              }}
            />
          </div>
        </div>
      
        <div className="js-output-pane">
          <div className="js-output-bar">
            <span className="js-pane-label">Output</span>
          </div>
      
          <div className="js-output-scroll">
            {outputEntries.length === 0 ? (
              <p className="js-output-empty">
                Output is empty. Click Run to execute your code.
              </p>
            ) : (
              outputEntries.map((entry) => (
                <div key={entry.id} className={`js-output-line js-output-${entry.level}`}>
                  {entry.message}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function VisualizerPage({
  currentScenario,
  currentStep,
  isPlaying,
  resetTrace,
  scenarioIndex,
  selectScenario,
  setIsPlaying,
  setSpeed,
  speed,
  stepForward,
  stepIndex,
}: {
  currentScenario: TraceScenario
  currentStep: TraceStep
  isPlaying: boolean
  resetTrace: () => void
  scenarioIndex: number
  selectScenario: (index: number) => void
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>
  setSpeed: React.Dispatch<React.SetStateAction<number>>
  speed: number
  stepForward: () => void
  stepIndex: number
}) {
  return (
    <section className="visualizer-section page-section page-view" id="visualizer">
      <div className="tool-heading">
        <h2>Runtime Visualizer</h2>
        <p>
          Trace a snippet to record an event stream, then step or play through
          the call stack, microtasks, and tasks.
        </p>
      </div>

      <div className="visualizer-controls">
        <select
          value={scenarioIndex}
          onChange={(event) => selectScenario(Number(event.target.value))}
          aria-label="Trace scenario"
        >
          {scenarios.map((scenario, index) => (
            <option key={scenario.title} value={index}>
              {scenario.title}
            </option>
          ))}
        </select>
        <button className="run-button" type="button" onClick={resetTrace}>
          Trace
        </button>
        <button className="ghost-control" type="button" onClick={stepForward}>
          Step
        </button>
        <button
          className="ghost-control"
          type="button"
          onClick={() => setIsPlaying((current) => !current)}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button className="ghost-control" type="button" onClick={resetTrace}>
          Reset
        </button>
        <label className="speed-control">
          Speed
          <input
            type="range"
            min="250"
            max="1200"
            step="50"
            value={speed}
            onChange={(event) => setSpeed(Number(event.target.value))}
          />
        </label>
      </div>

      <div className="visualizer-layout">
        <div className="trace-left">
          <div className="code-panel trace-code">
            <div className="panel-title">script.js</div>
            <pre>
              <code>{currentScenario.code}</code>
            </pre>
          </div>
          <div className="console-panel trace-console">
            <div className="panel-title">Console</div>
            <pre>{currentStep.console.length ? currentStep.console.join('\n') : 'No output yet.'}</pre>
          </div>
        </div>

        <div className="queue-grid">
          <QueuePanel
            title="Call Stack"
            hint="LIFO - runs synchronously"
            items={currentStep.stack}
            tone="stack"
          />
          <QueuePanel
            title="Microtask Queue"
            hint="Drains fully between tasks"
            items={currentStep.microtasks}
            tone="micro"
          />
          <QueuePanel
            title="Task Queue"
            hint="One task per loop iteration"
            items={currentStep.tasks}
            tone="task"
          />
          <div className="trace-status">
            Step {stepIndex + 1} / {currentScenario.steps.length}: {currentStep.label}
          </div>
        </div>
      </div>
    </section>
  )
}

function QueuePanel({
  title,
  hint,
  items,
  tone,
}: {
  title: string
  hint: string
  items: string[]
  tone: string
}) {
  return (
    <article className={`queue-panel ${tone}`}>
      <div className="queue-title">
        <h3>{title}</h3>
        <span>{hint}</span>
      </div>
      <div className="queue-box">
        {items.length ? (
          items.map((item) => <span key={item}>{item}</span>)
        ) : (
          <em>empty</em>
        )}
      </div>
    </article>
  )
}

export default App
