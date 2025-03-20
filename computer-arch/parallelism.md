# Parallelism

Two levels of parallelism in **Hardware**:

1. **Instruction Level Parallelism (ILP)**: Multiple instructions are executed simultaneously.
    - Pipelining
    - Caching
2. **Processor Level Parallelism (PLP)**
    - multiprocessors (multiple CPUs, shared memory)
    - multicomputers (multiple CPUs, individual memory)

## Instruction-Level Parallelism

### Pipelining

Hardware must provide separate units that are each capable of processing some part of an instruction, effectively breaking the Instruction Execution Cycle into its component parts (Fetch, Decode, Operand Fetch, Execute, Store Result) and then processing these parts individually.

### Caching

Instruction Caching (a fundamental design method in RISC architectures) involves bringing a group of instructions into a cache, rather than fetching them individually. This makes these instructions available for immediate execution when the processor is ready for them. This method works great when the structure of the program is mostly sequential. Decision structures, repetition, procedure calls, or any place where execution might transfer to a different part of the program, cause it to lose efficiency. The processor ends up doing work to cache instructions that will never be executed, and these must be overwritten by the branch destination instructions. Instruction Caching, branch prediction, and similar topics are a vital area of research. It’s also an area where different computer science specializations come together to solve a particular kind of problem. For example, artificial intelligence is applied to implement branch prediction for intelligent caching.

## Processor-Level Parallelism

With processor-level parallelism, multiple processors work simultaneously, each taking part of a task and completing it on their own, then sharing their solution to complete the larger task.

### Multiprocessors (Shared Memory)

- High degree of coordination, especially with regards to access controls. 
- In many cases there is a central, organizing node
- Some other implementations utilize cooperative communication

### Multicomputers (Distributed Memory)

-  the results have to be synchronized or combined to achieve the end state.

## Software Parallelism

The potential speedup factor: `speedup = n / (1 + (n-1) * f)`

- `n`: Number of Processors
- `f`: fraction (percentage) of code that is sequential (cannot be parallelized)
- if speedup = 2, it means the algorithm runs twice as fast as it would on a single processor.


`$T_parallel = fT + ((1-f)T)/n$`

- T: time to process entire algorithm sequentially (one processor)
- T_parallel: time to process parallelized algorithm

