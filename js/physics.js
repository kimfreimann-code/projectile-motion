// Ändra fysikvärden och startvärden här. Modellen förutsätter samma start- och sluthöjd.
window.ProjectilePhysics = {
  gravity: 9.82,
  rollingFriction: 0.20,
  initialSpeed: 20,
  initialAngle: 45,
  speedLimits: { min: 5, max: 40, step: 1 },
  angleLimits: { min: 0, max: 90, step: 1 },

  calculate(speed, angleDegrees) {
    const angle = angleDegrees * Math.PI / 180;
    const verticalSpeed = speed * Math.sin(angle);
    const horizontalSpeed = speed * Math.cos(angle);
    if (angleDegrees === 0) {
      const deceleration = this.rollingFriction * this.gravity;
      const duration = speed / deceleration;

      return {
        mode: "rolling",
        duration,
        range: speed * duration / 2,
        maxHeight: 0,
        horizontalSpeed: speed,
        verticalSpeed,
        deceleration
      };
    }

    const flightTime = 2 * verticalSpeed / this.gravity;

    return {
      mode: "projectile",
      duration: flightTime,
      range: horizontalSpeed * flightTime,
      maxHeight: verticalSpeed ** 2 / (2 * this.gravity),
      horizontalSpeed,
      verticalSpeed
    };
  },

  positionAt(time, speed, angleDegrees) {
    if (angleDegrees === 0) {
      const deceleration = this.rollingFriction * this.gravity;
      const rollingTime = Math.min(time, speed / deceleration);
      return {
        x: speed * rollingTime - 0.5 * deceleration * rollingTime ** 2,
        y: 0
      };
    }

    const angle = angleDegrees * Math.PI / 180;
    const horizontalSpeed = speed * Math.cos(angle);
    const verticalSpeed = speed * Math.sin(angle);

    return {
      x: horizontalSpeed * time,
      y: verticalSpeed * time - 0.5 * this.gravity * time ** 2
    };
  }
};
