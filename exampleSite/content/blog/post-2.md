---
title: Consectetur Adipiscing Elit
date: 2024-02-20
tags:
  - enim
  - dolor
---

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

## Aggregating Records

Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.

```sql
select
    u.id,
    u.name,
    count(p.id)    as post_count,
    max(p.created) as last_post
from
    users u
    left join posts p on p.user_id = u.id
where
    u.active = true
group by
    u.id,
    u.name
order by
    post_count desc
```

Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur.

### Processing in Python

The same aggregation can be done in Python using `pandas`:

```python
import pandas as pd

def summarise_posts(users: pd.DataFrame, posts: pd.DataFrame) -> pd.DataFrame:
    merged = users.merge(posts, left_on="id", right_on="user_id", how="left")
    return (
        merged[merged["active"]]
        .groupby(["id", "name"])
        .agg(post_count=("post_id", "count"), last_post=("created", "max"))
        .reset_index()
        .sort_values("post_count", ascending=False)
    )
```

At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti. You can also reference columns inline — e.g. `df["post_count"]` — without assigning to a new variable.

## Streaming Transforms

Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.

```python
from typing import Iterator

def chunked(iterable, size: int) -> Iterator[list]:
    chunk = []
    for item in iterable:
        chunk.append(item)
        if len(chunk) >= size:
            yield chunk
            chunk = []
    if chunk:
        yield chunk
```

Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.
