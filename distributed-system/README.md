# Distributed Systems

A distributed system is a collection of entities, each of which is autonomous, programmable, asynchronous and **failure-prone**, and which communicate through an **unreliable** communication medium.

> Entity: a process on a device (PC, PDA)


## 2 Phase Commit

> Lagacy protocol

- 2PC 是一個強同步協議。在事務執行的全程中，所有的參與者都需要佔用資源鎖
- 2PC 裡，如果協調者掛了，大家就只能原地發呆。