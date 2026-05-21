# Distributed Systems: Overview

## 分散式系統的定義

分散式系統是由一群 **Entities** 組成的集合，這些實體具有以下特性：
* **自主性 (Autonomous)**
* **可程式化 (Programmable)**
* **非同步性 (Asynchronous)**
* **容易發生故障 (Failure-prone)**
* 透過**不可靠的通訊介質 (Unreliable communication medium)** 進行通訊。

> **實體 (Entity)**：通常指裝置（如 PC、PDA）上的**行程 (Process)**。
> **通訊介質**：有線或無線網路。

### 其他定義觀點
*   **Andrew Tanenbaum**: 一組獨立的電腦，對使用者而言就像是單一電腦。
*   **Michael Schroeder**: 多台電腦共同協作，具備「多台電腦」、「互連」與「共享狀態」三個主要特徵。

---

## 關鍵議題 (Important Issues)

分散式系統在設計上面臨的主要挑戰：

*   **非同步性 (Asynchrony)**：缺乏全域時鐘 (Global clock)，沒有統一的全域時間觀念。
*   **可靠性 (Reliability)**：元件故障不可預測（如網路元件失效、路徑中斷或電腦當機），且缺乏回應可能由多種原因造成。
*   **擴充性 (Scalability)**：需處理數量龐大的主機（從 2 台到數百萬台）。
*   **網路異質性 (Network Heterogeneity)**：頻寬變化劇烈（從 16Kbps 到數 Tbps）。
*   **延遲變異性 (Latency Variability)**：延遲可能從幾毫秒到數秒不等，且極具變動性。

---

## 設計目標 (Design Goals)

*   **異質性 (Heterogeneity)**：系統是否能處理各種類型的電腦與裝置。
*   **強健性 (Robustness)**：系統對於主機當機、故障及網路掉包的復原能力。
*   **可用性 (Availability)**：資料與服務是否始終對用戶端可用。
*   **透明性 (Transparency)**：系統能否對使用者隱藏其內部運作細節（使其看起來像單一系統）。
*   **並行性 (Concurrency)**：伺服器是否能同時處理多個用戶端。
*   **效率 (Efficiency)**：服務速度是否夠快？資源利用率是否達到 100%？
*   **擴充性 (Scalability)**：在節點數量大幅增加時，服務品質是否不會下降。
*   **安全性 (Security)**：系統抵禦網路攻擊的能力。
*   **開放性 (Openness)**：系統是否具備可**擴充性 (Extensible)**。

---

## 系統實例與設計問題

### 常見實例
*   **用戶端-伺服器 (Client-Server)**：如 NFS、Dropbox、Google Drive。
*   **網頁與網際網路 (The Web / Internet)**
*   **雲端運算 (Cloud Computing)**：如 Amazon EC2/S3、Microsoft Azure。
*   **點對點系統 (P2P)**：如 Gnutella、BitTorrent。
*   **分散式帳本 (Distributed Ledger)**：如 Bitcoin。

### 核心設計問題
*   **經典問題**：故障偵測 (Failure detection)、快照 (Snapshots)、多點傳送 (Multicast)、共識 (Consensus)、互斥 (Mutual Exclusion)、選舉 (Election) 等。
*   **並行控制**：RPCs、複寫控制 (Replication Control)、Paxos 等。
