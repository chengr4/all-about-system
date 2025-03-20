# Computer Architecture

## RISC



## CISC

### Limitations of CISC

One issue with trying to improve a specific architecture is that tools and systems have already been developed which use the previous version.  Making significant changes may interfere with the functionality of old software systems. This expectation of backwards compatibility is quite pervasive, and maintenance of legacy systemsLinks to an external site. is an exceedingly common field in the Computer Science discipline.

As an architecture evolves, the developer must choose to either deal with out-of-date architecture components intermixing with their newer, streamlined techniques to allow backwards compatibility, or abandon (obsolete, deprecate) some parts of the older architecture. This can put companies and engineers into a conundrum because they want the improvements from the new system, but many of their systems will cease to function if they are dependent on those deprecated capabilities, and they’ll have to rework and refactor to compensate. There is, of course, another choice - to move to an entirely new architecture whose strengths meet the needs of the system.

## QA

### Why to learn Postfix?

- it helps understand how the Intel IA-32 Floating Point Unit (FPU) works

## Primary Architecture Components

> The key concept of the Von Neumann architecture is that programs are stored in memory.

### CPU

System Clock:

- The metronome for a computer
- Guarantee synchronization of operations => no instruction can be implemented faster than one clock cycle

> Theoretically, by increasing the clock rate one would increase the speed of every operation, but there are physical limitations to this concept.

Rigister:

- reside on the CPU

Bus (aka. pipelines):

- Transfer rates corresponding to bus width
- Address Bus: For the Main Memory Unit and the CPU, the **memory address** must be placed on it.
- Control Bus: Uses signals to coordinate all devices attached to the system.
- Transfers data between the CPU and attached onboard (interior) or peripheral devices, such as network interfaces, graphics cards, monitors, etc.

ALU (arithmetic/logic unit):

- Compute basic operations such as addition, subtraction, etc.
- Logical operations: AND, OR, NOT, etc.

CU (control unit):

- Manage the flow of execution for programs
- Instruction Pointer (IP) - holds the **memory address** containing the next instruction to be executed
- Instruction Register (IR) - holds the "code" describing the current instruction being executed
- Instruction Decoder - decodes the current instruction and passes the details to the…
- Control Register (Specific to CISC computers) - coordinates the execution of the instruction (which is implemented by running a micro-program in the Control Unit)
- Status Register - A set of flags corresponding to processed data, or which indicate ways in which data will be processed.

Memory I/O:

- `read/write` information in main memory.
- Memory Address Register (MAR) - points to the memory address where the read/write will occur. Value (specific memory address) from MAR goes to the Address Bus.
- Memory Data Register (MDR) - holds the value to be written to memory (by placing it on the Data Bus) or the value just read from memory (via the Data Bus).

L0/L1 Cache:

### Main Memory (RAM)

- Von Neumann architecture model: the building blocks of a program and data both reside in memory. 
- Each memory cell is 128 by 64 structure (8192 bits)
- The program is stored here
- So is the runtime stack

If the processor wants to access data stored in a certain addressed memory: 

1. Specify the address to be read by placing the address on the Address Bus.
2. Trigger a Memory Read by Asserting (changing the value of) the processor’s RD pin.
3. Wait a clock cycle for the desired information to be copied (placed on) the data bus.
4. Move the data into its destination (provided to the instruction as a destination operand, often a register) where it can be processed in the ALU or other CPU-internal component.

> A program is just a list of instructions to be executed, and which is saved somewhere in one of the various levels of memory. (Loaded by Loader)

### I/O

- Onboard devices
    - Additional non-volatile memory, such as Hard Disk Drives (HDD) and Solid State Drives (SSD).
    - Network Adapters, to connect to other computers
    - Other on-board processors, such as graphics cards
- Peripheral devices
    - Data acquisition peripherals, such as mice, keyboards, gamepads, or instrumentation
    - Data display peripherals, such as monitors, etc
    - Attached memory, such as flash drives

For example, to read from memory you would place the memory address to be read from on the `address bus` (just as you would place an address on an envelope), then the control bus would signal `read` (or `fetch`), after which the data would be present on the `data bus`.


### Instruction Execution Cycle

1. Fetch the instruction at the address in the Instruction Pointer into the Instruction Register.
2. Increment the Instruction Pointer to point to next instruction’s address.
3. Decode the instruction in the Instruction Register.
4. If the instruction requires memory access, determine the memory address, and fetch the operand from memory into a CPU register, or send the operand from a CPU register to memory.
5. Execute the instruction.
6. Store resultant operands.

## Endianness

簡單來說就是 bit 的儲存方式，有兩種：
    1. Big-endian: Most significant byte is stored at the smallest memory address
    2. Little-endian: Least significant byte is stored at the smallest memory address

> 注意：當大小超過 1 byte 時，才會有 endianness 的問題。

- Benefits of little-endian byte ordering
    - Simpler typecasting, quick even/odd parity checks, arithmetic function optimization.

## References

- [Writing Nintendo (NES) Games with Assembly](https://media.oregonstate.edu/media/t/0_av1m2m6j)
- [Shenzhen I/O](https://www.zachtronics.com/shenzhen-io/)
- [Zachtronics](https://www.zachtronics.com/)

### FPU

- [masmforum.com SimplyFPU Tutorial by Raymond Filiatreault](https://www.website.masmforum.com/tutorials/fptute/)
- [Online Postfix Calculator](https://devonsmith.github.io/cs460/hw2/demo/)