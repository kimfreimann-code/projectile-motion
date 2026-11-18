// Ändra elevtexterna här utan att behöva ändra simuleringens kod.
window.ProjectileContent = {
  intro: "Utforska hur begynnelsehastighet och kastvinkel påverkar bollens bana. Bollen startar och landar på samma höjd.",
  lessonTitle: "Vilken vinkel ger längst kast?",
  lessonText: "Prova olika vinklar med samma hastighet. Vad händer med räckvidden vid 30°, 45° och 60°? Jämför också vad som händer med flygtid och högsta höjd.",
  assumption: "Vi bortser från luftmotstånd och använder konstant tyngdacceleration.",
  rollingAssumption(rollingFriction) {
    const friction = rollingFriction.toLocaleString("sv-SE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return `Vid 0° rullar bollen på marken med rullfriktionskoefficient μᵣ = ${friction}.`;
  },
  flightTimeLabel: "Flygtid",
  rollingTimeLabel: "Rulltid",
  flightTimeNote: "tills bollen landar",
  rollingTimeNote: "tills bollen stannar",
  rangeLabel: "Räckvidd",
  rollingRangeLabel: "Rullsträcka",
  rangeNote: "horisontellt avstånd",
  rollingRangeNote: "innan bollen stannar",
  equationTitle: "Samband",
  rollingEquationTitle: "Rullning på marken",
  landedStatus: "Landat",
  rollingStoppedStatus: "Stannat",
  gravityNote(gravity, rollingFriction) {
    const gravityText = `Tyngdacceleration: g = ${gravity.toLocaleString("sv-SE")} m/s²`;
    if (rollingFriction === undefined) return gravityText;
    const friction = rollingFriction.toLocaleString("sv-SE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return `${gravityText} · rullfriktion: μᵣ = ${friction}`;
  }
};
