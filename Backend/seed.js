require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Module = require('./models/Module');

const seedData = async () => {
  await connectDB();

  try {
    // Clear existing data
    await Module.deleteMany();

    const modulesData = [
      {
        title: 'Module 1: C# Basics & Environment Setup',
        description: 'Establish a rock-solid foundation by understanding C# runtime fundamentals, type architecture, and precision rules.',
        difficulty: 'Easy',
        studyHours: 12,
        videos: [
          { title: '1.1 Getting Started with C# Basics', url: 'https://www.youtube.com/embed/N775KsWQVkw', durationMinutes: 7 },
          { title: '1.2 Mastering C# Variables & Value Types', url: 'https://www.youtube.com/embed/g-9Jp4dmOBo', durationMinutes: 8 },
          { title: '1.3 C# Conditional Logic & Statements', url: 'https://www.youtube.com/embed/dJ0S_qY118w', durationMinutes: 8 },
          { title: '1.4 Loops & Iteration Control Flow', url: 'https://www.youtube.com/embed/iH5v6P37k8E', durationMinutes: 8 }
        ],
        questions: [
          {
            questionText: 'What is the primary difference in precision and purpose between double and decimal in C#?',
            options: [
              'Double is 64-bit binary floating-point optimized for performance; Decimal is 128-bit decimal floating-point optimized for financial accuracy.',
              'Double is 128-bit and Decimal is 64-bit; they perform identically.',
              'Double is only for integers, whereas Decimal supports fractional numbers.',
              'Decimal is a reference type, and Double is a value type.'
            ],
            correctAnswer: 'Double is 64-bit binary floating-point optimized for performance; Decimal is 128-bit decimal floating-point optimized for financial accuracy.',
            explanation: 'Double uses base-2 representation which causes rounding errors in base-10 decimals. Decimal uses base-10 representation, making it perfect for financial calculations where rounding errors cannot be tolerated.'
          },
          {
            questionText: 'Which execution subsystem compiles Microsoft Intermediate Language (MSIL) into native CPU machine code at runtime?',
            options: [
              'The .NET Roslyn Compiler',
              'The Just-In-Time (JIT) Compiler within the CLR',
              'The Assembly Linker',
              'The C# Native Ahead-Of-Time (AOT) tool'
            ],
            correctAnswer: 'The Just-In-Time (JIT) Compiler within the CLR',
            explanation: 'The C# compiler (Roslyn) converts source code to MSIL. At runtime, the JIT compiler inside the Common Language Runtime (CLR) compiles that MSIL into native CPU machine code on-the-fly.'
          },
          {
            questionText: 'What value is printed by the following code: Console.WriteLine(5 / 2); ?',
            options: [
              '2.5',
              '2',
              '3',
              'Throws a DivideByZeroException'
            ],
            correctAnswer: '2',
            explanation: 'In C#, dividing an integer by another integer performs integer division. The fractional part is discarded, resulting in 2. To get 2.5, at least one operand must be a floating-point number, e.g., 5.0 / 2.'
          }
        ]
      },
      {
        title: 'Module 2: Control Flows, Loops & Arrays',
        description: 'Explore control flows, looping mechanisms, multidimensional array allocations, and collection iteration guards.',
        difficulty: 'Easy',
        studyHours: 14,
        videos: [
          { title: '2.1 Single, Multidimensional & Jagged Arrays', url: 'https://www.youtube.com/embed/9ozOSKCiO0I', durationMinutes: 9 },
          { title: '2.2 C# Methods, Functions & Parameters', url: 'https://www.youtube.com/embed/qY_D2a8k71I', durationMinutes: 8 },
          { title: '2.3 Object Classes & Instances in C#', url: 'https://www.youtube.com/embed/4n29O-H-1sE', durationMinutes: 9 },
          { title: '2.4 Modern .NET Architecture in 100 Seconds', url: 'https://www.youtube.com/embed/r6c-g4Q9YjA', durationMinutes: 6 }
        ],
        questions: [
          {
            questionText: 'What is the immediate runtime result of attempting to modify a collection inside a standard foreach loop?',
            options: [
              'The changes are committed successfully without warning.',
              'An InvalidOperationException is thrown because the collection enumerator is read-only during iteration.',
              'The loop enters an infinite loop state.',
              'The compiler throws a compilation error immediately.'
            ],
            correctAnswer: 'An InvalidOperationException is thrown because the collection enumerator is read-only during iteration.',
            explanation: 'A foreach loop utilizes the collection\'s IEnumerator under the hood. Modifying the collection (adding or removing items) invalidates the enumerator state, causing it to throw an InvalidOperationException at runtime.'
          },
          {
            questionText: 'What is the difference between a multi-dimensional array (e.g., int[,] arr) and a jagged array (e.g., int[][] arr) in C#?',
            options: [
              'A multi-dimensional array has a uniform, grid-like shape, while a jagged array is an array of arrays whose sub-arrays can have varying lengths.',
              'Jagged arrays are strictly read-only; multi-dimensional arrays are writeable.',
              'Multi-dimensional arrays are reference types; jagged arrays are value types.',
              'There is no difference; they are different syntax options for the same structure.'
            ],
            correctAnswer: 'A - Multi-dimensional array has a uniform, grid-like shape, while a jagged array is an array of arrays whose sub-arrays can have varying lengths.',
            explanation: 'Multi-dimensional arrays have a fixed rectangual dimension allocated in a single memory block. Jagged arrays are nested arrays where each row is a separate object and can be of different lengths.'
          },
          {
            questionText: 'How does the break keyword affect nested loops in C#?',
            options: [
              'It terminates all active loops in the entire execution frame.',
              'It terminates only the innermost loop in which the break statement is directly encountered.',
              'It skips the current loop iteration and advances directly to the next iteration.',
              'It crashes the application unless wrapped inside a try-catch block.'
            ],
            correctAnswer: 'It terminates only the innermost loop in which the break statement is directly encountered.',
            explanation: 'The break keyword only exits the immediate loop scope containing it. To exit nested outer loops, you must use nested conditional checks, helper flag variables, or a return statement.'
          }
        ]
      },
      {
        title: 'Module 3: Object-Oriented C# Principles',
        description: 'Delve into method overriding, polymorphism, inheritance hierarchies, abstract base classes vs interfaces, and object boxing.',
        difficulty: 'Medium',
        studyHours: 18,
        videos: [
          { title: '3.1 Object-Oriented Programming (OOP) Fundamentals', url: 'https://www.youtube.com/embed/GhQdlIFylQ8?start=7200', durationMinutes: 8 },
          { title: '3.2 Polymorphism: Override & sealed Modifiers', url: 'https://www.youtube.com/embed/GhQdlIFylQ8?start=8100', durationMinutes: 9 },
          { title: '3.3 Interfaces & Abstract Classes Architecture', url: 'https://www.youtube.com/embed/7Z4z1P1B6s8', durationMinutes: 10 },
          { title: '3.4 Objects Allocation, Boxing & Performance', url: 'https://www.youtube.com/embed/GhQdlIFylQ8?start=9900', durationMinutes: 6 }
        ],
        questions: [
          {
            questionText: 'Can a C# interface contain private method declarations in modern C# (C# 8.0 and above)?',
            options: [
              'No, interfaces must strictly declare only public API signatures.',
              'Yes, to serve as private helper methods for Default Interface Implementations.',
              'Yes, but only if they are declared abstract.',
              'Yes, but they can only be called from an inherited class constructor.'
            ],
            correctAnswer: 'Yes, to serve as private helper methods for Default Interface Implementations.',
            explanation: 'C# 8.0 introduced Default Interface Implementations, allowing interfaces to provide fully realized methods. These methods can utilize private interface methods as local helper functions.'
          },
          {
            questionText: 'What is the precise difference between the override keyword and the new method modifier in inheritance?',
            options: [
              'Override participates in runtime dynamic polymorphism; new hides the base method and performs static binding based on the reference type.',
              'Override hides the base method; new overrides it.',
              'Override is only for value types; new is only for reference types.',
              'They perform identical functions but "new" is used strictly for interfaces.'
            ],
            correctAnswer: 'Override participates in runtime dynamic polymorphism; new hides the base method and performs static binding based on the reference type.',
            explanation: 'Override replaces the base class implementation so that a base pointer calls the derived method. The new modifier performs "method hiding" where a base pointer still calls the base implementation.'
          },
          {
            questionText: 'Which statement accurately describes boxing and unboxing performance in C#?',
            options: [
              'Boxing converts a reference type to a value type and is extremely fast.',
              'Boxing allocates a value type onto the managed heap inside a reference wrapper object; unboxing casts it back. Both incur substantial performance and GC allocation overhead.',
              'Boxing has zero impact on runtime resources since it relies entirely on compile-time syntactical adjustments.',
              'Boxing is only possible in unsafe contexts using raw pointers.'
            ],
            correctAnswer: 'Boxing allocates a value type onto the managed heap inside a reference wrapper object; unboxing casts it back. Both incur substantial performance and GC allocation overhead.',
            explanation: 'Boxing forces a value type (like int) into an object wrapper, triggering a heap allocation. Unboxing performs type checks and dereferencing. Excessive boxing/unboxing causes heavy garbage collection pressure.'
          }
        ]
      },
      {
        title: 'Module 4: Generics, Collections & LINQ',
        description: 'Optimize collections using Generics and leverage Language Integrated Query (LINQ) with deferred execution principles.',
        difficulty: 'Medium',
        studyHours: 16,
        videos: [
          { title: '4.1 Designing Reusable Type-Safe C# Generics', url: 'https://www.youtube.com/embed/GhQdlIFylQ8?start=10800', durationMinutes: 7 },
          { title: '4.2 Generic Collections: Lists & Dictionaries', url: 'https://www.youtube.com/embed/GhQdlIFylQ8?start=11700', durationMinutes: 8 },
          { title: '4.3 Language Integrated Query (LINQ) Expressions', url: 'https://www.youtube.com/embed/GhQdlIFylQ8?start=12600', durationMinutes: 9 },
          { title: '4.4 Deferred LINQ Queries & yield Operators', url: 'https://www.youtube.com/embed/GhQdlIFylQ8?start=13500', durationMinutes: 7 }
        ],
        questions: [
          {
            questionText: 'What does "deferred execution" mean in the context of LINQ queries?',
            options: [
              'The query logic is executed immediately, but results are hidden.',
              'The query is not evaluated and database/collection iteration does not occur until the query results are actually iterated over (e.g. via a foreach loop).',
              'The query runs on a background thread automatically.',
              'The query evaluation is permanently cached in local memory.'
            ],
            correctAnswer: 'The query is not evaluated and database/collection iteration does not occur until the query results are actually iterated over (e.g. via a foreach loop).',
            explanation: 'Most LINQ operators (like Where, Select) return an IEnumerable query definition. The query execution is deferred until you iterate over the object or call an immediate evaluation operator like ToList().'
          },
          {
            questionText: 'Which generic collection offers O(1) lookup speeds and strictly guarantees that all stored elements are completely unique?',
            options: [
              'List<T>',
              'HashSet<T>',
              'Queue<T>',
              'Dictionary<TKey, TValue>'
            ],
            correctAnswer: 'HashSet<T>',
            explanation: 'HashSet<T> relies on a hash table structure. It uses element hash codes to enforce uniqueness and offers high-performance constant-time O(1) lookups, insertions, and deletions.'
          },
          {
            questionText: 'How do you force a deferred LINQ query to execute and materialize its results immediately?',
            options: [
              'By declaring the query using the "var" keyword.',
              'By wrapping the query in a try-catch block.',
              'By calling immediate execution operators like ToList(), ToArray(), or Count() on the query.',
              'LINQ queries always execute immediately; there is no deferred execution.'
            ],
            correctAnswer: 'By calling immediate execution operators like ToList(), ToArray(), or Count() on the query.',
            explanation: 'Any operator that converts the sequence into a concrete collection (like ToList or ToArray) or computes a single scalar value (like Count, Sum, First) forces immediate execution of the query.'
          }
        ]
      },
      {
        title: 'Module 5: Exception Handling & File I/O',
        description: 'Enforce application stability using custom exceptions, finally blocks, resources cleanup, and advanced stream streams.',
        difficulty: 'Hard',
        studyHours: 12,
        videos: [
          { title: '5.1 Exception Handling: catch & try Filters', url: 'https://www.youtube.com/embed/GhQdlIFylQ8?start=14400', durationMinutes: 6 },
          { title: '5.2 Cleanups: using Declarations & IDisposable', url: 'https://www.youtube.com/embed/GhQdlIFylQ8?start=15000', durationMinutes: 8 },
          { title: '5.3 File System I/O and Asynchronous Write Streams', url: 'https://www.youtube.com/embed/GhQdlIFylQ8?start=15600', durationMinutes: 7 },
          { title: '5.4 Working with Managed & Unmanaged System Streams', url: 'https://www.youtube.com/embed/GhQdlIFylQ8?start=16000', durationMinutes: 6 }
        ],
        questions: [
          {
            questionText: 'If a method has a try block returning a value, and a finally block also returning a value, which value gets returned?',
            options: [
              'The compiler throws an error because returning a value directly inside a finally block is syntactically illegal in C#.',
              'The value in the try block takes precedence.',
              'Both values are combined into a Tuple.',
              'The program crashes with a StackOverflowException.'
            ],
            correctAnswer: 'The compiler throws an error because returning a value directly inside a finally block is syntactically illegal in C#.',
            explanation: 'In C#, you cannot have a return, break, or continue statement that transfers control out of a finally block. The compiler will emit error CS0157 because finally blocks must run to completion cleanly.'
          },
          {
            questionText: 'What is the runtime difference between throwing exceptions via "throw;" versus "throw ex;"?',
            options: [
              '"throw;" preserves the entire original call stack; "throw ex;" resets the call stack to the current line, losing valuable debugging telemetry.',
              '"throw ex;" is faster than "throw;".',
              '"throw;" can only be used inside custom Exception classes.',
              'There is no difference; both compiled signatures are identical.'
            ],
            correctAnswer: '"throw;" preserves the entire original call stack; "throw ex;" resets the call stack to the current line, losing valuable debugging telemetry.',
            explanation: 'Using "throw ex;" rethrows the exception object as if it originated at that point, overwriting the StackTrace property. Using "throw;" preserves the original location of the error for trace debugging.'
          },
          {
            questionText: 'What does the C# "using" statement or "using" declaration guarantee for objects that implement the IDisposable interface?',
            options: [
              'It forces the object to run on a separate CPU thread.',
              'It guarantees that the object\'s Dispose() method is invoked automatically when exiting the scope, even if an exception occurs.',
              'It locks the object in memory preventing the garbage collector from running.',
              'It compresses the object to save network bandwidth.'
            ],
            correctAnswer: 'It guarantees that the object\'s Dispose() method is invoked automatically when exiting the scope, even if an exception occurs.',
            explanation: 'The using statement compiles down to a try-finally block. In the finally section, it checks if the resource is not null and calls Dispose(), guaranteeing unmanaged resources are freed under all conditions.'
          }
        ]
      },
      {
        title: 'Module 6: Asynchronous Programming with Async/Await',
        description: 'Master multi-threaded asynchronous patterns, task scheduling, synchronization context deadlocks, and async exceptions.',
        difficulty: 'Hard',
        studyHours: 13,
        videos: [
          { title: '6.1 Multithreading, threadPool & Task Patterns', url: 'https://www.youtube.com/embed/GhQdlIFylQ8?start=16200', durationMinutes: 8 },
          { title: '6.2 Managing Asynchronous Tasks & await Operators', url: 'https://www.youtube.com/embed/GhQdlIFylQ8?start=16500', durationMinutes: 7 },
          { title: '6.3 Avoiding Task Deadlocks and threadPool Starvation', url: 'https://www.youtube.com/embed/GhQdlIFylQ8?start=16800', durationMinutes: 9 },
          { title: '6.4 Concurrency: Task.WhenAll & parallel Execution', url: 'https://www.youtube.com/embed/GhQdlIFylQ8?start=17000', durationMinutes: 8 }
        ],
        questions: [
          {
            questionText: 'Why is using "async void" generally considered highly dangerous and discouraged in C# exception handlers?',
            options: [
              'It runs synchronously and blocks the executing thread.',
              'Exceptions thrown in "async void" methods cannot be caught by outer try-catch blocks and will crash the application process immediately.',
              'It cannot be run in offline environments.',
              'It consumes double the memory of async Task.'
            ],
            correctAnswer: 'Exceptions thrown in "async void" methods cannot be caught by outer try-catch blocks and will crash the application process immediately.',
            explanation: 'Since "async void" returns no Task object, the caller cannot await it or capture its exception. If an exception occurs, it is raised directly on the active SynchronizationContext, causing process termination.'
          },
          {
            questionText: 'What is the risk of synchronously blocking an asynchronous task using task.Result or task.Wait()?',
            options: [
              'It results in static binding errors at compile-time.',
              'It is highly prone to deadlocks, particularly in applications with a single-threaded SynchronizationContext (like GUI or ASP.NET Framework apps).',
              'It causes the compiler to generate duplicate assembly definitions.',
              'There is no risk; this is the recommended way to wait for tasks.'
            ],
            correctAnswer: 'It is highly prone to deadlocks, particularly in applications with a single-threaded SynchronizationContext (like GUI or ASP.NET Framework apps).',
            explanation: 'When blocking via .Result, the active synchronization context is held. If the async task tries to post its completion callback to the same synchronization context, it blocks indefinitely, causing a deadlock.'
          },
          {
            questionText: 'What is the core difference between Task.Delay() and Thread.Sleep() in C#?',
            options: [
              'Thread.Sleep() is non-blocking, whereas Task.Delay() blocks execution.',
              'Task.Delay() yields the current thread back to the runtime to perform other useful work asynchronously; Thread.Sleep() suspends and blocks the current thread entirely.',
              'Task.Delay() is only available in unsafe memory blocks.',
              'There is no difference; they are aliases for the same system function.'
            ],
            correctAnswer: 'Task.Delay() yields the current thread back to the runtime to perform other useful work asynchronously; Thread.Sleep() suspends and blocks the current thread entirely.',
            explanation: 'Thread.Sleep is a synchronous block that stops all work on the thread. Task.Delay returns an awaitable task and sets a timer, leaving the thread open to process other tasks until the timer expires.'
          }
        ]
      }
    ];

    for (const mod of modulesData) {
      const module = new Module(mod);
      await module.save();
    }

    console.log('Database seeded with 6 premium modules successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
