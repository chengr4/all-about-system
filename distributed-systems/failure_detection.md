# Failure Detection

在分散式系統中，我們無法區分 Process Crash 與 Network Delay。在 Asynchronous system 中，因為沒有訊息傳遞的時間上限，當行程 $p$ 沒有收到行程 $q$ 的回應時，可能原因有:

1. $q$ crashed
2. $q$ is normal but the network is slow (Omission Failure)
3. $q$ is slow or running Garbage Collection (Timing Failure)

1. Dectect Failure
    - Completeness: 當一個行程故障時，系統中「每一個」正常的行程「最終」都能偵測到它故障了。
    - Accuracy: 沒有任何正常的行程會被誤認為故障（即無誤報、無 False Positive）。
    - Speed
    - Scalability: members * messages

> 在 Lossy Networks 中，同時達到完美的 Completeness 與完美的 Accuracy 是不可能的。
> => 設定的 Timeout 越短，反應越快（Speed），但你冤枉好人的次數就會越多（Accuracy 變差）

- Centralized Heartbeating
- Ring-Based Heartbeating
    - cannot detect simultaneous multiple failures
- All-to-All Heartbeating

## SWIM

核心哲學：功能分離 (Separation of Concerns)

傳統的 Heartbeating 會把故障偵測與資訊傳播綁在一起（大家都要發心跳給所有人），導致網路負載隨節點數 $N$ 呈平方等級 ($O(N^2)$) 增加。

SWIM 的做法：將這兩個組件完全分開

* 故障偵測組件：負責找出誰掛了。 (Random Probing)
    - Direct Ping: $p_i$ 傳送 `ping` 給 $p_j$，若收到 ack 則代表正常。
    - Indirect Ping: 如果 $p_j$ 沒回傳，$p_i$ 會隨機找 $k$ 個中間人傳送 ping-req(pj)。
* 資訊傳播組件：負責把「誰掛了」或「誰加入了」的訊息傳遍全網。
    - Piggybacking：將變動資訊 piggyback 在故障偵測組件的 ping 或 ack 封包中。
    - Advantage: 訊息量是常數，負載極低。
    - 訊息擴散到全網的速度是 $O(\log N)$。

### Suspicion and Incarnation Mumber

- Suspected 狀態：探測失敗後，不直接判死，而是標記為 Suspected 並傳播出去。
- 反駁權 (Refutation)：如果 $p_j$ 其實沒死，只是慢了，當它收到別人懷疑它的訊息時，它可以發布一個 Alive 訊息來「洗清嫌疑」。
- Incarnation Number
     - A unique number for each node
     - Only the node itself can increase its own incarnation number
     - Bigger incarnation number will always win over smaller one.

## Gossip-style Heartbeating

- 每個節點僅隨機挑選 $k$ 個對象（$k$ 為常數），負載為 $O(1)$。透過訊息擴散達成最終一致性。
- $T_{fail}$: 有兩層意義
    1. 對於節點 $p_i$，當 $p_i$ 沒有收到 $p_j$ 的回應超過 $T_{fail}$ 時，$p_i$ 就會認定 $p_j$ 已經失效了。（我判定你死了）
    2. 我們心裡預期的是，在正常情況下，一個心跳訊息有能在 $T_{fail}$ 時間內傳遍全網。
- $T_{cleanup} = 2 \times T_{fail}$

> With probability $P_{fail}$, every other member will have heard $B$’s last heartbeat by $t+T_{fail}$, and so every process will fail $B$ by time $t+2 \times T_{fail}$.

## ALL-to-ALL Heartbeating

Load = 

## Ring-Based Heartbeating

- 節省通訊負擔
- 

## References

- Couloris Chapter 2.4.2, 15.1
    - coord_agre_intro.pdf
    - failure_model.pdf
