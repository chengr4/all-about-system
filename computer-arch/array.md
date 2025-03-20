# Array in Assembly

4 useful operations: `TYPE`, `LENGTHOF`, `SIZEOF`, `OFFSET`

```masm
.data
  myArr     DWORD       100,200,300,400,500
  typeArr   DWORD       TYPE myArr      ; typeArr = 4 (type DWORD = 4 bytes)
  count     DWORD       LENGTHOF myArr  ; count = 5
  numByte   DWORD       SIZEOF myArr    ; numByte = 5x4=20
```

For modifying:

```masm
  MOV   EDI, OFFSET myVar     ; EDI points to a memory variable
  MOV   [EDI], EAX            ; No change needed
  MOV   DWORD PTR [EDI], 10   ; Cast immediate 10 as DWORD, then write to memory
  INC   DWORD PTR [EDI]       ; Increment 4-byte unsigned integer in memory
                              ; pointed to by EDI
```

## Two primary array access methods

1. Indirect Operands
    - Base + Offset
    - Register Indirect
2. Indexed Operands

### Indirect Operands

Base + Offset:

```masm
.data
myArr   DWORD   100, 400, 900
uArr    DWORD   10 DUP(?)

.code
main PROC
  MOV   ESI, OFFSET myArr   ;Address of first element of myArr into ESI
  MOV   EDI, OFFSET uARR    ;Address of first element of uArr into EDI
  MOV   EAX, [ESI]          ;Value of first element of myArr into EAX
  MOV   [EDI], EAX          ;Value of EAX replaces first element of uArr
  exit
main ENDP
```

Register Indirect:

```masm
.data
  myArr     DWORD       100,200,300,400,500

.code
main PROC
  MOV   ESI, OFFSET myArr    ;Address of first element of myArr into ESI
  MOV   ECX, LENGTHOF myArr  ;Number of elements of myArr into ECX
_PrintArr:
  MOV   EAX, [ESI]           ;n-th element of myArr into EAX
  CALL  WriteDec
  CALL  CrLf
  ADD   ESI, TYPE myArr      ;Increment ESI by 4 to
                             ;point to the next element of myArr
  LOOP _PrintArr
  exit
main ENDP
```

### Indexed Operands

```masm
 .data
  myArr     DWORD       100,200,300,400,500

.code
main PROC
  MOV   EAX, 4
  ; Execution Point A 
  exit
main ENDP
```

| Reference Type | Example Instruction | Index Accessed | Value Accessed |
|----------------|---------------------|----------------|----------------|
| Label[imm] | myArr[8] | 2 | 300 |
| [Label + imm] | [myArr + 12] | 3 | 400 |
| Label[reg] | myArr[EAX] | 1 | 200 |
| [Label + reg] | [myArr + EAX] | 1 | 200 |
| Label[reg*imm] | myArr[EAX * TYPE myArr] | 4 | 500 |
| [Label + reg*imm] | [TYPE myArr * EAX + myArr] | 4 | 500 |

### The PTR Operator

```
  MOV   EDI, OFFSET myVar  ; EDI points to a memory variable
  MOV   [EDI], EAX         ; EAX is size 4, so assembler knows to use opcode corresponding to a 4-byte MOV
  MOV   [EDI], 10          ; Immediate 10 has no known size
  INC   [EDI]              ; INC can work on 1-, 2-, 4-byte lengths. Which to use?
```

=> 

```
  MOV   EDI, OFFSET myVar     ; EDI points to a memory variable
  MOV   [EDI], EAX            ; No change needed
  MOV   DWORD PTR [EDI], 10   ; Cast immediate 10 as DWORD, then write to memory
  INC   DWORD PTR [EDI]       ; Increment 4-byte unsigned integer in memory
                              ; pointed to by EDI
```