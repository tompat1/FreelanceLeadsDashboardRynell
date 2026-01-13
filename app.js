const stats = [
  {
    label: "New leads this week",
    value: 48,
    trend: "+12% vs last week",
  },
  {
    label: "Active proposals",
    value: 17,
    trend: "+3 in review",
  },
  {
    label: "Client follow-ups",
    value: 9,
    trend: "2 due today",
  },
  {
    label: "Projected revenue",
    value: "$42.5k",
    trend: "+18% this month",
  },
];

const pipelineStages = [
  { label: "Discovery", value: 72 },
  { label: "Proposal", value: 58 },
  { label: "Negotiation", value: 36 },
  { label: "Closed-won", value: 24 },
];

const upcomingCalls = [
  {
    title: "Kickoff call · NovaTech",
    time: "Today · 2:00 PM",
    attendee: "Alex Rivera",
  },
  {
    title: "Scope review · Lumen Labs",
    time: "Tomorrow · 11:00 AM",
    attendee: "Priya Patel",
  },
  {
    title: "Follow-up · Everest Coffee",
    time: "Fri · 4:30 PM",
    attendee: "Morgan Lee",
  },
];

const opportunities = [
  {
    title: "Brand refresh for Henson Media",
    meta: "$12k · due in 3 weeks",
  },
  {
    title: "UX audit for CityScope",
    meta: "$7.5k · proposal sent",
  },
  {
    title: "Marketing site for Skylark",
    meta: "$18k · kickoff pending",
  },
];

const statsContainer = document.getElementById("stats");
const pipelineContainer = document.getElementById("pipeline");
const callsContainer = document.getElementById("calls");
const opportunitiesContainer = document.getElementById("opportunities");
const contactsBody = document.getElementById("contacts-body");
const contactForm = document.getElementById("contact-form");
const contactIdField = document.getElementById("contact-id");
const contactNameField = document.getElementById("contact-name");
const contactRoleField = document.getElementById("contact-role");
const contactCompanyField = document.getElementById("contact-company");
const contactEmailField = document.getElementById("contact-email");
const contactStageField = document.getElementById("contact-stage");
const contactLastField = document.getElementById("contact-last");
const contactNextField = document.getElementById("contact-next");
const searchField = document.getElementById("search");
const stageFilter = document.getElementById("stage-filter");
const csvUpload = document.getElementById("csv-upload");
const exportButton = document.getElementById("export-contacts");
const resetButton = document.getElementById("reset-contact");

const contacts = [];

stats.forEach((stat) => {
  const card = document.createElement("div");
  card.className = "stat-card";
  card.innerHTML = `
    <div class="stat-card__value">${stat.value}</div>
    <div class="stat-card__label">${stat.label}</div>
    <div class="stat-card__trend">${stat.trend}</div>
  `;
  statsContainer.appendChild(card);
});

pipelineStages.forEach((stage) => {
  const row = document.createElement("div");
  row.className = "pipeline__row";
  row.innerHTML = `
    <span>${stage.label}</span>
    <div class="progress">
      <div class="progress__fill" style="width:${stage.value}%"></div>
    </div>
    <strong>${stage.value}%</strong>
  `;
  pipelineContainer.appendChild(row);
});

upcomingCalls.forEach((call) => {
  const item = document.createElement("li");
  item.className = "list-item";
  item.innerHTML = `
    <div class="list-item__meta">
      <strong>${call.title}</strong>
      <span>${call.time}</span>
      <span>${call.attendee}</span>
    </div>
    <span class="tag">Call</span>
  `;
  callsContainer.appendChild(item);
});

opportunities.forEach((opportunity) => {
  const item = document.createElement("div");
  item.className = "opportunity";
  item.innerHTML = `
    <div class="opportunity__title">${opportunity.title}</div>
    <div class="opportunity__meta">${opportunity.meta}</div>
  `;
  opportunitiesContainer.appendChild(item);
});

const splitCsvLine = (line) => {
  const values = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];

    if (char === '"' && line[i + 1] === '"') {
      current += '"';
      i += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      values.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current.trim());
  return values;
};

const parseCsv = (text) => {
  const rows = text
    .split(/\r?\n/)
    .map((row) => row.trim())
    .filter(Boolean);

  if (rows.length < 2) {
    return [];
  }

  const headers = splitCsvLine(rows[0]).map((header) =>
    header.toLowerCase().replace(/\s+/g, "")
  );

  return rows.slice(1).map((row, index) => {
    const values = splitCsvLine(row);
    const record = { id: `csv-${Date.now()}-${index}` };

    headers.forEach((header, headerIndex) => {
      record[header] = values[headerIndex] || "";
    });

    return {
      id: record.id,
      name: record.name || record.fullname || record.contact || "",
      role: record.role || record.title || "",
      company: record.company || record.organization || "",
      email: record.email || "",
      stage: record.stage || record.status || "Prospect",
      lastTouchpoint: record.lasttouchpoint || record.lastcontact || "",
      nextAction: record.nextaction || record.nextstep || "",
    };
  });
};

const renderContacts = () => {
  const searchTerm = searchField.value.trim().toLowerCase();
  const stageValue = stageFilter.value;

  contactsBody.innerHTML = "";

  contacts
    .filter((contact) => {
      const matchesStage = stageValue === "all" || contact.stage === stageValue;
      const matchesSearch = [
        contact.name,
        contact.company,
        contact.email,
        contact.role,
        contact.lastTouchpoint,
        contact.nextAction,
      ]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm);

      return matchesStage && matchesSearch;
    })
    .forEach((contact) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>
          <div class="contact-name">${contact.name}</div>
        </td>
        <td>${contact.company}</td>
        <td>${contact.role}</td>
        <td>${contact.email}</td>
        <td><span class="pill">${contact.stage}</span></td>
        <td>${contact.lastTouchpoint}</td>
        <td>${contact.nextAction}</td>
        <td class="table-actions">
          <button class="button button--ghost button--small" data-action="edit" data-id="${contact.id}">
            Edit
          </button>
          <button class="button button--ghost button--small" data-action="delete" data-id="${contact.id}">
            Delete
          </button>
        </td>
      `;

      contactsBody.appendChild(row);
    });
};

const resetForm = () => {
  contactForm.reset();
  contactIdField.value = "";
  contactForm.classList.remove("contacts__form--editing");
  document.getElementById("save-contact").textContent = "Save contact";
};

const populateForm = (contact) => {
  contactIdField.value = contact.id;
  contactNameField.value = contact.name;
  contactRoleField.value = contact.role;
  contactCompanyField.value = contact.company;
  contactEmailField.value = contact.email;
  contactStageField.value = contact.stage;
  contactLastField.value = contact.lastTouchpoint;
  contactNextField.value = contact.nextAction;
  contactForm.classList.add("contacts__form--editing");
  document.getElementById("save-contact").textContent = "Update contact";
};

const fetchContacts = async () => {
  const response = await fetch("/api/contacts");
  if (!response.ok) {
    throw new Error("Failed to load contacts.");
  }

  const data = await response.json();
  contacts.splice(0, contacts.length, ...data);
  renderContacts();
};

const createContact = async (payload) => {
  const response = await fetch("/api/contacts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to create contact.");
  }

  return response.json();
};

const updateContact = async (contactId, payload) => {
  const response = await fetch(`/api/contacts/${contactId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to update contact.");
  }

  return response.json();
};

const deleteContact = async (contactId) => {
  const response = await fetch(`/api/contacts/${contactId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete contact.");
  }
};

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const payload = {
    id: contactIdField.value || `c-${Date.now()}`,
    name: contactNameField.value.trim(),
    role: contactRoleField.value.trim(),
    company: contactCompanyField.value.trim(),
    email: contactEmailField.value.trim(),
    stage: contactStageField.value,
    lastTouchpoint: contactLastField.value.trim(),
    nextAction: contactNextField.value.trim(),
  };

  if (!payload.name) {
    return;
  }

  const existingIndex = contacts.findIndex((contact) => contact.id === payload.id);

  try {
    if (existingIndex >= 0) {
      const updated = await updateContact(payload.id, payload);
      contacts[existingIndex] = updated;
    } else {
      const created = await createContact(payload);
      contacts.unshift(created);
    }
    resetForm();
    renderContacts();
  } catch (error) {
    alert(error.message);
  }
});

resetButton.addEventListener("click", resetForm);

contactsBody.addEventListener("click", async (event) => {
  const button = event.target.closest("button");
  if (!button) {
    return;
  }

  const action = button.dataset.action;
  const contactId = button.dataset.id;
  const contact = contacts.find((item) => item.id === contactId);

  if (!contact) {
    return;
  }

  if (action === "edit") {
    populateForm(contact);
  }

  if (action === "delete") {
    try {
      await deleteContact(contactId);
      contacts.splice(
        contacts.findIndex((item) => item.id === contactId),
        1
      );
      renderContacts();
    } catch (error) {
      alert(error.message);
    }
  }
});

searchField.addEventListener("input", renderContacts);
stageFilter.addEventListener("change", renderContacts);

csvUpload.addEventListener("change", async (event) => {
  const [file] = event.target.files;
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.addEventListener("load", async (loadEvent) => {
    const rows = parseCsv(loadEvent.target.result);
    if (rows.length) {
      try {
        const created = await Promise.all(rows.map((row) => createContact(row)));
        contacts.unshift(...created);
        renderContacts();
      } catch (error) {
        alert(error.message);
      }
    }
    csvUpload.value = "";
  });
  reader.readAsText(file);
});

exportButton.addEventListener("click", () => {
  const headers = [
    "name",
    "role",
    "company",
    "email",
    "stage",
    "lastTouchpoint",
    "nextAction",
  ];

  const csvRows = [
    headers.join(","),
    ...contacts.map((contact) =>
      headers
        .map((header) => `"${(contact[header] || "").replace(/"/g, '""')}"`)
        .join(",")
    ),
  ];

  const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "contacts.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
});

fetchContacts().catch((error) => {
  alert(error.message);
});
