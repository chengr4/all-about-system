# Instruction Set Architecture (ISA)

Def.

- Register: A data storage location
- Instruction: A "control phrase" for a computer, for example `ADD` to add or `MOVE` to transfer information.
- Operands: An input or output value for an instruction, for example, :"Move the data in register X to register Y" would have one input register operand and one output register operand.
- RISC machines have a much smaller set of instructions at the ISA level

## RISC

## CISC

### Limitations of CISC

One issue with trying to improve a specific architecture is that tools and systems have already been developed which use the previous version.  Making significant changes may interfere with the functionality of old software systems. This expectation of backwards compatibility is quite pervasive, and maintenance of legacy systemsLinks to an external site. is an exceedingly common field in the Computer Science discipline.

As an architecture evolves, the developer must choose to either deal with out-of-date architecture components intermixing with their newer, streamlined techniques to allow backwards compatibility, or abandon (obsolete, deprecate) some parts of the older architecture. This can put companies and engineers into a conundrum because they want the improvements from the new system, but many of their systems will cease to function if they are dependent on those deprecated capabilities, and they’ll have to rework and refactor to compensate. There is, of course, another choice - to move to an entirely new architecture whose strengths meet the needs of the system.

## IA-32

See [IA-32](ia-32.md) for more details.