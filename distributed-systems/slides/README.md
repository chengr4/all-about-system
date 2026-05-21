#  Slides Summary

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

## 4. `L3.pdf`: 時間與排序 II (Time and Ordering II)
轉向**邏輯時鐘 (Logical Clocks)**，解決無法依賴物理時間的問題：
*   **因果關係 (Causality)**：定義了 "Happens-before" 關係。
*   **Lamport Timestamps**：一種簡單的整數計數器方法，雖然遵守因果律，但無法辨識「併發事件」(Concurrent Events)。
*   **向量時鐘 (Vector Clocks)**：透過維護時鐘向量，不僅遵守因果律，還能精確判別兩個事件是具有因果關係還是併發發生的。