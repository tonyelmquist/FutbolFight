# FutbolFight backend scripts

PHP endpoints the app calls to generate debate topics and verdicts (OpenAI
gpt-4o-mini via cURL). Moved here from `_archive/RPWServer`.

| Endpoint | Called when |
|---|---|
| `futbolFightYear.php` | team + year picked |
| `futbolFightDecade.php` | team + decade picked |
| `futbolFightLeagueYear.php` | "All" teams + year |
| `futbolFightLeagueDecade.php` | "All" teams + decade |
| `futbolVerdict.php` | "Who's right?" button |
| `futbolFight.php` | currently unreachable from the app (picker always sends a year or decade) |

The app's base URL lives in `app/(tabs)/picker.jsx` (`getTopic` / `getVerdict`).

## Deploying

Upload all `futbol*.php` files **plus `config.php`** (holds the real OpenAI
key; gitignored — copy `config.example.php` if you need to recreate it) to the
web root of any PHP host with cURL enabled.

⚠️ Do NOT host on InfinityFree/kesug.com free tier — its JavaScript bot
challenge blocks the app's fetch() calls entirely (verified June 2026). The
host must serve plain HTTP responses to non-browser clients.
