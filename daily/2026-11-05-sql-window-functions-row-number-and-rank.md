# SQL Window Functions: ROW_NUMBER and RANK

These functions assign sequential integers to rows within a partition. `ROW_NUMBER` provides a unique sequence regardless of ties, while `RANK` assigns the same value to tied rows and leaves gaps in the sequence.

```sql
-- Create a sample table of student scores
WITH StudentScores AS (
    SELECT 'Alice' AS name, 90 AS score UNION ALL
    SELECT 'Bob', 90 UNION ALL
    SELECT 'Charlie', 85
)
SELECT 
    name, 
    score,
    -- ROW_NUMBER: Unique sequential ID (1, 2, 3)
    ROW_NUMBER() OVER(ORDER BY score DESC) AS row_num,
    -- RANK: Tied values get same rank, next rank is skipped (1, 1, 3)
    RANK() OVER(ORDER BY score DESC) AS rnk
FROM StudentScores;
```

## Key takeaways
* `ROW_NUMBER()` is strictly sequential and unique, even when values are identical.
* `RANK()` handles ties by assigning the same rank to equal values, resulting in gaps in the sequence.
* Both functions require an `OVER()` clause to define the ordering of the rows.
