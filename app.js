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
