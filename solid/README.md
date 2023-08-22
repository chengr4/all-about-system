# OOP SOLID Principle

- Five design principles intende to make OO designs more understandable, flexable and maintainable

## "S"ingle Responsibility Principle

- Every class, module, function should only have one single responsibility

Eg. If the class has `logMsg()` and `trackMsg()` (two responsibilities) => move `logMsg()` out of the class and import it from the place you set it.

## "O"pen/Closed Principle

- Software entities (classes, modules, functions, etc.) should be open for extension, but closed for modification
  - Open: We are able to add new things without changing the code inside the function
  - Close: The code changed outside the function should not affect the code inside the function (the code in function should not be modified)

## "L"iskov Substitution Principle

## "I"nterface Segregation Principle

## "D"ependency Inversion Principle

### When to use

1. when seeing huge `if statement` or `switch`