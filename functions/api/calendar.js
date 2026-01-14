const jsonResponse = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });

const mapRow = (row) => ({
  id: row.id,
  title: row.title,
  date: row.date,
  startTime: row.start_time,
  endTime: row.end_time,
  notes: row.notes,
  createdAt: row.created_at,
});

// GET /api/calendar?start=YYYY-MM-DD&end=YYYY-MM-DD
export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const start = url.searchParams.get("start");
  const end = url.searchParams.get("end");

  if (start && end) {
    const { results } = await env.DB.prepare(
      "SELECT * FROM events WHERE date BETWEEN ? AND ? ORDER BY date ASC"
    )
      .bind(start, end)
      .all();

    return jsonResponse(results.map(mapRow));
  }

  // fallback: return all
  const { results } = await env.DB.prepare("SELECT * FROM events ORDER BY date ASC").all();
  return jsonResponse(results.map(mapRow));
}

export async function onRequestPost({ request, env }) {
  const payload = await request.json();
  const title = payload.title?.trim();
  const date = payload.date?.trim();

  if (!title || !date) {
    return jsonResponse({ error: "Title and date are required." }, 400);
  }

  const event = {
    id: payload.id?.trim() || crypto.randomUUID(),
    title,
    date,
    startTime: payload.startTime?.trim() || "",
    endTime: payload.endTime?.trim() || "",
    notes: payload.notes?.trim() || "",
  };

  await env.DB.prepare(
    `INSERT INTO events (id, title, date, start_time, end_time, notes, created_at)
     VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`
  )
    .bind(event.id, event.title, event.date, event.startTime, event.endTime, event.notes)
    .run();

  return jsonResponse(event, 201);
}
