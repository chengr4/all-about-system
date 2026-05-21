# Summary

## 20260407

> #LogicalClock #LamportTimestamp #VectorClock #NTP #Causality #ConcurrentEvents #ClockOffset

1. **邏輯時鐘與因果關係 (Logical Clocks & Causality)**
    *   **核心理念**：在異步分散式系統中，實體時鐘難以同步，改用「Happens-before ($\to$)」關係定義事件順序。
    *   **蘭伯特時間戳記 (Lamport Timestamps)**：使用單一整數計數器。優點是空間小，缺點是無法辨識並行 (Concurrent) 事件（即 $L(a) < L(b)$ 不代表 $a \to b$）。
    *   **向量時鐘 (Vector Clocks)**：每個行程維護一個向量。能精確識別因果關係與並行事件，但空間複雜度隨行程數 $N$ 線性增加。

2. **NTP (Network Time Protocol) 原理**
    *   **階層架構**：採用樹狀結構（Primary/Secondary/Tertiary Servers），透過階層傳遞精確時間。
    *   **偏移量計算**：透過交換四個時間戳記（$ts1, tr1, ts2, tr2$），計算估計偏移量 $o = (tr1 - ts1 + ts2 - tr2) / 2$。
    *   **真實偏移量 (oreal) 與誤差**：`oreal` 是理論上的真實差距。NTP 誤差受網路往返時間 (RTT) 影響，最大誤差範圍為 $\pm RTT/2$。

3. **專案中的時間處理實踐**
    *   **Memberlist**：實作了蘭伯特邏輯時鐘，確保在不依賴外部 NTP 的情況下達成成員狀態更新的一致性。
    *   **TiKV**：極度依賴時間同步以維持分散式事務。若本地時鐘與 PD 的 TSO (Timestamp Oracle) 偏差過大，會觸發 `MaxTimestampNotSynced` 錯誤以防止一致性破壞。




## 20260402

> #3PC #2PC #NonBlocking #PreCommit #FailureAnalysis

1. 3-Phase Commit (3PC) 的演進動機:
    *   **解決 2PC 的阻塞 (Blocking) 問題**: 在 2PC 中，若協調者與參與者同時故障，留在 `READY` 的節點會因不確定狀態而卡死。
    *   **目標**: 成為一個**非阻塞 (Non-blocking)** 協議，讓參與者在超時後能透過互相詢問達成共識。

2. 3PC 的三個階段:
    *   **Can-Commit (Voting Phase)**: 詢問意願，確認節點是否具備執行能力。
    *   **Pre-Commit (Preparation Phase)**: **核心改進**。當全員同意後，進入此階段作為緩衝，代表「即將提交」的共識已達成。
    *   **Do-Commit (Commit Phase)**: 執行最終的實體提交。

3. 3PC 的核心特性與規則:
    *   **狀態同步性 (One-State Rule)**: 任意兩個參與者的狀態落差不會超過一個階段（例如：不可能有人在 `ABORT` 而有人在 `PRECOMMIT`）。
    *   **PRECOMMIT 作為提交證明 (Commit Certificate)**: 只要有任何一個節點進入 `PRECOMMIT`，即證明當初「投票階段」是全員通過的。

4. 故障處理邏輯 (Failure Analysis):
    *   **混雜狀態處理**: 當協調者故障，參與者互相詢問發現狀態混雜（`READY` 與 `PRECOMMIT` 同時存在）時，**`PRECOMMIT` 具有優先權**，系統會走向 `COMMIT`。
    *   **安全撤銷 (Safe Abort)**: 只有當**所有**能連線的參與者都還在 `READY` 狀態（代表沒人收到過 Pre-commit 指令）時，大家才會一起選擇 `ABORT` 以保證安全性。
    *   **超時自動化**: 
        *   在 `PRECOMMIT` 狀態超時：自動轉向 `COMMIT`（因為有證據顯示投票已過）。
        *   在 `READY` 狀態超時：詢問他人後，若無 `PRECOMMIT` 證據則轉向 `ABORT`。

---

> #Commit #Persistence #2PC #ClockSkew #ClockShift #MDR #ExternalSync #CristiansAlgorithm

1. **Commit 與持久性 (Persistence)**
    *   **邏輯不可逆點**：Commit 代表共識已達成。在 Raft 等系統中，過半數複製即為邏輯 Commit，即便尚未落盤。
    *   **硬碟是最終防線**：一致性在系統重啟後的存續依賴於持久化儲存（如 WAL）。沒有 Drive 的保證，一致性僅存在於運行期間。

2. **2PC 的阻塞與一致性風險**
    *   **為何不能隨意 Abort**：在 2PC 中，若參與者 $P_i$ 已 Commit 但隨後與協調者一同掛掉，剩餘節點不可自行 Abort，否則會違反原子性（有人做有人沒做）。
    *   **阻塞特性**：這是 2PC 的致命傷，系統必須等待故障節點恢復以確認最終狀態，除非使用 Paxos/Raft 等多數決協議來提升可用性。

3. **時鐘偏斜 (Skew) vs. 偏移 (Shift)**
    *   **Clock Skew (偏斜)**：描述時鐘跑的「速度」快慢（頻率差異），會隨時間累積誤差。
    *   **Clock Shift/Offset (偏移)**：描述特定瞬間兩個時鐘「讀值」的絕對差距。
    *   **MDR (Maximum Drift Rate)**：硬體天生的最大漂移率（ppm），是計算分散式租約（Lease）安全邊界與 TrueTime 不確定性區間 ($\epsilon$) 的核心參數。

4. **外部同步 (External Synchronization)**
    *   **目標**：將節點時間對齊外部權威源（UTC/GPS/原子鐘），確保跨系統的因果排序。
    *   **Cristian's Algorithm**：最基礎的同步演算法，透過 $RTT$ 估算時間：$T_{new} = T_{server} + RTT/2$，最大誤差約為 $\pm RTT/2$。
    *   **現代方案**：NTP（軟體級、毫秒精度）與 PTP（硬體級、微秒精度）。

## 20260331

Tags: #BoundedTime #LogicalClock #FencingToken #CAP #BFT #2PC #CPvsAP

1. 有界時間 (Bounded Time):
    *   定義操作、延遲或時鐘漂移存在預定義上限 ($T$)。
    *   它是區分同步與非同步系統的分水嶺，直接影響超時 (Timeout) 機制的可靠性。
2. 邏輯時鐘 (Logical Clocks) 與邏輯鎖:
    *   **邏輯時鐘:** 解決分散式環境中實體時鐘不一致的問題，定義事件的因果順序 (Happened-before)。
    *   **邏輯鎖:** 透過 **Fencing Token** (遞增序號) 解決「租約過期後舊客戶端誤寫入」的問題。
3. CAP 定理:
    *   在網路分區 (**P**) 必然發生的前提下，系統必須在強一致性 (**C**) 與可用性 (**A**) 之間權衡。
    *   `TiKV` / `OpenRaft` 屬 **CP** 系統；`memberlist` (Gossip) 偏向 **AP** 系統。
4.  拜占庭將軍問題 (BFT):
    *   探討節點不僅會掛掉，還可能「說謊」（發送惡意/錯誤數據）的情況。
    *   達成共識的門檻為 $3m+1$（誠實節點需超過 2/3）。

5. 2-Phase Commit (2PC) vs. 1-Phase:
    *   **1PC 的缺陷:** 協調者直接下令 Commit，若參與者此時無法執行（如硬碟滿了），會導致系統狀態不一致。
    *   **2PC 的改進:** 增加 **Voting Phase**。先確認所有參與者「具備執行能力」並取得共識後，再於 Phase 2 執行 Global Commit。
    *   **2PC 失效分析 (Failure Analysis):**
        *   **Case 1 (協調者 WAIT 超時):** 決定 Abort。因為 2PC 要求全員通過，沒收到回覆即視為失敗。
        *   **Case 2 (參與者 INIT 超時):** 決定 Abort。既然還沒投過票，直接退出是安全的。
        *   **Case 3 (參與者 READY 超時):** 最棘手。參與者已投 Yes 但等不到決策，不可擅自決定（否則可能與他人不一致）。需啟動終止協議詢問他人狀態，若大家都處於 READY 且協調者掛了，會造成系統**同步阻塞**。
    *   **CAP 歸類:** 2PC 是典型的 **CP 系統**。它優先保證原子一致性，但在發生故障（如協調者當機或網路分區）時會犧牲可用性（A）。相較之下，Raft/Paxos 雖也是 CP，但透過「多數決 (Quorum)」顯著提升了可用性與容錯能力。
