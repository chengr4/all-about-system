# Cache

- SRAM memory cells require more transistors per bit than DRAM
- Usable data capacity (i.e. cache size) = Number of blocks * Block size
- Each cell is one bit made of 6 transistors

## Principle of Locality

- Temporal locality (Same):
    - Items accessed recently are likely to be accessed again soon
    - e.g., instructions in a loop, induction variables
- Spatial locality (Nearby):
    - Items near those accessed recently are likely to be accessed soon
    - e.g., array accesses, sequential instruction execution

## Write Policies

- Write-through: CPU 每次更新 Cache 的同時，也立刻把資料寫入主記憶體。
    - Cons: 較慢，因為每次寫入都需要等待主記憶體的確認。
    - Solution: 使用 Write Buffer
- Write-back: CPU 只更新 Cache，只有在 Cache 行被替換時才寫回主記憶體。
    - Extra dirty bit
    - Pro: WB can reduce miss penalties for stores
    - Con: WB has a more complex implementation
- Write allocation: 當發生寫入失敗 (write miss) 時，先把資料從主記憶體載入 Cache，再進行寫入。
    - Fetch on write (into cache): ususally used with write-back
    - Write around (directly to memory): usually used with write-through

> dirty bit: 標記該 Cache 行是否被修改過。

## Replacement Policies

- In both RAND and LRU, if one of the entries in the set has V==0 it is chosen to be replaced.
- LRU requires additional state to be stored in cache lines.

