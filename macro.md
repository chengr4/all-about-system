# Macro

> WARNING: Do not put a RET statement at the end of a macro. This is a very common error and causes big debugging headaches!

E.g.

```
PrintChar MACRO charA:REQ   ;charA is Required
  PUSH  EAX
  MOV   AL, charA
  CALL  WriteChar
  POP   EAX
ENDM

```

## Procedure vs Macro

- The biggest difference between procedures and macros is that macros calls are replaced with the body of the macro as a preprocessing step.

Procedure:

- Procedures are realized at **runtime**.
- A procedure is a separate, named section of code used to implement a module of program logic.
- Parameters may be passed to procedures either through registers or on the runtime stack
- The call mechanism for procedures will…
    - push the return address to the runtime stack.
    - transfer execution control to the procedure by updating the instruction pointer to the first instruction of the procedure.
- The return mechanism for procedures will…
    - pops the address off the system stack and onto the instruction pointer.
    - possibly increment the stack pointer by the argument of the RET instruction.
- Procedure code gets translated into machine code during the assembly process.
    - Code for procedures is translated just once.
    - This code is implemented starting at a particular code segment address when it’s loaded into memory by the operating system and the loader.
    - During execution, whenever the procedure is called, control is transferred to that section, it does its job, it hits the return statement, it returns back to the calling procedure.
    - This same code can be called as many times as you want to call it in your program, without bloating the amount of code segment memory used by the program.

Macro:

- Macros must be defined before they can be invoked/called (these terms are used interchangeably).
- The macro definition looks similar to a procedure, but the macro call behaves similarly to a constant.
-  Parameter placeholders are optional, and must be listed in-line immediately after the MACRO definition. 
- And each placeholder must follow normal rules for identifiers

