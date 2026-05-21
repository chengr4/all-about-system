# Logs

## 20260512

> #Raft #LeaderElection #LogReplication #Term #StrongLeadership #Safety #DistributedConsensus

1. **Raft 的初始啟動與領導者產生 (Initial Boot & Leader Election)**
    - **初始狀態**：所有伺服器啟動時皆為 `Follower` 狀態。
    - **觸發機制**：若在「選舉超時 (Election Timeout)」內未收到領導者的心跳 (`AppendEntries`)，則轉為 `Candidate` 發起選舉 [Materials: `raft.pdf` p.5]。
    - **多數決原則**：候選人必須獲得**多數 (Majority)** 伺服器的投票才能成為領導者，確保任期內唯一性。

2. **任期 (Term) 的邏輯時鐘作用**
    - **定義**：將時間切割為單調遞增的整數編號。
    - **過時偵測**：伺服器通訊時會交換 `term`。若發現自身任期較小，會立即更新並轉回 `Follower`；若收到過時任期的請求，則直接拒絕 [Materials: `raft.pdf` p.5]。

3. **日誌複製與「強大領導者」原則 (Log Replication & Strong Leadership)**
    - **單向流動**：日誌分錄僅由 `Leader` 流向 `Follower`。領導者從不刪除或覆蓋自己的日誌 [Materials: `raft.pdf` p.16]。
    - **強制一致性**：當跟隨者日誌與領導者衝突時，領導者會透過遞減 `nextIndex` 找到一致點，並**強制覆蓋**跟隨者的衝突部分。
    - **安全性保證**：被覆蓋的分錄保證是「尚未提交 (Uncommitted)」的。Raft 選舉限制確保新領導者必擁有所有已提交的日誌 [Materials: `raft.pdf` p.8]。

4. **日誌提交 (Commitment) 的多數定義**
    - **門檻**：日誌被複製到多數伺服器後即視為 `Committed`。
    - **重疊特性**：利用「任意兩個多數集合必有重疊」的特性，結合選舉限制，保證已提交的數據不會在後續任期被覆蓋。

5. **Raft 的分區與並行性挑戰 (Partition & Concurrency Challenges)**
    - **並行瓶頸**：Raft 核心目標是「正確性」而非「高並行」。強領導者模型、同步 Quorum 等待與序列化執行，使其在單一群組下存在效能上限。
    - **分區的雙重語義**：
        - **網路分區 (Network Partition)**：屬於故障模式（CAP 中的 P）。Raft 透過任期（Term）與多數決機制解決「腦裂」問題。
        - **資料分區 (Data Partitioning)**：屬於擴充手段。透過 **Multi-Raft**（如 TiKV）將資料切片，讓不同分片的 Leader 分散在各節點，達成水平擴充（Horizontal Scalability）。 [Workspace: `data_sharding.md`, `tikv/`]

## 20260506

> #2PC #3PC #SWIM #GossipComplexity #VectorClockLogic #ChristiansAlgorithm #AtomicCommit

1. **2PC 與 3PC 的故障恢復決策 (Atomic Commit Decision Logic)**
    - **2PC 關鍵推論**：若參與者 P 處於 `READY`（已投 Yes）但 Q 處於 `INIT`（未投票），則最終結果**必為 Abort**。因為有人未投票代表協調者不可能發出 Commit 指令 [Workspace: `questions/qa.pdf` p.1]。
    - **3PC 關鍵推論**：若有人處於 `PRECOMMIT` 狀態，代表**全員皆已投贊成票**。此時即使協調者當機，存活節點仍可安全 Commit。

2. **向量時鐘的偏序邏輯 ($<$ vs $\le$)**
    - **嚴格不等式**：$e \to e' \iff V(e) < V(e')$。
    - **是非題陷阱**：若題目給 $V(e) \le V(e')$，則不能推論出 $e \to e'$，因為這包含 $e = e'$ 的情況。根據不可自反性，事件不能發生在自己之前 [Materials: `time.pdf` p.15, `L3a.pdf` p.32]。

3. **SWIM 與 Gossip 的負載複雜度比較**
    - **傳統 Gossip**：失效偵測負載為 $O(N)$，訊息傳播時間為 $O(\log N)$。
    - **SWIM 優化**：透過 **Indirect Ping**，成功將每節點通訊負載降至 **$O(1)$ 常數級別**，且偵測時間期望值與 $N$ 無關。這是達成大規模 Scalability 的核心 [Materials: `L6.pdf` p.15]。

4. **Gossip 的隨機性本質 (Dynamic vs. Fixed Randomness)**
    - **偵測死角**：一開始隨機選 $k$ 個固定鄰居（Modified Ring）會遇到 $k+1$ failure 導致的偵測死角。
    - **強健性來源**：真正的 Gossip 是**每輪重新隨機挑選**目標，這使得通訊路徑是動態生成的雲霧狀，極難被局部失效切斷。

5. **Christian's Algorithm 的符號定義**
    - **$T_{server}$ 的真實意義**：在公式 $T_{set} = T_{server} + RTT/2$ 中，$T_{server}$ 指的是伺服器在回覆封包中寫下的「那一刻」的時間戳記，加 $RTT/2$ 是為了補償回程傳輸的延遲。

## 20260503

> #VectorClocks #AsynchronousSystems #FLPImpossibility #GossipProtocol #LamportTimestamps #SWIM #ChristiansAlgorithm #DistributedSystems

1. **向量時鐘的因果與本地更新 (Vector Clocks: Causality & Local Update)**
    - **判定準則**：$e1 \to e2$ 的必要條件是 $V(e1) < V(e2)$。若向量互不小於等於對方，則為並行 (Concurrent)。
    - **本地遞增原則**：行程 $P_i$ 執行任何事件時，**必須**先遞增其向量戳中對應自己的一格 ($V[i]++$)。這是區分誰是事件發起者的關鍵，也是常見的考點 [Workspace: `questions/Winter2017-midterm.pdf` Q1, Q5]。

2. **非同步系統與 FLP 不可能性 (Asynchronous Systems & FLP)**
    - **非同步定義**：訊息延遲沒有上限 (Unbounded delay)。這導致系統無法區分「節點崩潰」與「網路極慢」。
    - **FLP Impossibility**：在純非同步系統中，即使只有一個行程可能故障，也無法達成確定的共識。
    - **實務意義**：演算法（如 Raft/Paxos）必須放棄「確定的終止性」或引入「時間假設（超時）」來繞過此限制 [Workspace: `questions/Winter2017-midterm.pdf` Q2]。

3. **Gossip 傳播策略之優化 (Gossip: Push vs. Pull)**
    - **後期效能**：在受感染節點超過一半後，**Pull** 機制的效率遠高於 Push。
    - **收斂速度**：Pull 在後期的收斂具有超指數 (Super-exponential) 特性，能大幅縮短達成全網一致的時間 [Workspace: `questions/Winter2017-midterm.pdf` Q4]。

4. **SWIM 協定之準確性權衡 (SWIM: Indirect Pinging & k-parameter)**
    - **間接探測 (Indirect Ping)**：透過隨機挑選 $k$ 個中間人進行探測，利用獨立網路路徑來掩蓋局部鏈路故障，顯著提升偵測準確性 (Accuracy)。
    - **參數 k 的影響**：
        - 增加 $k$：降低誤報率 ($P_{mistake}$)，但會增加每回合的網路訊息負載 ($O(k)$)。
        - 此機制達成了負載與節點總數 $N$ 無關的擴展性 [Workspace: `materials/swim_analysis.pdf`, `questions/Winter2019-Sample-Final.pdf` Q7]。

5. **物理時鐘同步之精度提升 (Christian's Algorithm & Min Latency)**
    - **同步公式**：$T_{set} = T_{server} + RTT/2$。
    - **精度改進**：若已知網路的最小傳輸延遲 $min$，則誤差界限可從 $\pm RTT/2$ 改進為 $\pm (RTT - 2 \cdot min)/2$。這反映了同步品質受限於網路延遲的「隨機抖動」而非固定延遲 [Workspace: `questions/Winter2019-Sample-Final.pdf` Q8a]。

## 20260502

> #FailureDetection #Completeness #Accuracy #RingBased #GossipProtocol #SWIM #PushPullGossip #Reincarnation #DistributedSystems

1. **環狀協議的缺陷與改良 (Ring-based Analysis & Improvement)**
    - **標準環的脆弱性**：標準環狀協議 ($L=1$) 無法處理**連續同時故障 (Simultaneous Consecutive Failures)**。若監控者與受控者同時崩潰，系統將出現偵測死角，打破強完備性 [Workspace: `materials/L5a.pdf` p.21]。
    - **修改版 (Random k Picks)**：隨機挑選 $k$ 個固定對象監控同樣無法保證完備性。若無資訊擴散機制，且隨機抽樣產生「孤兒節點」（無人監控），該節點故障將永遠不被察覺。
    - **多重後繼者環 (Successor List Design)**：若系統保證最多 $f$ 個故障，則每節點監控 **$f+1$ 個後繼者**可達成**保證完備性 (Guaranteed Completeness)** 且具備最小記憶體開銷 ($O(f)$)。此設計確保環在任何合法故障情境下皆不會斷裂。

2. **Gossip 協議中的「重生」防治 ($T_{fail}$ vs. $T_{cleanup}$)**
    - **雙重閾值必要性**：為了防止已判定故障的節點因網路中殘留的舊心跳資訊而**轉世重生 (Reincarnation)**，必須引入 $T_{cleanup}$。
    - **兩倍時間推論 ($T_{cleanup} \approx 2 \times T_{fail}$)**：
        - 第一個 $T_{fail}$：確保最後一個有效心跳有足夠時間擴散至全網。
        - 第二個 $T_{fail}$：確保系統中「最後一個收到心跳的人」也已等足超時時間判定其故障。
        - 只有在全網皆判定故障後，才能安全地將該節點從名單中正式移除 [Workspace: `materials/GossipFD.pdf` p.3]。

3. **Gossip 傳播效率分析 (Push vs. Pull)**
    - **效能特性**：
        - **Push (推播)**：初期（被感染者少）傳播極快；後期（多數人已感染）會產生大量浪費，收斂緩慢。
        - **Pull (拉取)**：後期收斂極快，具備**超指數 (Super-exponential)** 特性，傳播剩餘節點僅需 **$O(\log(\log N))$** 回合。
    - **規模無關性**：證明了即使節點僅持有局部隨機名單 (Partial View)，其傳播效率與持有全域名單 (Full View) 的系統在數學上表現一致，皆為 $O(\log N)$ 回合。

4. **失效偵測屬性的技術衝突 (Completeness vs. Accuracy Trade-off)**
    - **理論限制**：根據 **Chandra and Toueg** 定理，在會掉包的非同步網路中，完美的完備性與準確性是無法同時達成的。
    - **實務偏好**：完備性是「保命錢」（必須保證），準確性是「生活品質」（提供機率性保證）。
    - **現代實務機制**：
        - **SWIM**：利用**間接探測 (Indirect Ping)** 與**疑心機制 (Suspicion)** 解決局部路徑故障導致的誤報。
        - **Phi Accrual**：動態計算 $\phi$ 值，自適應網路抖動（如 Cassandra）。
        - **ZooKeeper/etcd**：利用強一致性共識維護 Session 狀態。

## 20260430

> #ConcurrentEvents #HappensBefore #FailureDetectors #Completeness #Accuracy #HeartbeatProtocols #RingBased #GossipProtocol #Uncertainty #DistributedSystems

1. **並行事件與因果關係 (Concurrent Events & Causality)**
    - **判定準則**：利用 Lamport 的「發生於其前 ($\to$)」關係。若 $a \not\to b$ 且 $b \not\to a$，則 $a$ 與 $b$ 為並行 ($a || b$)。
    - **時序圖分析**：透過追蹤行程內順序（向右）與訊息箭頭路徑。若兩事件間不存在任何單向路徑連結，則兩者無因果關係 [Workspace: `questions/ProblemSet-Time-and-Ordering.pdf` Q1, `materials/L3a.pdf`]。

2. **失效偵測的不確定性與屬性權衡 (Uncertainty & Trade-offs)**
    - **不確定性根源**：在非同步系統中，由於訊息傳遞無時間上限，無法區分「行程崩潰」與「網路延遲/丟包」。
    - **完備性 (Completeness)**：保證所有故障節點最終被偵測。實務上要求 **Guarantee always**，以免系統狀態卡死。
    - **準確性 (Accuracy)**：避免誤報。在不可靠網路中僅能提供 **Probabilistic guarantee**。
    - **設計直覺**：失效偵測器是在「寧可錯殺 (犧牲 Accuracy)」與「反應速度 (Speed)」之間做取捨。超時時間越短，Speed 越快，但 Accuracy 就會下降 [Workspace: `materials/L5a.pdf`, `materials/L6.pdf`, `materials/failure_model.pdf`]。

3. **心跳協議分析：Ring-Based vs. Gossip**
    - **環狀心跳 (Ring-Based)**：每個節點只監控後繼者，負載維持在極低的 $O(1)$，不隨 $N$ 增加。但弱點在於多個連續節點失效時，偵測速度會大幅變慢且環重建複雜。
    - **Gossip 故障偵測**：透過 $O(\log N)$ 時間的資訊擴散彌補隨機監控的不足。
    - **雙門檻機制 ($T_{fail}, T_{cleanup}$)**：緩衝時間設計有效防止失效資訊回流導致的「誤判復活」，提升系統強健性 [Workspace: `materials/L5a.pdf` p.21, 26-28, `materials/L6.pdf` p.26]。

## 20260428

> #FailureDetection #SWIM #ChandyLamport #ConsistentCuts #ElectionAlgorithms #BullyAlgorithm #GossipProtocol #ZooKeeper #Znode #SessionMechanism

1. **高效故障偵測：SWIM 協議與疑心機制**
    - **SWIM 核心**：透過隨機探測 (Randomized Probing) 將每名成員的通訊負載維持在 $O(1)$ 常數，並利用間接探測 (Indirect Ping) 克服單一網路路徑故障的誤報。
    - **疑心機制 (Suspicion)**：引入 `Suspected` 狀態。當節點被懷疑時，它有機會透過增加 `Incarnation Number`（轉世版本號）來「自我澄清」為 Alive，有效降低非對稱網路故障導致的誤判。資訊透過 Piggyback 在探測訊息中快速傳播 [Workspace: `materials/L6.pdf`]。

2. **全局快照與因果正確性 (Chandy-Lamport)**
    - **機制**：利用 **Marker** 訊息界定快照邊界，捕捉「程序狀態」與「通道中傳輸的訊息」。
    - **一致性切面 (Consistent Cut)**：快照必須遵守因果關係。若事件 $b$ 在快照內且 $a \to b$，則 $a$ 必也在快照內。這確保了快照在邏輯上是可能的。
    - **穩定屬性偵測**：快照主要用於偵測「一旦發生就不會改變」的屬性（Stable Properties），如死結偵測、終止偵測與垃圾回收 [Workspace: `materials/L8.pdf`]。

3. **選舉演算法：Ring vs. Bully**
    - **環狀演算法 (Ring-based)**：適合非同步系統，訊息繞行一圈定勝負。最差週轉時間為 $3N-1$，但完全不容許節點故障。
    - **霸凌演算法 (Bully)**：適合同步系統。高 ID 節點透過挑戰 (Election) 與壓制 (Answer) 來取得領導權。最佳情況訊息數僅為 $N-2$，但最差情況負載達 $O(N^2)$。其安全性高度依賴可靠的超時偵測 [Workspace: `materials/elections.pdf`]。

4. **Apache ZooKeeper：Znode 與工作階段 (Session)**
    - **Znode 模型**：共享的樹狀數據結構。**Ephemeral (臨時)** 節點是實現故障偵測與選舉的關鍵，其生命週期與 Session 綁定。
    - **自動刪除機制**：由 ZooKeeper 伺服器主動維護。Server 透過心跳監控客戶端，一旦 Session 超時，伺服器會主動清理相關的 Ephemeral Znode。
    - **Watch 模式**：取代輪詢 (Polling)，讓行程在環境變動時能主動收到通知。

## 20260425

> #LamportTimestamps #VectorClocks #Causality #LogicalClocks #InductionProof #DistributedSystems

1. **蘭伯特時間戳記與因果鏈證明 (Lamport Timestamps & Induction)**
    - **因果關係 ($\to$)**：基於 HB1 (同一行程)、HB2 (訊息傳遞) 及 HB3 (遞移性) 定義 [Workspace: `materials/time.pdf` p.12]。
    - **更新順序的重要性**：接收訊息時必須「先取 $\max$ 同步，再執行 $+1$」。若順序顛倒，接收事件與發送事件的時間戳記可能相同，違反 $L(e) < L(e')$ 的嚴格遞增原則 [Workspace: `materials/time.pdf` p.13]。
    - **歸納法證明 (Induction on Path Length)**：
        - **基礎步驟 ($n=1$)**：直接符合 HB1 或 HB2，由 LC1/LC2 規則得 $L(e) < L(e')$。
        - **歸納步驟**：假設長度 $k$ 成立 ($L(e) \le L(e_k)$)，利用最後一步 $L(e_k) < L(e_{k+1})$ 的遞移性，證明長度 $k+1$ 亦滿足 $L(e) \le L(e_{k+1})$ [Workspace: `questions/ProblemSet-Time-and-Ordering.pdf` Q4]。

2. **向量時鐘的權威性與資訊傳播 (Vector Clocks & Information Flow)**
    - **所有權 (Ownership)**：系統中僅有行程 $P_i$ 擁有增加其對應向量分量 $V[i]$ 的權限 (VC2)。
    - **同步機制 (Propagation)**：其餘行程 $P_j$ 僅能透過接收訊息並執行 $\max$ 運算 (VC4) 來更新 $V_j[i]$。
    - **證明 $V_j[i] \le V_i[i]$**：由於 $P_i$ 是唯一增量來源，且資訊傳播具備滯後性，其他行程所知悉的 $V_j[i]$ 永遠是 $P_i$ 過去某個時間點的快照，故 $V_j[i] \le V_i[i]$ 恆成立 [Workspace: `clocks.md`, `materials/time.pdf` p.14-15, `questions/ProblemSet-Time-and-Ordering.pdf` Q5]。

3. **向量時鐘的物理意義**
    - **$V_i[i]$**：行程 $P_i$ 自身發生的本地事件總數。
    - **$V_j[i]$**：行程 $P_j$ 對於 $P_i$ 已經發生事件數量的「知識」或「觀察值」。

## 20260423

> #GlobalSnapshot #ChandyLamport #ConsistentCut #StateProperty #DistributedDebugging #Checkpointing #ClockSync #CristiansAlgorithm #MinLatency

1. **全域快照的核心目標 (Goal of Global Snapshot)**
    *   **觀測者困境**：在沒有全域時鐘且系統持續運行的情況下，捕捉一個「邏輯上一致」的全域狀態（行程狀態 + 通道狀態）。
    *   **解決問題**：防止快照中出現「錢憑空消失或重複」的邏輯錯誤。應用於死結偵測、終止偵測及系統備份恢復 (Checkpointing) [Workspace: `materials/snapshot.pdf` p.611, 615]。

2. **一致性切面 (Consistent Cut)**
    *   **定義**：若事件 $e$ 在切面內且 $f \to e$（$f$ 因果先於 $e$），則 $f$ 必須在切面內。
    *   **直觀準則**：不允許出現「無因之果」，即切面不能包含「訊息的接收」卻不包含該訊息的「發送」 [Workspace: `materials/snapshot.pdf` p.613-614]。

3. **Chandy-Lamport 演算法機制 (The Marker Rule)**
    *   **前提**：需滿足 FIFO 通道、可靠傳輸及強連結網路。
    *   **標記訊息 (Marker)**：充當邏輯分界線，區分「快照前」與「快照後」的訊息。
    *   **核心規則**：
        - **發起/首次接收**：行程記錄自身狀態 $\to$ 向所有輸出通道發送 Marker $\to$ 開始記錄（錄音）其他輸入通道在收到 Marker 前抵達的訊息。
        - **重複接收**：收到來自通道 $c$ 的 Marker $\to$ 停止記錄 $c$ $\to$ 這段時間「錄到」的訊息即為該通道的狀態 [Workspace: `materials/snapshot.pdf` p.616]。

4. **狀態屬性的穩定性 (Stability of State Properties)**
    *   **穩定屬性 (Stable)**：一旦變為 True 就不會再變回 False（如死結、終止、垃圾回收）。Snapshot 演算法是偵測穩定屬性的利器。
    *   **非穩定屬性 (Non-stable)**：狀態會隨時間變動（如變數差值、瞬時流量）。這類屬性僅靠單次快照可能無法捕捉，需透過更複雜的分散式除錯技術處理 [Workspace: `materials/snapshot.pdf` p.614, 619]。

5. **時鐘同步的分類與邊界 (Clock Sync: Types & Bound)**
    *   **外部同步 (External)**：對齊外部權威時鐘源 $S$ (如 UTC)。滿足 $|C_i(t) - S| < D$。確保系統時間與現實標準一致。
    *   **內部同步 (Internal)**：僅要求系統內行程彼此對齊。滿足 $|C_i(t) - C_j(t)| < D$。不保證與外界時間一致。
    *   **同步邊界 (D)**：演算法保證的最大容許誤差。
        - 關係：外部同步 (D) $\implies$ 內部同步 (2D)；但內部同步不保證外部同步，系統可能集體漂移 (Drift away)。
        - 實例：NTP 在 LAN ($D < 1ms$) 優於 Internet ($D \approx 50ms$) [Workspace: `materials/time.pdf` p.9-10]。

6. **Cristian’s Algorithm 與最小延遲 (Cristian’s Algorithm & Min Latency)**
    *   **核心機制**：客戶端 $P$ 向時間伺服器 $S$ 請求時間 $t$，並測量往返時間 $RTT$。
    *   **數學推導**：
        - 伺服器真實時間區間：$[t + min_2, \ t + RTT - min_1]$。
        - **設定公式 (中點)**：$T_{set} = t + \frac{RTT + min_2 - min_1}{2}$。目的是將時鐘設在可能區間的正中央以極小化誤差。
        - **最大誤差 (Error Bound)**：$\pm \frac{RTT - min_1 - min_2}{2}$。
    *   **物理意義**：誤差取決於網路的「隨機延遲」（$RTT$ 扣除物理極限 $min_1+min_2$ 之後的部分）。
    *   **重要性**：處理非對稱網路延遲，並提供可量化的同步品質指標。若誤差過大，系統可決定捨棄該次測量並重試 [Workspace: `materials/L2a.pdf` p.15-17]。

>

## 20260421

> #ElectionAlgorithms #BullyAlgorithm #RingAlgorithm #GossipProtocol #Decentralization #ClockSynchronization #CristiansAlgorithm #Monotonicity

1. **選舉演算法的核心目標 (Goals of Election Algorithms)**
    *   **唯一性角色**：在分散式系統中挑選出一個唯一的進程擔任特定角色（如協調者或 Leader），以避免「腦裂」(Split-brain) 導致的資料不一致。
    *   **安全性 (Safety, E1)**：參與者最終認可的當選者必須是唯一的，且具備最大的標識符 (Identifier)。
    *   **存活性 (Liveness, E2)**：除非進程崩潰，否則所有進程最終都必須參與並完成選舉。

2. **經典演算法對比 (Ring-based vs. Bully)**
    *   **環狀選舉 (Ring-based)**：訊息沿邏輯環單向傳遞。訊息複雜度為 $3N-1$。優點是邏輯簡單，缺點是完全不具備容錯性，任何節點失效都會導致選舉中斷 [Workspace: `materials/elections.pdf` p.643]。
    *   **強者演算法 (Bully Algorithm)**：基於「大 ID 欺負小 ID」的邏輯。假設系統為同步且訊息可靠。最好情況訊息量 $N-2$，最壞情況 $O(N^2)$。風險在於若超時偵測不準（非同步系統）或進程重啟，可能導致多個 Leader 同時存在的安全性違規 [Workspace: `materials/elections.pdf` p.645]。

3. **時鐘單調性與調整 (Clock Monotonicity & Slewing)**
    *   **單調性原則**：分散式系統中，時鐘絕不可回撥 (Backwards)，否則會破壞事件因果順序（如 `make` 工具誤判）。
    *   **時鐘微調 (Slewing)**：若發現時鐘偏快，應透過「調慢軟體時鐘運行速率」讓實際時間追上，而非直接跳轉，確保時間永遠單向遞增 [Workspace: `materials/L2a.pdf` p.18]。

4. **Cristian's 演算法的精確度分析**
    *   **數據選擇**：應從多組測量中選擇 **RTT 最短** 的一組，因為 RTT 直接決定了誤差的上界。
    *   **精確度公式**：
        - 若 $min$（最小傳輸延遲）未知，誤差為 $\pm RTT/2$。
        - 若 $min$ 已知，誤差縮減為 $\pm (RTT/2 - min)$。
    *   **設定公式**：$T_{set} = T_{server} + RTT/2$ [Workspace: `questions/ProblemSet-Time-and-Ordering.pdf` Q2]。

5. **中心化 vs. 去中心化 (Election vs. Gossip)**
    *   **協調者的必要性**：對於需要「強一致性」或「排他性決策」的任務（如 Raft 中的日誌寫入），必須透過選舉產生唯一的協調者。
    *   **Gossip 的哲學**：如 `memberlist` 所採用的 Gossip 協定，本質上是去中心化且平等的。它不依賴協調者，而是透過隨機通訊達成「最終一致性」，適用於擴展性要求高且容許暫時不一致的場景（如成員清單維護）。
    *   **混合模式**：現代系統（如 `TiKV`）常結合兩者——使用 Gossip 進行高效的成員偵測 (Membership)，並在活耀節點中透過選舉產生 Leader 進行資料管理。

## 20260417

> #2PC #3PC #AtomicCommit #Blocking #RecoveryAnalysis #NonBlocking

1. **2PC 失效恢復分析 (Recovery Analysis in 2PC)**
    *   **場景**：參與者 P 重啟後處於 `READY` 狀態，詢問參與者 Q 發現其處於 `INIT`。
    *   **決策**：P 應決定 **ABORT**。
    *   **邏輯**：在 2PC 中，Global Commit 的唯一前提是全員投 `Yes`。既然 Q 還在 `INIT`（尚未投票），代表協調者絕對不可能發出過 Commit 指令。為了維護原子性，中止事務是安全且一致的選擇。

2. **2PC 的核心缺陷：同步阻塞 (Blocking)**
    *   **不確定狀態 (Uncertainty)**：當參與者投下 `Yes` 並進入 `READY` 後，若協調者與其他參與者同時故障，存活的節點無法判斷最終決策。
    *   **資源卡死**：由於不可擅自行動（以免違反原子性），參與者必須持續持有資源鎖並等待故障節點恢復，這會導致系統在發生分區或連環故障時失去可用性。

3. **3PC 的演進與非阻塞設計 (Non-blocking)**
    *   **核心改進**：引入 **Pre-Commit** 階段作為緩衝。
    *   **提交證明 (Commit Certificate)**：一旦有節點進入 `Pre-Commit`，即代表「全員投票通過」的事實已被記錄。
    *   **終止協議 (Termination Protocol)**：在協調者故障時，存活節點可透過互相詢問狀態達成共識（例如：若有人在 `Pre-Commit` 則全體 `Commit`），有效解除 2PC 的同步阻塞問題。

## 20260416

> #FailureModels #ByzantineFault #FaultTolerance #MembershipService #Scalability #Masking

1. **故障模型與掩蓋技術 (Failure Models & Masking)**
    *   **遺漏故障 (Omission Failure)**：組件未能執行預期動作（如 Crash, Send/Receive Omission）。表現為「沈默」，通常透過超時機制偵測。
    *   **任意故障 (Arbitrary/Byzantine Failure)**：組件行為偏離規範，包括傳送錯誤資訊或不一致的訊息（說謊）。這是最嚴重的模型，需共識演算法（如 BFT）處理。
    *   **掩蓋故障 (Masking)**：透過**資訊冗餘**（糾刪碼）、**資源冗餘**（多副本/Raft）或**時間冗餘**（重試）讓故障對外部透明，達成容錯 [Workspace: `/rockraft/`, `/tikv/`]。

2. **群組成員服務 (Group Membership Service)**
    *   **成員清單 (Membership List)**：節點本地維護的狀態清單（通訊錄）[Workspace: `/memberlist/state.go`]。
    *   **成員服務**：負責節點生命週期管理（Join, Leave, Failure Detection, Dissemination）。
    *   **一致性權衡**：Raft 模式提供強一致成員變更（CP）；Gossip 模式（如 SWIM）提供具備高度擴展性的最終一致性（AP）[Workspace: `/gossip_protocols.md`]。

3. **故障偵測器的四項屬性 (4 Properties of Failure Detectors)**
    *   **完備性 (Completeness)**：每個故障節點最終都必須被偵測到。
    *   **準確性 (Accuracy)**：不產生誤判（False Positives），通常透過 Suspicion 機制提升。
    *   **速度 (Speed)**：從故障發生到被偵測的延遲時間。
    *   **可擴展性 (Scale)**：當叢集擴大時，節點負載應維持在 $O(1)$ 或 $O(\log n)$ [Workspace: `/summary.md` L111]。

4. **心跳偵測架構對比 (Heartbeating Strategies)**
    *   **集中式 (Centralized)**：$O(n)$ 負擔集中於 Master，具 SPOF 風險。
    *   **全對全 (All-to-All)**：$O(n^2)$ 通訊量，準確且快但不具擴展性。
    *   **Gossip/SWIM**：$O(1)$ 恆定負擔，透過隨機探測與間接探測（Indirect Ping）掩蓋網路路徑故障，兼顧擴展性與可靠度。

5. **分散式原子提交協議 (Distributed Atomic Commit Protocols)**
    *   **1PC 的局限性**：缺乏「投票」機制，協調者盲目下令。參與者若因本地因素（如死結處理、當機重啟後狀態遺失）無法執行，會導致系統狀態不一致，違反原子性。
    *   **2PC 的核心改進**：
        *   **投票與片面中止 (Voting & Unilateral Abort)**：引入第一階段詢問，賦予參與者拒絕權。
        *   **準備狀態與持久化 (Prepared State & Persistence)**：要求參與者在投 `Yes` 前將變更與狀態寫入**永久儲存**。這確保了即使節點在投票後當機，重啟後仍能根據日誌完成最終決定，保證「全有或全無」的一致性 [Workspace: `atomic_commit_protocol.pdf` p.731]。

## 20260414

> #GossipProtocol #EpidemicAlgorithms #Multicast #Scalability #FaultTolerance #SWIM

1. **Gossip 協議 (流言協議) 的運作機制**
    *   **傳播模型**：模仿流行病傳播 (Epidemic)，節點定期隨機挑選 $b$ 個對象交換資訊。
    *   **三種模式**：
        *   **Push**：發送者主動推播，初期擴散極快。
        *   **Pull**：接收者主動詢問，後期掃除死角效率極高（具備「超指數」收斂特性 $p_{i+1} = p_i^{k+1}$）。
        *   **Push-Pull**：結合兩者優點，兼顧擴散速度與最終一致性的可靠度。

2. **數學原理與可擴展性分析**
    *   **傳播速度**：在 $n$ 個節點的系統中，訊息傳遍全網的時間複雜度為 $O(\log n)$。這代表系統規模擴大時延遲增加緩慢，具備優異的可擴展性。
    *   **高可靠與容錯**：數學證明遺失率隨隨機目標數 $b$ 呈冪次方下降 ($1/n^{cb-2}$)。即使面臨 50% 節點故障 or 封包遺失，系統仍能達成極高機率的傳播成功率。
    *   **拓撲感知 (Topology-Aware)**：透過調整目標選擇機率（優先選擇同子網節點），將核心路由器的負荷從 $O(n)$ 降至 $O(1)$，優化網路效能。

3. **學術貢獻與工業實踐**
    *   **SWIM 協定**：由 Indy Gupta 教授提出，將故障偵測與成員管理訊息搭載 (Piggyback) 在 Gossip 封包中，使每節點通訊負載保持在常數級別。
    *   **應用實例**：
        *   **Cassandra / DynamoDB**：維護叢集成員狀態與故障偵測。
        *   **Consul (Memberlist)**：服務發現與健康檢查的核心引擎。
        *   **Bitcoin**：用於區塊與交易資訊在 P2P 網路中的擴散。

## 20260409

> #VectorClock #Causality #Concurrency #LogicalClock #ConflictResolution

1. **向量時鐘 (Vector Clocks) 的運作與更新邏輯**
    *   **結構與意義**：每個行程 $i$ 維護一個長度為 $N$ 的向量 $V_i$。$V_i[j]$ 代表行程 $i$ 對行程 $j$ 發生事件數量的「知識」。
    *   **更新規則**：
        *   **本地/發送事件**：行程僅遞增屬於自己的索引值 ($V_i[i] = V_i[i] + 1$)。
        *   **接收事件**：行程先遞增自己的索引（視為一個新的本地接收事件），再針對其他行程的索引取 $V_i[j] = \max(V_{message}[j], V_i[j])$ 來同步全局進度。
    *   **權威性原則**：接收時自己的索引不需要取 `max`，因為行程 $i$ 是其自身計數器的唯一權威來源，任何訊息傳回來的 $V[i]$ 都不可能超過行程 $i$ 當前的進度。

2. **精確的因果與並行判定**
    *   **因果相關 (Causally Related)**：若 $VT_1 < VT_2$（定義為所有維度皆 $\le$ 且至少一維度 $<$），則代表 $E_1 \to E_2$。
    *   **並行 (Concurrent)**：若兩者互不小於等於對方（即 $VT_1$ 與 $VT_2$ 各自在某些維度領先），則判定為並行事件 ($E_1 ||| E_2$)。
    *   **設計權衡**：相較於蘭伯特時鐘，向量時鐘透過 $O(N)$ 的空間開銷，換取了「從時間戳記直接推導出事件是否並行」的能力，這在處理分散式資料衝突（如 Riak, Dynamo）時是不可或缺的工具。

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
