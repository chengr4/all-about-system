# Clocks

## Physical Clocks

### Cristian's Algorithm

min_1 = 10 ms
min_2 = 12 ms
RTT = 50 ms

### NTP (Network Time Protocol)

1. Message 1 (Parent -> Child)：
    * Parent 在時間 $ts1$ 發送訊息。
    * Child 在時間 $tr1$ 接收訊息。
2. Message 2 (Child -> Parent)：
    * Child 在時間 $ts2$ 發送訊息。
    * Parent 在時間 $tr2$ 接收訊息。

$Offset = ((tr1 - ts1) + (ts2 - tr2)) / 2$

Real Offset = $(tr1 - ts1 + ts2 - tr2) / 2 + (L2 - L1) / 2$
$\Rightarrow = Offset + (L2 - L1)/ 2$ 

重點：估計出的偏移量 (o) 與 真實偏移量 (oreal) 之間的誤差，最大不會超過往返時間 (RTT) 的一半。

## Logical Clocks

在分散式系統中，各個節點的實體時鐘很難達到完美同步。為了排序不同節點間的事件，我們改用 「因果關係」（Causality） 來定義時間。換言之，如果事件 A 導致了事件 B，那 A 必定發生在 B 之前。

Happened-before relation. 3 rules:

1. 同一行程內的事件：如果事件 A 在事件 B 之前發生，則 A happened-before B。
2. 訊息傳遞：如果事件 A 是一個行程發送訊息，事件 B 是另一行程接收該訊息，則 A happened-before B。
3. 傳遞性：如果 A happened-before B，且 B happened-before C，則 A happened-before C。

### Lamport Timestamps

- 每個行程維護一個初始為 0 的計數器。
- 發生本地事件或傳送訊息時，計數器 +1
- 接收訊息時：將本地計數器更新為 max(本地計數器, 訊息中的時間戳記) + 1
- 優點：簡單易實現，能夠確保因果關係的正確排序。佔用空間小 $O(1)$
- 缺點：無法區分並行事件。如果看到兩個事件的時間戳記分別是 2 和 3，你無法確定它們是有因果關係，還是只是剛好數字不同但實際上是並行產生的。

### Vector Clocks

- 每個行程維護一個向量，大小等於系統中行程的數量。
- 缺點：佔用空間大 $O(N)$

