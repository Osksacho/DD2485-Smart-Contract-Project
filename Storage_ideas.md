# Ideas

## On-Chain Data Storage:
  **Concept**: Store all forum data directly on a blockchain, including aliases, threads, and comments.
  **Pros**: High security and immutability of data.
  **Cons**: Very high cost due to the nature of blockchain transactions, especially for data-heavy applications like forums. Limited scalability and potentially slow access times.

## IPFS for Comments with On-Chain Links:
  **Concept**: Store each comment as a separate file on IPFS (InterPlanetary File System) and save a compact link to each comment on the blockchain.
  **Pros**: Reduces storage costs compared to full on-chain storage; IPFS efficiently handles larger data.
  **Cons**: Still incurs blockchain transaction costs for each comment link; the cost accumulates with the addition of more comments.

## Limiting Comments with Garbage Collection:
  **Concept**: Implement a cap on the total number of comments (e.g., 1,000). Use a garbage collection method to delete the least active threads and related comments after reaching this cap.
  **Pros**: Controls the size of the blockchain component, potentially reducing costs.
  **Cons**: Might negatively impact user experience by removing historical or less active threads. Still incurs costs for adding new comments.

## Thread-Based Storage on IPFS:
  **Concept**: Store each entire thread in one file on IPFS and save a single link to this file on the blockchain.
  **Pros**: Significantly reduces the number of blockchain transactions; more efficient for threads with many comments.
  **Cons**: Complexity in updating threads (since the entire thread file needs updating with each new comment). Challenges in managing and accessing individual comments within a thread.
