# /public/videos

Drop finished MP4 exports here (from Premiere, already trimmed/captioned).

In `src/data/projects.js`, reference a local file by its filename only,
relative to this folder — no leading slash:

    video: 'videos/potato-bonanza-showcase.mp4'

Keep the existing YouTube-embed projects as full URLs, exactly as they are:

    video: 'https://www.youtube.com/embed/VIDEO_ID'

ProjectScreen.jsx checks whether `video` starts with `http` to decide
between the two — YouTube gets an iframe, anything else gets a local
`<video>` tag. You don't need to touch any other file when adding one;
just add the file here and set the one-line path in projects.js.

Delete this file whenever — it's documentation, not a build dependency.
