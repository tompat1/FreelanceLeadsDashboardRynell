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

export async function onRequestGet({ params, env }) {
  const { results } = await env.DB.prepare("SELECT * FROM events WHERE id = ?")
    .bind(params.id)
    .all();

  if (!results.length) {
    return jsonResponse({ error: "Event not found." }, 404);
  }

  return jsonResponse(mapRow(results[0]));
}

export async function onRequestPut({ request, params, env }) {
  const payload = await request.json();
  const title = payload.title?.trim();
  const date = payload.date?.trim();

  if (!title || !date) {
    return jsonResponse({ error: "Title and date are required." }, 400);
  }

  const event = {
    id: params.id,
    title,
    date,
    startTime: payload.startTime?.trim() || "",
    endTime: payload.endTime?.trim() || "",
    notes: payload.notes?.trim() || "",
  };

  const result = await env.DB.prepare(
    `UPDATE events SET title = ?, date = ?, start_time = ?, end_time = ?, notes = ? WHERE id = ?`
  )
    .bind(event.title, event.date, event.startTime, event.endTime, event.notes, event.id)
    .run();

  if (result.meta.changes === 0) {
    return jsonResponse({ error: "Event not found." }, 404);
  }

  return jsonResponse(event);
}

export async function onRequestDelete({ params, env }) {
  const result = await env.DB.prepare("DELETE FROM events WHERE id = ?")
    .bind(params.id)
    .run();

  if (result.meta.changes === 0) {
    return jsonResponse({ error: "Event not found." }, 404);
  }

  return new Response(null, { status: 204 });
}
