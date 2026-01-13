const jsonResponse = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });

const mapRow = (row) => ({
  id: row.id,
  name: row.name,
  role: row.role,
  company: row.company,
  email: row.email,
  stage: row.stage,
  lastTouchpoint: row.last_touchpoint,
  nextAction: row.next_action,
  createdAt: row.created_at,
});

export async function onRequestGet({ env }) {
  const { results } = await env.DB.prepare(
    "SELECT * FROM contacts ORDER BY datetime(created_at) DESC"
  ).all();
  return jsonResponse(results.map(mapRow));
}

export async function onRequestPost({ request, env }) {
  const payload = await request.json();
  const name = payload.name?.trim();

  if (!name) {
    return jsonResponse({ error: "Name is required." }, 400);
  }

  const contact = {
    id: payload.id?.trim() || crypto.randomUUID(),
    name,
    role: payload.role?.trim() || "",
    company: payload.company?.trim() || "",
    email: payload.email?.trim() || "",
    stage: payload.stage?.trim() || "Prospect",
    lastTouchpoint: payload.lastTouchpoint?.trim() || "",
    nextAction: payload.nextAction?.trim() || "",
  };

  await env.DB.prepare(
    `INSERT INTO contacts
      (id, name, role, company, email, stage, last_touchpoint, next_action, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`
  )
    .bind(
      contact.id,
      contact.name,
      contact.role,
      contact.company,
      contact.email,
      contact.stage,
      contact.lastTouchpoint,
      contact.nextAction
    )
    .run();

  return jsonResponse(contact, 201);
}
