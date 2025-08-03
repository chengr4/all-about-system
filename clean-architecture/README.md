# Clean Architecture

## Important Concepts

- The business rules do not need to know about the database, GUI
- All the business rules need to know is that there is a set of functions that can be used to retrieve and store data
- The IO is irrelevant
- The definition of the data structure is on the calling side of the boundary

Business rules change at different times and for different reasons than dependency injection framework so **there should be a boundary between them.** E.g.

Wrong:

```java
@Component  // 這是 Spring 的東西
public class InvoiceService {
    @Autowired
    private TaxCalculator taxCalculator;  // 又是 Spring 的語法

    ...
}
```

Right:

```java
@Component
public class InvoiceController {

    private final InvoiceService invoiceService;

    @Autowired
    public InvoiceController(InvoiceService invoiceService) {
        this.invoiceService = invoiceService;
    }

    public void doSomething() {
        invoiceService.createInvoice();
    }
}

```

- 單一職責原則（SRP）是什麼？ 每個模組/類別應該只對一個「變化的原因」負責。

| 類別                 | 責任          | 改變原因               |
| ------------------ | ----------- | ------------------ |
| `OrderService`     | 計算訂單價格      | 商業邏輯變更             |
| `SpringController` | 處理 HTTP 請求  | 框架或路由設定變更          |
| `OrderRepository`  | 存取資料庫中的訂單資料 | 資料儲存或 DB schema 改變 |

這三者的變化來自不同領域：業務 vs 框架 vs 基礎設施，所以要「畫邊界」，分成不同層或模組。

## Polymorphism

