# Data Sharding

## Time-series data

在處理 Time-series data 時，最常見的方式有兩種：

1. (Recommanded) Range-based sharding：
    - 根據 Timestamp 的範圍分配機器。 E.g., Shard A -> 0-1000 sec, Shard B -> 1000-2000 sec。
    - 優點：Range Query 非常高效
    - 缺點：如果資料分布不均，可能會導致某些 Shard 負載過重。
2. Hash-based sharding：
    - 根據 timestamp % num_shards 來分配機器。

### Query Logic

會需要一個 Query Coordinator。
1. Query Coordinator 接到請求， E.g, `count_clicks(start_time, end_time)`
2. Coordinator 根據 Meta-data 判斷這段範圍橫跨了哪些 Shards
3. Send sub-query 給對應的 Shard，等待回覆
4. Aggregate 結果，回傳給 Client