# Adapter Pattern

E.g.

`prewrite` 是一個公開的 API，他只是單純的呼叫 `prewrite_with_generation`，並且傳入一個預設值 `0` 作為 generation 的參數。

```rust
pub fn prewrite<S: Snapshot>(
    txn: &mut MvccTxn,
    reader: &mut SnapshotReader<S>,
    txn_props: &TransactionProperties<'_>,
    mutation: Mutation,
    secondary_keys: &Option<Vec<Vec<u8>>>,
    pessimistic_action: PrewriteRequestPessimisticAction,
    expected_for_update_ts: Option<TimeStamp>,
) -> Result<(TimeStamp, OldValue)> {
    prewrite_with_generation(
        txn, reader, txn_props, mutation, secondary_keys,
        pessimistic_action, expected_for_update_ts,
        0,  // ← 默认值
    )
}
```

Reason:

- 簡化 API，大多數 Caller 不關心 generation 的參數。
- Backward compatibility: 封裝之後，若有新增參數，對於現有的 Caller 不會造成影響。
- Single Source of Truth