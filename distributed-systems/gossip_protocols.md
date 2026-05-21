# Gossip Protocols

> AP system: 網路斷開後，節點各自為政，繼續提供服務 => 資料可能不一致 (犧牲了 Consistency)

It is more robust than tree or ring structures; it can automatically bypass failed nodes.

Three Advantages:

1. Lightweight: 不需要維護複雜的連線狀態，節點之間的通訊是基於簡單的消息傳遞。
2. Quick Dissemination: 資訊能迅速傳播到整個系統，特別適合大規模分散式系統。
3. High Fault Tolerance: 即使部分節點失效，資訊仍能通過其他路徑傳播，保持系統的可用性。

總結數學精華：

1. 時間效率：傳遍全網只需要 $O(\log n)$ 回合（因為是指數級擴散）。
2. 空間負載：每個節點每回合只傳給 $b$ 個人（常數負載）。
3. 可靠性：失敗率隨 $n$ 的增加而迅速降低（$1/n^k$）。

## Push vs. Pull

- Push: Faster in the initial stages, but generates many redundant messages in later stages.
- Pull: Super exponential convergence ($O(\log \log n)$) in the later stages.

## Failure Detection

See [Failure Detection](failure_detection.md) for more details.