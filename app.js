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

/* Simple calendar placeholder: renders current month and basic navigation */
const calendarContainer = document.getElementById("calendar");
const calendarMonthLabel = document.getElementById("calendar-month");
const prevMonthBtn = document.getElementById("prev-month");
const nextMonthBtn = document.getElementById("next-month");

let calendarDate = new Date();

const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

async function fetchCalendarEvents(start, end) {
  try {
    const url = `/api/calendar?start=${start}&end=${end}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to load events");
    return res.json();
  } catch (e) {
    console.error(e);
    return [];
  }
}

async function renderCalendarInto(date, containerElem, monthLabelElem) {
  if (!containerElem) return;
  const year = date.getFullYear();
  const month = date.getMonth();

  if (monthLabelElem) {
    monthLabelElem.textContent = date.toLocaleString(undefined, { month: "long", year: "numeric" });
  }

  // compute month range (YYYY-MM-DD)
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);
  const toIso = (d) => d.toISOString().slice(0, 10);
  const events = await fetchCalendarEvents(toIso(start), toIso(end));

  // clear
  containerElem.innerHTML = "";

  // weekday headers
  const weekdays = document.createElement("div");
  weekdays.className = "calendar-grid";
  weekdayNames.forEach((wd) => {
    const el = document.createElement("div");
    el.className = "calendar-weekday";
    el.textContent = wd;
    weekdays.appendChild(el);
  });
  containerElem.appendChild(weekdays);

  const grid = document.createElement("div");
  grid.className = "calendar-grid";

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // fill leading empty days
  for (let i = 0; i < firstDay; i++) {
    const cell = document.createElement("div");
    cell.className = "calendar-day calendar-day--muted";
    cell.textContent = "";
    grid.appendChild(cell);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const cell = document.createElement("div");
    cell.className = "calendar-day";
    const num = document.createElement("div");
    num.textContent = d;
    cell.appendChild(num);

    // attach events for this day
    const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    cell.dataset.date = dateKey;
    const dayEvents = events.filter((e) => e.date === dateKey);
    if (dayEvents.length) {
      const badge = document.createElement("div");
      badge.className = "event-count";
      badge.textContent = `${dayEvents.length} event${dayEvents.length > 1 ? "s" : ""}`;
      cell.appendChild(badge);
    }

    grid.appendChild(cell);
  }

  // ensure grid fills complete weeks (optional trailing cells)
  const totalCells = firstDay + daysInMonth;
  const trailing = (7 - (totalCells % 7)) % 7;
  for (let i = 0; i < trailing; i++) {
    const cell = document.createElement("div");
    cell.className = "calendar-day calendar-day--muted";
    cell.textContent = "";
    grid.appendChild(cell);
  }

  containerElem.appendChild(grid);

  // bind clicks for day cells to open modal
  bindCellHandlers(grid, events);
}

async function renderCalendar(date) {
  return renderCalendarInto(date, calendarContainer, calendarMonthLabel);
}

if (prevMonthBtn && nextMonthBtn) {
  prevMonthBtn.addEventListener("click", () => {
    calendarDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1);
    renderCalendar(calendarDate);
  });

  nextMonthBtn.addEventListener("click", () => {
    calendarDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1);
    renderCalendar(calendarDate);
  });
}

// modal and CRUD wiring for calendar events
let lastFetchedEvents = [];

const modal = document.getElementById("calendar-modal");
const modalOverlay = document.getElementById("calendar-modal-overlay");
const eventForm = document.getElementById("event-form");
const eventIdField = document.getElementById("event-id");
const eventTitleField = document.getElementById("event-title");
const eventDateField = document.getElementById("event-date");
const eventStartField = document.getElementById("event-start");
const eventEndField = document.getElementById("event-end");
const eventNotesField = document.getElementById("event-notes");
const eventList = document.getElementById("event-list");
const deleteEventBtn = document.getElementById("delete-event");
const cancelEventBtn = document.getElementById("cancel-event");

function openModal() {
  if (!modal) return;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  if (!modal) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  eventForm.reset();
  eventIdField.value = "";
  deleteEventBtn.style.display = "none";
}

async function createEvent(payload) {
  const res = await fetch("/api/calendar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create event");
  return res.json();
}

async function updateEvent(id, payload) {
  const res = await fetch(`/api/calendar/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update event");
  return res.json();
}

async function deleteEvent(id) {
  const res = await fetch(`/api/calendar/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete event");
}

function bindCellHandlers(grid, eventsForMonth) {
  // attach click handlers to date cells
  grid.querySelectorAll(".calendar-day").forEach((cell) => {
    const date = cell.dataset.date;
    if (!date) return;
    cell.style.cursor = "pointer";
    cell.addEventListener("click", (e) => {
      e.stopPropagation();
      openEventModal(date, eventsForMonth.filter((ev) => ev.date === date));
    });
  });
}

function renderEventList(date, events) {
  if (!eventList) return;
  eventList.innerHTML = "";
  if (!events.length) {
    const p = document.createElement("div");
    p.textContent = "No events for this date.";
    eventList.appendChild(p);
    return;
  }

  events.forEach((ev) => {
    const item = document.createElement("div");
    item.className = "event-item";
    item.innerHTML = `
      <div>
        <div style="font-weight:700">${ev.title}</div>
        <div style="font-size:0.85rem;color:var(--muted)">${ev.startTime || ""} ${ev.endTime ? '– ' + ev.endTime : ''}</div>
      </div>
      <div>
        <button class="button button--ghost button--small" data-edit-id="${ev.id}">Edit</button>
      </div>
    `;
    eventList.appendChild(item);

    const editBtn = item.querySelector("button[data-edit-id]");
    editBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      populateEventForm(ev);
    });
  });
}

function populateEventForm(ev) {
  if (!ev) return;
  eventIdField.value = ev.id;
  eventTitleField.value = ev.title || "";
  eventDateField.value = ev.date || "";
  eventStartField.value = ev.startTime || "";
  eventEndField.value = ev.endTime || "";
  eventNotesField.value = ev.notes || "";
  deleteEventBtn.style.display = "inline-block";
}

function openEventModal(date, eventsForDate = []) {
  renderEventList(date, eventsForDate);
  eventDateField.value = date;
  openModal();
}

modalOverlay?.addEventListener("click", closeModal);
cancelEventBtn?.addEventListener("click", closeModal);

eventForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const payload = {
    title: eventTitleField.value.trim(),
    date: eventDateField.value,
    startTime: eventStartField.value || "",
    endTime: eventEndField.value || "",
    notes: eventNotesField.value.trim() || "",
  };

  try {
    if (eventIdField.value) {
      await updateEvent(eventIdField.value, payload);
    } else {
      await createEvent(payload);
    }
    closeModal();
    renderCalendar(calendarDate);
  } catch (err) {
    alert(err.message);
  }
});

deleteEventBtn?.addEventListener("click", async () => {
  if (!eventIdField.value) return;
  if (!confirm("Delete this event?")) return;
  try {
    await deleteEvent(eventIdField.value);
    closeModal();
    renderCalendar(calendarDate);
  } catch (err) {
    alert(err.message);
  }
});

// initial render
renderCalendar(calendarDate);

// Fullscreen calendar wiring
const navCalendarLink = document.getElementById("nav-calendar-link");
const fsOverlay = document.getElementById("calendar-fullscreen");
const fsContainer = document.getElementById("calendar-fullscreen-calendar");
const fsPrev = document.getElementById("fs-prev");
const fsNext = document.getElementById("fs-next");
const fsClose = document.getElementById("fs-close");
const fsMonthLabel = document.getElementById("fs-month");

let fsDate = new Date();

function openFullscreenCalendar() {
  if (!fsOverlay) return;
  fsOverlay.classList.add("open");
  fsOverlay.setAttribute("aria-hidden", "false");
  renderCalendarInto(fsDate, fsContainer, fsMonthLabel);
}

function closeFullscreenCalendar() {
  if (!fsOverlay) return;
  fsOverlay.classList.remove("open");
  fsOverlay.setAttribute("aria-hidden", "true");
}

navCalendarLink?.addEventListener("click", (e) => {
  e.preventDefault();
  openFullscreenCalendar();
});

fsPrev?.addEventListener("click", () => {
  fsDate = new Date(fsDate.getFullYear(), fsDate.getMonth() - 1, 1);
  renderCalendarInto(fsDate, fsContainer, fsMonthLabel);
});

fsNext?.addEventListener("click", () => {
  fsDate = new Date(fsDate.getFullYear(), fsDate.getMonth() + 1, 1);
  renderCalendarInto(fsDate, fsContainer, fsMonthLabel);
});

fsClose?.addEventListener("click", closeFullscreenCalendar);

fetchContacts().catch((error) => {
  alert(error.message);
});
