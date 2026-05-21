# Outline

> summarized by AI agent

## 1. `L1a.pdf`: 分散式系統概論 (Overview)
作為課程的開場，介紹了分散式系統的基礎知識：
*   **定義**：分散式系統是由一群自主、非同步且易故障的實體（Entities），透過不可靠網路通訊所組成的集合。
*   **核心挑戰**：缺乏全域時鐘（Asynchrony）、組件不可靠（Reliability）、可擴展性（Scalability）及網路延遲。
*   **實例**：從 Client-Server 架構、P2P (BitTorrent) 到現代的雲端資料中心 (AWS)。

## 2. `L1b.pdf`: 分散式原子提交 (Distributed Atomic Commit)
深入探討了確保分散式操作「全有或全無」的協議：
*   **概念**：確保分散式交易中，所有參與節點要麼全部提交（Commit），要麼全部中止（Abort），以維持系統狀態的一致性。
*   **兩階段提交 (2PC)**：詳細說明 Voting 與 Commit 階段，並分析在節點故障或訊息丟失時產生的「阻塞」問題。
*   **三階段提交 (3PC)**：為了解決 2PC 的阻塞問題，引入了預提交 (Precommit) 階段，探討其作為非阻塞協議的條件。

## 3. `L2a.pdf`: 時間與排序 I (Time and Ordering I)
專注於**物理時鐘 (Physical Clocks)** 的同步：
*   **時鐘問題**：解釋了時鐘偏移 (Skew) 與漂移 (Drift) 如何導致分散式系統中的事件排序錯誤。
*   **同步演算法**：介紹了 **Cristian's Algorithm**（利用來回通訊時間 RTT 估算時間）與 **NTP (Network Time Protocol)**（階層式架構）。
*   **侷限性**：強調物理時鐘同步的誤差永遠無法完全消除，這為後續的邏輯時鐘埋下伏筆。

## 4. `L3a.pdf`: 時間與排序 II (Time and Ordering II)
探討如何透過**邏輯時鐘 (Logical Clocks)** 解決分散式系統中的事件排序問題：
*   **因果關係 (Causality)**：介紹「發生在先」(Happens-Before, $\to$) 的概念，建立事件間的偏序 (Partial Order) 而非依賴絕對物理時間。
*   **Lamport 時間戳**：
    *   **演算法**：各程序維護整數計數器，傳送訊息時攜帶戳值，接收時取 (local, msg) + 1��
    *   **特性**：符合因果一致性，但無法區分「併發事件」(Concurrent Events)。
*   **向量時鐘 (Vector Clocks)**：
    *   **演算法**：每個節點維護一個向量，記錄對系統中所有節點已知進度的知識。
    *   **優勢**：透過增加空間開銷，換取識別併發事件的能力，常用於處理資料衝突 (如 Riak)。

## 5. `L4b.pdf`: Gossip 協議 (Gossip Protocols)
介紹了一種具備高擴展性與容錯能力的傳播協議，也稱為流行病協議 (Epidemic Protocols)：
*   **多播 (Multicast) 的挑戰**：傳統的集中式或樹狀結構 (Tree-based) 協議在面對大規模節點或網路故障時，會面臨 (N)$ 的負荷或單點故障問題。
*   **Gossip 機制**：
    *   **推播 (Push)**：節點收到訊息後，隨機挑選 $ 個目標進行傳送。
    *   **拉取 (Pull)**：節點定期向隨機目標詢問是否有新訊息。
    *   **混合式 (Push-Pull)**：結合兩者優點，傳播速度更快。
*   **核心特性**：
    *   **傳播速度**：訊息傳遞至全網的時間約為 (\log N)��
    *   **高容錯性**：即使 50% 的封包遺失或節點故障，訊息仍能以極高機率完成傳播。
    *   **拓撲感知 (Topology-Aware)**：透過優化隨機目標的選擇（優先選擇子網內節點），可有效降低核心路由器的負擔。
*   **實際應用**：包括 Cassandra (維護成員清單)、AWS (傳聞)、Usenet NNTP 及早期分散式資料庫項目。

## 6. `L6.pdf`: 故障偵測與成員協議 II (Failure Detection and Membership II)
接續基礎偵測機制，探討在大規模系統中如何達成高效且準確的故障偵測：
*   **故障偵測器屬性**：權衡完備性 (Completeness, 100% 偵測到故障) 與準確性 (Accuracy, 無誤報)；分析速度 (Speed) 與規模 (Scale) 對系統負載的影響。
*   **SWIM 協議**：
    *   **隨機探測 (Randomized Probing)**：透過隨機挑選節點發送 Ping/Ack，將每名成員的通訊負載 ($L$) 從 $O(N)$ 降至與系統規模無關的常數。
    *   **間接探測 (Indirect Probing)**：當直接 Ping 失敗時，透過 $K$ 個隨機成員轉發 `ping-req`，有效解決因單一鏈路擁塞導致的誤報。
*   **疑心機制 (Suspicion Mechanism)**：
    *   **狀態轉移**：引入「疑心 (Suspected)」中間狀態，避免直接將節點剔除。
    *   **轉世版本號 (Incarnation Number)**：節點透過增加版本號來自我澄清（Alive 覆蓋 Suspect），解決非對稱網路故障下的誤判問題。
*   **傳播優化**：利用感染式散播 (Infection-style Dissemination)，將成員異動資訊豬八戒 (Piggyback) 在探測訊息中，實現低成本的資訊傳遞。

## 7. `L8.pdf`: 分散式快照 (Distributed Snapshots)
探討如何在缺乏全域時鐘的非同步系統中，紀錄系統的全局狀態 (Global State)：
*   **全局快照組成**：包含各個程序的「個別狀態」以及通訊管道中「傳輸中的訊息」。
*   **Chandy-Lamport 演算法**：
    *   **前提假設**：FIFO 通訊管道、可靠傳輸、無節點故障。
    *   **標記訊息 (Marker)**：演算法利用 Marker 來界定快照邊界。發起者紀錄狀態後發送 Marker；接收者首次收到 Marker 時紀錄狀態並轉發，隨後監聽其他管道的傳輸中訊息。
*   **因果一致性 (Causal Correctness)**：
    *   **一致性切面 (Consistent Cut)**：確保快照符合因果關係。若事件 $b$ 已在快照內且 $a \to b$（發生在先），則 $a$ 必也存在於快照中。
*   **正確性屬性分析**：
    *   **安全性 (Safety)**：保證「壞事永不發生」（如無死結、無孤立物件）。
    *   **存活性 (Liveness)**：保證「好事終將發生」（如運算終止、達成共識）。
    *   **穩定屬性 (Stable Properties)**：一旦變為 True 就永不改變的屬性（如死結），可透過此快照演算法有效偵測。

## 8. `elections.pdf`: 選舉演算法 (Election Algorithms)
探討在分散式系統中如何從一組節點中自動選出一個唯一的主導者（Coordinator）：
*   **基本概念與要求**：
    *   **目的**：確保系統中僅有一個節點扮演特定角色（如主伺服器）。
    *   **安全性 (Safety, E1)**：最終選出的節點必須是當時存活且具有最大識別碼（ID）的節點。
    *   **存活性 (Liveness, E2)**：所有存活節點最終都必須選出結果，或者在選出前故障。
*   **環狀選舉演算法 (Ring-based Election)**：
    *   **機制**：節點排列成邏輯環，訊息依順時針傳遞。節點比較訊息中的 ID 與自身 ID，保留較大者繼續傳遞。當 ID 繞行一圈回到發起者時，該 ID 節點即當選。
    *   **特性**：適用於非同步系統，但假設過程中無節點故障。
    *   **效能**：最差情況需 $3N-1$ 條訊息（含結果廣播）。
*   **霸凌演算法 (Bully Algorithm)**：
    *   **機制**：當節點偵測到 Coordinator 故障時發起選舉，向所有 ID 較大的節點發送 `election` 訊息。若無人回應，則自封為王；若有較大節點回應 `answer`，則交由對方接手。
    *   **特性**：支持選舉期間節點故障，但假設系統為同步（需可靠的逾時偵測）。
    *   **優缺點**：
        - **效能**：最佳情況訊息數為 $N-2$（次大 ID 直接當選），最差情況負載達 $O(N^2)$。
        - **風險**：若偵測不準確（Failure Detector 不可靠），可能導致多個 Coordinator 同時存在的安全性問題。

## 9. `L5a.pdf`: 故障偵測與成員協議 I (Failure Detection and Membership I)
探討分散式系統中偵測節點故障的基礎機制：
*   **故障類型**：區分遺漏故障 (Omission)、任意故障 (Arbitrary/Byzantine)、計時故障 (Timing) 及遮蓋故障 (Masking)。
*   **偵測屬性**：定義了完備性 (Completeness) 與準確性 (Accuracy)，並說明在非同步系統中兩者不可兼得。
*   **心跳機制 (Heartbeating)**：
    *   **集中式 (Centralized)**：單一節點收集所有心跳，易產生熱點 (Hotspot)。
    *   **環狀 (Ring)**：心跳依環傳遞，對多點同時故障的適應性較差。
    *   **全對全 (All-to-All)**：每個節點向所有人發送心跳，頻寬開銷大 ($O(N^2)$)。
    *   **Gossip 方式**：隨機挑選節點交換成員清單與心跳計數器，具備良好的擴展性與機率性的準確保證。

## 10. `ddia_raft.pdf`: 共識演算法與 Raft (Consensus and Raft)
摘自 *Designing Data-Intensive Applications* 第 9 章，深入探討分散式共識的理論與實作：
*   **共識的定義**：形式化為一致同意 (Agreement)、完整性 (Integrity)、有效性 (Validity) 與終止性 (Termination)。
*   **共識與全序廣播 (Total Order Broadcast)**：共識等同於實作全序廣播，是資料庫副本同步的關鍵。
*   **代期編號 (Epoch Numbering)**：介紹 Raft 的 **Term**、Paxos 的 **Ballot** 等機制，配合法定人數 (Quorum) 確保在 Leader 切換時的安全性，避免「腦裂」(Split-brain) 問題。
*   **Raft 的挑戰**：討論 Raft 在特定非對稱網路故障下的邊際案例。
*   **實際應用 (Coordination Services)**：分析 ZooKeeper、etcd 如何利用共識演算法提供租約 (Leases)、成員服務與服務發現。

## 11. `time.pdf` & `snapshot.pdf`: 分散式系統的時間與全局狀態 (Time and Global States)
摘自經典教科書 *Distributed Systems: Concepts and Design* (Coulouris) 第 14 章：
*   **物理時間同步**：詳細介紹 **Cristian's Algorithm** (機率性同步)、**Berkeley Algorithm** (Master-Slave 內部同步) 與 **Network Time Protocol (NTP)** (分層架構與統計過濾)。
*   **邏輯時間**：深入探討 **Lamport Clocks** (基於「發生在先」關係的因果排序) 與 **Vector Clocks** (識別併發事件的能力)。
*   **全局狀態紀錄**：
    *   **一致性切面 (Consistent Cuts)**：定義何謂符合因果關係的全局狀態快照。
    *   **Chandy-Lamport 演算法**：利用 Marker 訊息在非同步系統中捕捉一致的快照，用於死結偵測、垃圾回收及終止偵測。
    *   **穩定屬性偵測**：探討如何利用快照評估穩定謂詞 (Stable Predicates)。
