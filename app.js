const cityProfiles = {
  Shanghai: {
    holidayAdvice: "Keep the day simple. Pick one main stop, avoid long cross-city moves, and save a nearby backup.",
    weekendAdvice: "Walkable neighborhoods get busy. Move photo streets and riverfront walks to the morning.",
    normalAdvice: "This is a good self-guided day. Keep museums or paid attractions earlier in the schedule.",
  },
  Beijing: {
    holidayAdvice: "Reservation-heavy sights can sell out. Do not rely on same-day plans for famous attractions.",
    weekendAdvice: "Classic sights and hutongs get dense by late morning. Start early and keep one indoor backup.",
    normalAdvice: "A weekday gives you better odds for timed entries and smoother city transfers.",
  },
  Chengdu: {
    holidayAdvice: "Panda Base, Kuanzhai Alley, and central food districts become crowded. Keep meals and transport flexible.",
    weekendAdvice: "Panda Base mornings and popular teahouses need early starts or advance booking.",
    normalAdvice: "A normal weekday is a good fit for food routes, teahouses, and slower local neighborhoods.",
  },
};

const holidayWindows = [
  ["2026-10-01", "2026-10-08"],
  ["2026-05-01", "2026-05-05"],
  ["2026-02-16", "2026-02-22"],
];

const riskResult = document.querySelector("#riskResult");
const citySelect = document.querySelector("#citySelect");
const dateInput = document.querySelector("#dateInput");
const interestSelect = document.querySelector("#interestSelect");
const previewButton = document.querySelector("#previewButton");

function isWithin(dateValue, start, end) {
  return dateValue >= start && dateValue <= end;
}

function getRisk(city, dateValue, interest) {
  const date = new Date(`${dateValue}T12:00:00`);
  const day = date.getDay();
  const isWeekend = day === 0 || day === 6;
  const isHoliday = holidayWindows.some(([start, end]) => isWithin(dateValue, start, end));
  const profile = cityProfiles[city];

  if (isHoliday) {
    const holidayNotes = {
      "Classic landmark": "Major landmarks will be dense. Pick one anchor sight, go early, and keep a nearby backup.",
      "Museum or exhibition": "Holiday museum slots and special exhibitions may sell out. Reserve first, then plan food nearby.",
      "Food neighborhood": "Food streets and popular malls will be crowded at meal times. Eat early or choose a quieter neighborhood.",
      "Theme park or day trip": "Theme parks and day trips can become a full-day crowd commitment. Avoid stacking anything after it.",
    };
    return {
      label: "Extreme crowd risk",
      className: "risk-extreme",
      note: holidayNotes[interest] || profile.holidayAdvice,
    };
  }

  if (interest === "Theme park or day trip") {
    return {
      label: isWeekend ? "Extreme crowd risk" : "High crowd risk",
      className: isWeekend ? "risk-extreme" : "risk-high",
      note: "Treat this as the main plan for the day. Book ahead and avoid long cross-city transfers afterward.",
    };
  }

  if (isWeekend || interest === "Classic landmark") {
    return {
      label: "High crowd risk",
      className: "risk-high",
      note:
        interest === "Classic landmark"
          ? "Classic landmarks are easiest early. Keep the route short and choose a backup within the same district."
          : profile.weekendAdvice,
    };
  }

  if (interest === "Museum or exhibition") {
    return {
      label: "Moderate crowd risk",
      className: "risk-moderate",
      note: "Check official exhibition calendars and timed-entry rules before you leave the hotel.",
    };
  }

  if (interest === "Food neighborhood") {
    return {
      label: "Moderate crowd risk",
      className: "risk-moderate",
      note: "Food areas peak around lunch and dinner. Go off-peak, save restaurant names, and keep a second option nearby.",
    };
  }

  return {
    label: "Good self-guided day",
    className: "risk-low",
    note: profile.normalAdvice,
  };
}

function renderRisk() {
  const city = citySelect.value;
  const dateValue = dateInput.value;
  const interest = interestSelect.value;
  const risk = getRisk(city, dateValue, interest);

  riskResult.innerHTML = `
    <span class="risk-dot ${risk.className}"></span>
    <strong>${risk.label}</strong>
    <span>${risk.note}</span>
  `;
}

previewButton.addEventListener("click", renderRisk);
