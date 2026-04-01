# Guidance

## Tentative Topic List

- 2-Phase and 3-Phase Atomic Commit
   - tikv: `tikv/src/storage/txn/mod.rs`
   - keywords: prewrite, commit
   - 學習點：看程式碼如何處理「第一階段成功但第二階段失敗」的邊界情況。
- Gossip-based Message Dissemination and Failure Detection and Membership
    - memberlist
    - `gossip.go`: 處理訊息如何隨機選取節點發送
    - `state.go`: 管理節點的 Alive/Suspect/Dead 狀態切換
    - 學習點: 節點是如何像病毒傳播一樣，把「某節點掛了」的消息傳遍全網
- Leader Election
    - openraft
- Raft Algorithm, Consensus Time and Ordering
    - openraft: Vote, AppendEntries, append_entries
    - 你會看到 Raft 論文裡的 Term、Index、Log 是如何變成 Rust 的 struct 和 enum
- Snapshots
    - rockraft: `snapshot.rs`
- Mutual Exclusion
    - rockraft
- Multicast