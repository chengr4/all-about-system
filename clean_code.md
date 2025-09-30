# Clean Code

## IF-ELSE

### Guard Clause

- 盡早返回
- Senario: 一種情況是正常流程，另一種情況是例外處理

```java
// Bad
public void processOrder(Order order) {
    if (order.isValid()) {
        // 處理訂單的邏輯
    } else {
        throw new IllegalArgumentException("Invalid order");
    }
}

// Good
public void processOrder(Order order) {
    if (!order.isValid()) {
        throw new IllegalArgumentException("Invalid order");
    }
    // 處理訂單的邏輯
}
