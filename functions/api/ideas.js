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

export async function onRequestGet({ env }) {
  const { results } = await env.DB.prepare(
    "SELECT * FROM ideas ORDER BY datetime(created_at) DESC"
  ).all();
  return jsonResponse(results.map(mapRow));
}

export async function onRequestPost({ request, env }) {
  const payload = await request.json();
  const title = payload.title?.trim();

  if (!title) {
    return jsonResponse({ error: "Title is required." }, 400);
  }

  const idea = {
    id: payload.id?.trim() || crypto.randomUUID(),
    title,
    lead: payload.lead?.trim() || "",
    category: payload.category?.trim() || "Branding",
    priority: payload.priority?.trim() || "Medium",
    status: payload.status?.trim() || "New",
    nextStep: payload.nextStep?.trim() || "",
    notes: payload.notes?.trim() || "",
  };

  await env.DB.prepare(
    `INSERT INTO ideas
      (id, title, lead, category, priority, status, next_step, notes, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`
  )
    .bind(
      idea.id,
      idea.title,
      idea.lead,
      idea.category,
      idea.priority,
      idea.status,
      idea.nextStep,
      idea.notes
    )
    .run();

  return jsonResponse(idea, 201);
}
