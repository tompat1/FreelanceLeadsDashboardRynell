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
  lead: row.lead,
  category: row.category,
  priority: row.priority,
  status: row.status,
  nextStep: row.next_step,
  notes: row.notes,
  createdAt: row.created_at,
});

export async function onRequestGet({ params, env }) {
  const { results } = await env.DB.prepare("SELECT * FROM ideas WHERE id = ?")
    .bind(params.id)
    .all();

  if (!results.length) {
    return jsonResponse({ error: "Idea not found." }, 404);
  }

  return jsonResponse(mapRow(results[0]));
}

export async function onRequestPut({ request, params, env }) {
  const payload = await request.json();
  const title = payload.title?.trim();

  if (!title) {
    return jsonResponse({ error: "Title is required." }, 400);
  }

  const idea = {
    id: params.id,
    title,
    lead: payload.lead?.trim() || "",
    category: payload.category?.trim() || "Branding",
    priority: payload.priority?.trim() || "Medium",
    status: payload.status?.trim() || "New",
    nextStep: payload.nextStep?.trim() || "",
    notes: payload.notes?.trim() || "",
  };

  const result = await env.DB.prepare(
    `UPDATE ideas
     SET title = ?, lead = ?, category = ?, priority = ?, status = ?, next_step = ?, notes = ?
     WHERE id = ?`
  )
    .bind(
      idea.title,
      idea.lead,
      idea.category,
      idea.priority,
      idea.status,
      idea.nextStep,
      idea.notes,
      idea.id
    )
    .run();

  if (result.meta.changes === 0) {
    return jsonResponse({ error: "Idea not found." }, 404);
  }

  return jsonResponse(idea);
}

export async function onRequestDelete({ params, env }) {
  const result = await env.DB.prepare("DELETE FROM ideas WHERE id = ?")
    .bind(params.id)
    .run();

  if (result.meta.changes === 0) {
    return jsonResponse({ error: "Idea not found." }, 404);
  }

  return new Response(null, { status: 204 });
}
