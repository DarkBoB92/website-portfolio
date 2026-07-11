# /public/images

Drop project card thumbnails here.

In `src/data/projects.js`, add a `thumbnail` field with the filename only,
relative to this folder — no leading slash:

    thumbnail: 'images/capsize-card.png'

Used for two things automatically, no other file needs touching:
- the small thumbnail on the home screen carousel card
- the poster frame shown before a local video is played on the project page

If a project has no `thumbnail` field, the carousel card falls back to the
existing teal/navy gradient placeholder — nothing breaks by leaving it out.

Delete this file whenever — it's documentation, not a build dependency.
