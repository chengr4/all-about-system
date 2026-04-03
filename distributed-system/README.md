# Distributed Systems

A distributed system is a collection of entities, each of which is autonomous, programmable, asynchronous and **failure-prone**, and which communicate through an **unreliable** communication medium.

> Entity: a process on a device (PC, PDA)


## 2 Phase Commit

> not enough

- 2PC 是一個強同步協議。在事務執行的全程中，所有的參與者都需要佔用資源鎖
- 2PC 裡，如果協調者掛了，大家就只能原地發呆。

## 3 Phase Commit

2PC 最大的問題是同步阻塞。當協調者故障，且某個可能已收到最終決策（Commit/Abort）的參與者也同時故障時，其他存活且處於 READY 狀態的參與者會因為無法判斷該參與者是否已經執行了操作，為了保證強一致性，只能持續鎖定資源並卡死，直到協調者或故障節點恢復。

3PC 的目標：成為一個 Non-blocking 的協議，即使發生超時或部分節點故障，系統仍能繼續運作。

- 3PC 依賴同步網路與可靠超時假設
- **重點**：在 3PC 中，若協調者故障且存活節點都尚未進入 Pre-Commit，則可安全地集體 Abort。若存活節點已進入 Pre-Commit，則可在超時後依終止規則推進至 Commit。