# Distributed Systems: Midterm Mock Exam (English Version)

## 2026 年期中考範圍

- 2-Phase Commit/3-Phase Commit
- `clock.md`
- Gossip protocol
- SWIM
- Faileure Detection

## Part I: Fast Problems (Multiple Choice & True/False)

**1. (2 pts) [True/False] In a system using Vector Clocks, if we observe two events $e$ and $e'$ such that their timestamps satisfy $V(e) \le V(e')$, we can conclude with 100% certainty that $e \to e'$ (e happened-before e').**
*   **Answer:** **False**. 
*   **Reasoning:** The relation $\le$ includes the case where $V(e) = V(e')$, which implies $e = e'$. According to the property of irreflexivity in partial ordering, an event cannot happen before itself. The correct condition for $e \to e'$ is the strict inequality $V(e) < V(e')$.

**2. (2 pts) In an asynchronous distributed system with $N$ processes, what is the expected time complexity for a piece of information to be disseminated to all nodes using a Gossip protocol?**
A. $O(1)$  
B. $O(\log N)$  
C. $O(N)$  
D. $O(N \log N)$  
*   **Answer:** **B**. Gossip follows an exponential growth model, reaching all nodes in logarithmic rounds.

**3. (2 pts) Which of the following is a primary advantage of the SWIM protocol over traditional Gossip-style Heartbeating for failure detection?**
A. It achieves 100% accuracy in lossy networks.  
B. It reduces the per-node communication load from $O(N)$ to $O(1)$.  
C. It eliminates the need for timeouts.  
D. It guarantees that a failure is detected in exactly 1 round.  
*   **Answer:** **B**. SWIM’s constant load ($O(1)$) makes it highly scalable for large datacenters.

---

## Part II: Clock Synchronization & Logic

**4. (5 pts) Christian's Algorithm Calculation**
A client synchronizes with a time server and measures a Round-Trip Time ($RTT$) of **40ms**. The server's timestamp in the response is `10:00:00.500`.
(a) What time should the client set its clock to?
(b) If the minimum one-way transmission delay ($min$) is known to be **12ms**, what is the estimated accuracy (error bound) of this synchronization?
*   **Answer:**
    *   (a) $T_{set} = T_{server} + RTT/2 = 10:00:00.500 + 20ms =$ **`10:00:00.520`**.
    *   (b) $Accuracy = \pm (RTT - 2 \cdot min) / 2 = \pm (40 - 24) / 2 =$ **`± 8ms`**.

**5. (5 pts) 2-Phase Commit (2PC) Failure Analysis**
Participant $P_1$ crashes and reboots. Upon waking up, $P_1$ finds its log indicates it is in the `READY` state. $P_1$ queries participant $P_2$ for its status, and $P_2$ replies that it is in the `INIT` state.
*   **Question:** Should $P_1$ commit or abort the transaction? Explain your reasoning.
*   **Answer:** **Abort**. 
*   **Reasoning:** If $P_2$ is in the `INIT` state, it means $P_2$ has not yet voted. Since a Global Commit requires a unanimous "Yes" vote from **all** participants, the Coordinator could not have reached a decision to commit. Therefore, it is safe and necessary to abort to maintain atomicity.

---

## Part III: Mechanism & Short Answer

**6. (5 pts) The "Ghosting" (Resurrection) Problem**
In Gossip-based membership protocols, why is it necessary to maintain two distinct timeouts, $T_{fail}$ and $T_{cleanup}$, where $T_{cleanup}$ is typically $2 \times T_{fail}$?
*   **Key Answer Points:** To prevent a failed node from "resurrecting" in the membership list. If a node is deleted immediately after $T_{fail}$, stale heartbeat messages still circulating in the network might be received by other nodes, causing them to re-add the failed node as "Alive." $T_{cleanup}$ acts as a buffer to ensure the failure information propagates to everyone before the record is fully purged.

**7. (5 pts) Robustness of Gossip vs. Ring-based Detection**
Explain why a Gossip protocol is more robust against simultaneous multiple failures (the $k+1$ failure problem) compared to a fixed Ring-based heartbeating protocol.
*   **Key Answer Points:** 
    1. **Dynamic vs. Fixed Paths:** In a Ring, neighbors are fixed; if a node and its $k$ observers fail, the failure goes undetected. In Gossip, targets are re-selected randomly every round.
    2. **Global Dissemination:** Gossip relies on $O(\log N)$ random infection paths rather than a rigid topology, allowing information to "bypass" failed clusters easily.

**8. (5 pts) SWIM Indirect Ping**
Describe the mechanism of "Indirect Ping" in SWIM and explain how it improves the **Accuracy** of a failure detector.
*   **Key Answer Points:** If $P_i$ pings $P_j$ directly and receives no response, it asks $k$ random members to ping $P_j$ on its behalf. This compensates for packet loss or congestion on a **specific network path** between $P_i$ and $P_j$. It prevents "False Positives" (mistakenly marking a healthy node as failed) caused by transient link issues.
