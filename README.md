# WWWorkout

An exercise catalogue: pick a muscle, get every exercise that hits it. 87 exercises, each tagged with
the muscle groups it works, its movement pattern and whether it is a compound or isolation lift —
browsable by people and served as JSON for other apps.

**Live:** https://wwworkout.vercel.app

## Features

- **Home** (`/`) — a body map and a muscle × movement matrix showing coverage (empty cells are
  gaps), plus an index of every exercise by movement pattern.
- **Exercise browser** (`/exercises`) — search by name, muscle or movement and filter by category,
  muscle group, mechanics and movement pattern; tap any badge to filter by it. Show results as
  cards or a table, grouped by movement pattern or muscle group and sorted by name, movement or
  mechanics. All filter and view state lives in the URL, so every view is shareable.
- **Exercise detail** (`/exercises/[id]`) — mechanics, movement, category and target muscles, a
  YouTube form-video search link, and up to eight similar exercises ranked by shared movement
  pattern and muscle overlap. Every detail page is statically generated.
- **JSON API** (`/api/exercises`) — the catalogue for other apps; see below.
- Light and dark themes, responsive "liquid glass" UI.

## The catalogue

The data is a static export in [exercises-latest.json](exercises-latest.json) (an SQL dump shape:
one `header` row plus `rows`), parsed once and cached in memory by
[lib/exerciseDb.ts](lib/exerciseDb.ts). Its vocabulary:

| Field              | Values                                                       |
| ------------------ | ------------------------------------------------------------ |
| `category`         | `lower`, `upper`, `core` (an exercise can have several)      |
| `movement_pattern` | `push`, `pull`, `bend`, `squat`, `lunge`, `flex`             |
| `mechanics`        | `compound`, `isolation`                                      |
| `muscle_groups`    | 14 lowercase muscle names, e.g. `quadriceps`, `lower back`   |

To change the catalogue, edit the JSON file and redeploy. Exercise **names** are a public contract:
[Rep Track](https://rep-track-ten.vercel.app) joins its workout plans to this catalogue by exact
name, so renaming an exercise here breaks the match there.

## API

`GET /api/exercises` — every exercise, optionally filtered:

| Parameter     | Matches                                                     |
| ------------- | ----------------------------------------------------------- |
| `q`           | substring of the name, a muscle group or the movement       |
| `category`    | one category                                                |
| `muscleGroup` | one muscle group                                            |
| `mechanics`   | `compound` or `isolation`                                   |
| `pattern`     | one movement pattern                                        |

```jsonc
// GET /api/exercises?category=lower&mechanics=compound
{
  "exercises": [
    {
      "id": "1",
      "name": "Deadlift",
      "category": ["lower"],
      "movement_pattern": "bend",
      "mechanics": "compound",
      "muscle_groups": ["hamstrings", "glutes", "lower back", "quadriceps"],
      "detail_url": "https://wwworkout.vercel.app/exercises/1",
      "video_url": "https://www.youtube.com/results?search_query=Deadlift+form",
      "created_at": "1675529768665",
      "updated_at": "1791371330371",
      "created_by_id": null,
      "updated_by_id": null
      // …
    }
  ],
  "count": 13,
  "filters": { "query": null, "category": "lower", "muscleGroup": null, "mechanics": "compound", "pattern": null }
}
```

`detail_url` (absolute, on the serving origin) and `video_url` are ready-made links, so consumers
don't have to rebuild URLs. Two alternative shapes:

- `?filters=true` — the filter vocabulary: `total`, `categories`, `muscleGroups`, `mechanics`,
  `movementPatterns`.
- `?stats=true` — counts: `total`, `byCategory`, `byMechanics`, `byMovementPattern`.

Changes to the response are additive only — Rep Track depends on it.

## Tech stack

Next.js 16 (App Router, React 19) · TypeScript · Tailwind CSS v4 · `node --test` · oxlint +
oxfmt · npm. Deployed on Vercel. No database and no runtime dependencies beyond Next.js and React.

## Getting started

```bash
npm install
npm run dev     # http://localhost:3000
```

| Command                           | What it does                                            |
| --------------------------------- | ------------------------------------------------------- |
| `npm run build` / `npm run start` | production build / serve it                             |
| `npm test`                        | unit tests for the pure logic in `lib/` (`*.test.mts`)  |
| `npm run lint`                    | oxlint, warnings fail                                   |
| `npm run format` / `format:check` | oxfmt                                                   |

CodeQL static analysis (SAST) runs on every push to `main`, every pull request and weekly.

## Project layout

```
app/
  page.tsx                 home: body map, muscle matrix, movement index
  exercises/page.tsx       search, filters and list views
  exercises/[id]/page.tsx  exercise detail + similar exercises
  api/exercises/route.ts   JSON API
  components/              UI components
lib/
  exerciseDb.ts            loads and queries the catalogue
  exerciseFilters.ts       filter matching and URL (de)serialisation
  exerciseList.ts          layout, grouping and sorting of result lists
  exerciseLinks.ts         detail-page and video URLs
exercises-latest.json      the catalogue data
```

## License

MIT
