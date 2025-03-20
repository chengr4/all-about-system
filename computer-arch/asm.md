# ASM

## Directives

- DWORD, WORD, BYTE, etc.: Specify memory space to be allocated for ‘variable’ storage

    ```
    ValA DWORD 40 ; Allocate 4 bytes of memory for ValA and     
                    initialize it to 40
    ```

### Equals-sign Directive

```
MIN_VAL = 30
MAX_VAL = 200
; (X) Enter an integer between 30 and 200
; (O) Enter an integer between ▲ and ╚.
; The ASCII characters corresponding to the values will be displayed.
rangeVals  BYTE "Enter an integer between ",MIN_VAL," and ",MAX_VAL,".", 0
```

### The EQU Directive

- Constant for expressions or text

E.g.

```
GREETING     EQU   <"Welcome, brave travelers!", 0>
```

## Intrinsic Data Types

- Note that directives which indicate data types in MASM, as on the list below, do not restrict the type of data stored. 
=> if I create a REAL8 I may absolutely store 8 bytes of any kind of data at the address the REAL8 identifier points to.

## Defining Arrays/Strings using DUP

`DUP` is an operator which replaces the initializer and allocates space for storage of multiple items.

```
myString   BYTE   30 DUP(0)   ;create a 30-character string, initialize all bytes to NULL
myArray    DWORD  21 DUP(?)   ;create a 21-element DWORD array, leave values uninitialized
ArraySize = ($ - myArray)
```

## Defining Strings with String Literals

```
myString    BYTE    "My name is Blake",0   ;create a NULL(0)-terminated string for printing.
myString \ ;allows you to concatenate two lines of source code.
BYTE "My Name is Blake",0
```

## Branching Execution

- In order to implement either conditional or unconditional branching, you have to define a **code label**. 

> Recall that code labels are **identifiers** representing **an address** in the code segment (E.g. `myLabel:`).

### Conditional Branching

- MASM provides a way to compare two operands and the comparison and it is done in the Arithmetic and Logic Unit (ALU).
- The result of the compairsons are checkable in the status register `EFLAGS`.

