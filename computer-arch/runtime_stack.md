# Runtime Stack

- Maintained by the OS in the RAM

Passing parameters on the stack:

```masm
PUSH  lowVal      ; Pass value parameter "lowVal"
PUSH  highVal     ; Pass value parameter "highVal"
PUSH  OFFSET sum  ; Pass reference parameter, pointer to "sum"
CALL  sumVals     ; Call the procedure
```

Base pointer `EBP`:

- It can point at any particular location on the stack without potentially misaligning the stack.

> In writing MASM procedures, we will always be to preserve `EBP` and then copy `ESP` into it.

```masm
myProc PROC
  PUSH  EBP         ; Step 1) Preserve EBP
  MOV   EBP, ESP    ; Step 2) Assign static stack-frame pointer
  ; ... All the rest of the procedure
myProc ENDP
```

- The ordering for building the stack frame (param => return address => old value of pase pointer => local variable => saved registers), the use of the stack for passed parameters, and the method for deconstructing it are collectively known as the `stdcall` calling convention.

## Referencing Stack-Passed Parameters

- addressing mode: `[EBP + 8]` or `[EBP + 12]` etc.