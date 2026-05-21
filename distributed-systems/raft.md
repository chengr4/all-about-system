# Raft

A Transaction system. Raft is a protocol for implementing distributed consensus.

- Target:「正確性」與「一致性」
- because we need majoriry, we should not have too many nodes. => 7 - 9 nodes in practice.
- Raft 所有的寫入操作都必須經過唯一的 Leader。在大規模並行請求下 Leader 的網路頻寬、CPU 與磁碟 I/O 會成為系統的單點瓶頸。

- `AppendEntries`
    - Reply false if log doesn't contain an entry at prevLogIndex whose term matches prevLogTerm
- `AppendEntriesArgs`: heartbeat or log replication
    - `entries`: log entries to store or nil for heartbeat; 

## Leader Election

- Timeout oriented
    1. Wait for a leader until Election Timeout
- 任期檢查與狀態轉換：若傳入的 term 大於本機任期，則將本機轉為 Follower。
    - 接收請求與回應都會需要檢查

## Log replication

1. Leader receives a command from a client, appends it to its log.
2. Leader sends AppendEntries RPCs in parallel to all followers to replicate the log entry.
3. The majority of followers respond with success, the leader update `committed_index`. 
4. The leader notifies followers of the new `committed_index` in subsequent AppendEntries RPCs.
5. If `committed_index > last_applied`, followers apply the log entries in order to their state machines and update `last_applied`.

## Network Partition





