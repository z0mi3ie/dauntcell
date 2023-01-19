# dauntcell

This is a small project/tool to help put together gear combinations and builds for the game [Dauntless](https://playdauntless.com).

## API 

### Use Cases

- `GET` all cells and levels
- `GET` all cells by type _(power, defense, etc.)_
- `GET` single cell by name
- `GET` all cells where description matches a partial text search

## Database Schema Idea

### cells table
```
+-------------------+-----------------------------------------------+---------+-----------+
|       name        |                  description                  |  type   | levels_id |
+-------------------+-----------------------------------------------+---------+-----------+
| Assassin's Vigour | Grants Health after breaking a Behemoth part. | Defence |         2 |
+-------------------+-----------------------------------------------+---------+-----------+
```

### levels table
```
+-----------+-------+---------------------------------+
| levels_id | level |           description           |
+-----------+-------+---------------------------------+
|         2 |     1 | Heal 50 when you break a part.  |
|         2 |     2 | Heal 100 when you break a part. |
|         2 |     3 | Heal 150 when you break a part. |
+-----------+-------+---------------------------------+
```

[Thank you, `ascii-tables` :)](https://ozh.github.io/ascii-tables/)
