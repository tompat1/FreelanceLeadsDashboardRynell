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

export async function onRequestGet({ params, env }) {
  const { results } = await env.DB.prepare(
    "SELECT * FROM contacts WHERE id = ?"
  )
    .bind(params.id)
    .all();

  if (!results.length) {
    return jsonResponse({ error: "Contact not found." }, 404);
  }

  return jsonResponse(mapRow(results[0]));
}

export async function onRequestPut({ request, params, env }) {
  const payload = await request.json();
  const name = payload.name?.trim();

  if (!name) {
    return jsonResponse({ error: "Name is required." }, 400);
  }

  const contact = {
    id: params.id,
    name,
    role: payload.role?.trim() || "",
    company: payload.company?.trim() || "",
    email: payload.email?.trim() || "",
    stage: payload.stage?.trim() || "Inquiry",
    lastTouchpoint: payload.lastTouchpoint?.trim() || "",
    nextAction: payload.nextAction?.trim() || "",
  };

  const result = await env.DB.prepare(
    `UPDATE contacts
     SET name = ?, role = ?, company = ?, email = ?, stage = ?, last_touchpoint = ?, next_action = ?
     WHERE id = ?`
  )
    .bind(
      contact.name,
      contact.role,
      contact.company,
      contact.email,
      contact.stage,
      contact.lastTouchpoint,
      contact.nextAction,
      contact.id
    )
    .run();

  if (result.meta.changes === 0) {
    return jsonResponse({ error: "Contact not found." }, 404);
  }

  return jsonResponse(contact);
}

export async function onRequestDelete({ params, env }) {
  const result = await env.DB.prepare("DELETE FROM contacts WHERE id = ?")
    .bind(params.id)
    .run();

  if (result.meta.changes === 0) {
    return jsonResponse({ error: "Contact not found." }, 404);
  }

  return new Response(null, { status: 204 });
}
