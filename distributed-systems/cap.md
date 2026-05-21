# CAP Theorem

> By Eric Brewer

單一系統最大的問題是 Single Point of Failure，為解決此一問題引入了分散式系統。然而也帶來了 CAP 難題。

- `C`: Consistency (強一致性) => 所有節點在同一時間看到相同的數據。
- `A`: Availability (可用性) => 步保證資料是最新的，只保證一定會理你。
- `P`: Partition Tolerance (分區容錯性) => 系統能夠繼續運作，即使節點之間的通信失效。

因為網路分區（P）在現實中不可避免，所以當網路斷開時，我們只能在 C 與 A 之間二選一：

1. CP: 網路斷開後，為了保證資料一致，系統會拒絕那些無法確認最新狀態的請求 => 犧牲了 Availability。
    - 2PC, Raft protocol
2. AP: 網路斷開後，節點各自為政，繼續提供服務 => 資料可能不一致 (犧牲了 Consistency)。
    - Gossip protocol (memberlist)

## PACELC

CAP 定理雖然經典，但它只描述了「發生網路故障（P）」時的情況。後來有人提出了 PACELC，補足了「正常情況下」的考量：

* P (Partition) 發生時： 權衡 A (Availability) 或 C (Consistency)。
* E (Else) 正常運作時： 權衡 L (Latency) 或 C (Consistency)。