(function () {
  "use strict";

  const physics = window.ProjectilePhysics;
  const content = window.ProjectileContent;
  const svgNamespace = "http://www.w3.org/2000/svg";
  const chart = { width: 760, height: 410, left: 62, right: 24, top: 24, bottom: 56 };
  const elements = {
    intro: document.querySelector("#intro"),
    lessonTitle: document.querySelector("#lesson-title"),
    lessonText: document.querySelector("#lesson-text"),
    assumption: document.querySelector("#assumption-note"),
    gravityNote: document.querySelector("#gravity-note"),
    speed: document.querySelector("#speed"),
    angle: document.querySelector("#angle"),
    speedOutput: document.querySelector("#speed-output"),
    angleOutput: document.querySelector("#angle-output"),
    flightTimeLabel: document.querySelector("#flight-time-label"),
    flightTimeNote: document.querySelector("#flight-time-note"),
    flightTime: document.querySelector("#flight-time"),
    rangeLabel: document.querySelector("#range-label"),
    rangeNote: document.querySelector("#range-note"),
    range: document.querySelector("#range"),
    maxHeight: document.querySelector("#max-height"),
    equationTitle: document.querySelector("#equation-title"),
    projectileEquations: document.querySelector("#projectile-equations"),
    rollingEquations: document.querySelector("#rolling-equations"),
    grid: document.querySelector("#chart-grid"),
    labels: document.querySelector("#chart-labels"),
    path: document.querySelector("#trajectory-path"),
    ground: document.querySelector("#ground-line"),
    start: document.querySelector("#start-point"),
    landing: document.querySelector("#landing-point"),
    ball: document.querySelector("#ball"),
    chartDescription: document.querySelector("#chart-desc"),
    status: document.querySelector("#motion-status"),
    statusBadge: document.querySelector(".motion-badge"),
    playButton: document.querySelector("#play-button"),
    resetButton: document.querySelector("#reset-button")
  };

  let animationFrame = null;
  let animationStartedAt = 0;
  let animationDuration = 0;
  let current = null;

  function format(value) {
    return value.toLocaleString("sv-SE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function svgElement(name, attributes, text) {
    const element = document.createElementNS(svgNamespace, name);
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function drawAxes(xMax, yMax, groundY) {
    elements.grid.replaceChildren();
    elements.labels.replaceChildren();
    const plotWidth = chart.width - chart.left - chart.right;
    const plotHeight = groundY - chart.top;
    const xStep = xMax <= 20 ? 2 : xMax <= 60 ? 5 : Math.ceil(xMax / 100) * 10;
    const yStep = yMax <= 10 ? 2 : 5;

    for (let value = 0; value <= xMax; value += xStep) {
      const x = chart.left + value / xMax * plotWidth;
      elements.grid.append(svgElement("line", {
        x1: x, y1: chart.top, x2: x, y2: groundY, class: "grid-line"
      }));
      elements.labels.append(svgElement("text", {
        x, y: groundY + 19, "text-anchor": "middle", class: "axis-label"
      }, String(value)));
    }

    for (let value = 0; value <= yMax; value += yStep) {
      const y = groundY - value / yMax * plotHeight;
      elements.grid.append(svgElement("line", {
        x1: chart.left, y1: y, x2: chart.width - chart.right, y2: y, class: "grid-line"
      }));
      elements.labels.append(svgElement("text", {
        x: chart.left - 10, y: y + 4, "text-anchor": "end", class: "axis-label"
      }, String(value)));
    }

    elements.labels.append(
      svgElement("text", {
        x: chart.left + plotWidth / 2, y: chart.height - 8,
        "text-anchor": "middle", class: "axis-title"
      }, "Avstånd (m)"),
      svgElement("text", {
        x: 16, y: chart.top + plotHeight / 2,
        "text-anchor": "middle", class: "axis-title",
        transform: `rotate(-90 16 ${chart.top + plotHeight / 2})`
      }, "Höjd (m)")
    );
  }

  function setBallPosition(time) {
    const boundedTime = Math.max(0, Math.min(time, current.result.duration));
    const position = physics.positionAt(boundedTime, current.speed, current.angle);
    const x = chart.left + position.x / current.xMax * (chart.width - chart.left - chart.right);
    const graphY = current.groundY - position.y / current.yMax * (current.groundY - chart.top);
    const radius = Number(elements.ball.getAttribute("r"));
    const y = position.y <= 0 ? graphY - radius : graphY;
    elements.ball.setAttribute("cx", x);
    elements.ball.setAttribute("cy", y);
  }

  function stopAnimation(statusText) {
    if (animationFrame !== null) cancelAnimationFrame(animationFrame);
    animationFrame = null;
    elements.status.textContent = statusText;
    elements.statusBadge.classList.remove("is-playing");
    elements.playButton.innerHTML = '<span aria-hidden="true">▶</span><span>Spela rörelsen</span>';
    setBallPosition(0);
  }

  function render() {
    const speed = Number(elements.speed.value);
    const angle = Number(elements.angle.value);
    const result = physics.calculate(speed, angle);
    const xMax = Math.max(10, Math.ceil(result.range / 5) * 5);
    const yMax = Math.max(5, Math.ceil(result.maxHeight / 5) * 5);
    const groundY = chart.height - chart.bottom;
    const plotWidth = chart.width - chart.left - chart.right;
    const plotHeight = groundY - chart.top;
    const samples = 80;
    const points = [];

    current = { speed, angle, result, xMax, yMax, groundY };
    elements.speedOutput.value = `${speed} m/s`;
    elements.speedOutput.textContent = `${speed} m/s`;
    elements.angleOutput.value = `${angle}°`;
    elements.angleOutput.textContent = `${angle}°`;
    const rolling = result.mode === "rolling";
    elements.flightTimeLabel.textContent = rolling ? content.rollingTimeLabel : content.flightTimeLabel;
    elements.flightTimeNote.textContent = rolling ? content.rollingTimeNote : content.flightTimeNote;
    elements.rangeLabel.textContent = rolling ? content.rollingRangeLabel : content.rangeLabel;
    elements.rangeNote.textContent = rolling ? content.rollingRangeNote : content.rangeNote;
    elements.flightTime.textContent = format(result.duration);
    elements.range.textContent = format(result.range);
    elements.maxHeight.textContent = format(result.maxHeight);
    elements.chartDescription.textContent =
      `Bollens bana vid ${speed} meter per sekund och ${angle} graders vinkel. ${elements.flightTimeLabel.textContent} ${format(result.duration)} sekunder, ${elements.rangeLabel.textContent.toLowerCase()} ${format(result.range)} meter.`;
    elements.equationTitle.textContent = rolling ? content.rollingEquationTitle : content.equationTitle;
    elements.projectileEquations.hidden = rolling;
    elements.rollingEquations.hidden = !rolling;
    elements.gravityNote.textContent = content.gravityNote(
      physics.gravity,
      rolling ? physics.rollingFriction : undefined
    );
    elements.assumption.textContent = rolling
      ? `${content.assumption} ${content.rollingAssumption(physics.rollingFriction)}`
      : content.assumption;
    elements.speed.style.setProperty("--progress", `${(speed - physics.speedLimits.min) / (physics.speedLimits.max - physics.speedLimits.min) * 100}%`);
    elements.angle.style.setProperty("--progress", `${(angle - physics.angleLimits.min) / (physics.angleLimits.max - physics.angleLimits.min) * 100}%`);

    drawAxes(xMax, yMax, groundY);

    for (let index = 0; index <= samples; index++) {
      const time = result.duration * index / samples;
      const position = physics.positionAt(time, speed, angle);
      const x = chart.left + position.x / xMax * plotWidth;
      const y = groundY - position.y / yMax * plotHeight;
      points.push(`${index === 0 ? "M" : "L"} ${x} ${y}`);
    }
    elements.path.setAttribute("d", points.join(" "));
    elements.ground.setAttribute("x1", chart.left);
    elements.ground.setAttribute("x2", chart.width - chart.right);
    elements.ground.setAttribute("y1", groundY);
    elements.ground.setAttribute("y2", groundY);
    elements.start.setAttribute("cx", chart.left);
    elements.start.setAttribute("cy", groundY);
    elements.landing.setAttribute("cx", chart.left + result.range / xMax * plotWidth);
    elements.landing.setAttribute("cy", groundY);
    setBallPosition(0);
  }

  function animate(timestamp) {
    if (!animationStartedAt) animationStartedAt = timestamp;
    const progress = Math.min((timestamp - animationStartedAt) / animationDuration, 1);
    setBallPosition(progress * current.result.duration);

    if (progress < 1) {
      animationFrame = requestAnimationFrame(animate);
    } else {
      finishAnimation();
    }
  }

  function finishAnimation() {
    animationFrame = null;
    elements.status.textContent = current.result.mode === "rolling"
      ? content.rollingStoppedStatus
      : content.landedStatus;
    elements.statusBadge.classList.remove("is-playing");
    elements.playButton.innerHTML = '<span aria-hidden="true">↻</span><span>Spela igen</span>';
  }

  function play() {
    if (animationFrame !== null) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }
    if (current.result.duration === 0) {
      setBallPosition(0);
      finishAnimation();
      return;
    }
    animationStartedAt = 0;
    animationDuration = Math.min(current.result.duration * 700, 5000);
    elements.status.textContent = "I rörelse";
    elements.statusBadge.classList.add("is-playing");
    elements.playButton.innerHTML = '<span aria-hidden="true">▶</span><span>Spelar …</span>';
    animationFrame = requestAnimationFrame(animate);
  }

  function reset() {
    elements.speed.value = physics.initialSpeed;
    elements.angle.value = physics.initialAngle;
    render();
    stopAnimation("Redo");
  }

  elements.intro.textContent = content.intro;
  elements.lessonTitle.textContent = content.lessonTitle;
  elements.lessonText.textContent = content.lessonText;
  elements.speed.min = physics.speedLimits.min;
  elements.speed.max = physics.speedLimits.max;
  elements.speed.step = physics.speedLimits.step;
  elements.speed.value = physics.initialSpeed;
  elements.angle.min = physics.angleLimits.min;
  elements.angle.max = physics.angleLimits.max;
  elements.angle.step = physics.angleLimits.step;
  elements.angle.value = physics.initialAngle;

  elements.speed.addEventListener("input", () => {
    render();
    stopAnimation("Redo");
  });
  elements.angle.addEventListener("input", () => {
    render();
    stopAnimation("Redo");
  });
  elements.playButton.addEventListener("click", play);
  elements.resetButton.addEventListener("click", reset);

  render();
})();
