# Elections

> 我們通常需要 Leaders，因為 Gossip 會很慢，且在某些情況下需要一個權威來做決策。

> 只要系統面臨「誰說了算？」的爭議時，就是選舉演算法登場的時刻。

目的：在分散式系統中挑選出一個唯一的行程來擔任特定角色 (Coordinator)。

Basic Requirements:

1. Safety: 在任何時刻，最多只能有一個行程被選為協調者。
2. Liveness: 最終必須選出一個協調者，且所有非故障行程都能同意這個選擇。

## Ring-based Election Algorithm

- 當 ID 繞回到原發起者時，該行程即當選為協調者。
- No tolerance for failures

### Performance 

- Best Case: ID 最大的節點主動發起選舉，只需 $2N$ 條訊息。
- Worse case: $3N-1$ 條訊息。(它的逆時針鄰居恰好是 ID 最大的節點)
- 週轉時間（Turnaround time）也是 $3N-1$。

## Bully Algorithm

- Assumptions: 系統是同步的，使用超時來偵測崩潰，且訊息傳遞可靠。
- Machanism: ID 較大的行程會「欺負」ID 較小的行程。
- Performance: $N-2$ 條訊息 (Best case)。 Worst case: $O(N^2)$。
- good for a strong and useful node

## References

- [Couloris Chapter 15.3](slides/elections.pdf)
