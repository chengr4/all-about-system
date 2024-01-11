# OOP SOLID Principle

- Five design principles intende to make OO designs more understandable, flexable and maintainable

## "S"ingle Responsibility Principle

- Every class, module, function should only have one single responsibility

Eg. If the class has `logMsg()` and `trackMsg()` (two responsibilities) => move `logMsg()` out of the class and import it from the place you set it.

## "O"pen/Closed Principle

- Software entities (classes, modules, functions, etc.) should be open for extension, but closed for modification
  - Open: We are able to add new things without changing the code inside the function
  - Close: The code changed outside the function should not affect the code inside the function (the code in function should not be modified)
- 簡單的說就是加 plugin 的概念
- 目的：增加新功能時，減少修改已經可以運作的程式碼的可能性，以免出現預料之外的 bug

## "L"iskov Substitution Principle

Subtypes must be substitutable (without breaking the program) for their base (parent) types

Eg. A square should not be a subclass of a rectangle (See examples of he code)

> It might not be intuitive, but it applies to OOP

If we make a square a subclass of a rectangle, we will have to change the code inside the rectangle class to make it work for the square class. This is a violation of the Liskov Substitution Principle.

## "I"nterface Segregation Principle

## "D"ependency Inversion Principle

### When to use

1. when seeing huge `if statement` or `switch`