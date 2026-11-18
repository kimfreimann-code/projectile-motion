// Ändra elevtexterna här utan att behöva ändra simuleringens kod.
window.ProjectileContent = {
  intro: "Utforska hur begynnelsehastighet och kastvinkel påverkar bollens bana. Bollen startar och landar på samma höjd.",
  lessonTitle: "Vilken vinkel ger längst kast?",
  lessonText: "Prova olika vinklar med samma hastighet. Vad händer med räckvidden vid 30°, 45° och 60°? Jämför också vad som händer med flygtid och högsta höjd.",
  studentTasks: [
    {
      title: "Hitta bästa kastvinkeln",
      text: "Låt hastigheten vara 20 m/s. Prova vinklarna 20°, 30°, 40°, 45°, 50°, 60° och 70°. Anteckna räckvidden. Vilken vinkel ger längst kast?"
    },
    {
      title: "Jämför två vinklar",
      text: "Jämför 30° och 60° med hastigheten 20 m/s. Blir räckvidden lika stor? Hur skiljer sig flygtiden och den högsta höjden?"
    },
    {
      title: "Undersök hastigheten",
      text: "Håll vinkeln på 45° och jämför hastigheterna 10, 20 och 40 m/s. Hur påverkas flygtid, högsta höjd och räckvidd? Förklara sambandet mellan hastighet och räckvidd."
    },
    {
      title: "Rulla till stopp",
      text: "Välj 0° och 20 m/s. Anteckna rulltid och rullsträcka. Använd sambandet R = v₀²/(2μᵣg) för att kontrollera sträckan. Vad tror du händer med stoppsträckan om starthastigheten fördubblas?"
    }
  ],
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
