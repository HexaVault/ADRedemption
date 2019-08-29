"use strict";

Autobuyer.bigCrunch = new class BigCrunchAutobuyerState extends IntervaledAutobuyerState {
  get data() {
    return player.auto.bigCrunch;
  }

  get isUnlocked() {
    return NormalChallenge(12).isCompleted;
  }

  get baseInterval() {
    return Player.defaultStart.auto.bigCrunch.interval;
  }

  get mode() {
    return this.data.mode;
  }

  set mode(value) {
    this.data.mode = value;
  }

  get hasAdditionalModes() {
    return EternityMilestone.bigCrunchModes.isReached;
  }

  get amount() {
    return this.data.amount;
  }

  set amount(value) {
    this.data.amount = value;
  }

  get time() {
    return this.data.time;
  }

  set time(value) {
    this.data.time = value;
  }

  get xLast() {
    return this.data.xLast;
  }

  set xLast(value) {
    this.data.xLast = value;
  }

  get autoInfinitiesAvailable() {
    return EternityMilestone.autoInfinities.isReached && 
      this.data.isActive && 
      this.mode === AutoCrunchMode.TIME && 
      this.time < 60;
  }

  bumpAmount(mult) {
    if (this.isUnlocked) {
      this.amount = this.amount.times(mult);
    }
  }

  tick() {
    if (canCrunch()) super.tick();
    if (!player.antimatter.gte(Decimal.MAX_NUMBER)) return;
    let proc = !player.break || NormalChallenge.isRunning || InfinityChallenge.isRunning;
    if (!proc) {
      switch (this.mode) {
        case AutoCrunchMode.AMOUNT:
          proc = gainedInfinityPoints().gte(this.amount);
          break;
        case AutoCrunchMode.TIME:
          proc = Time.thisInfinityRealTime.totalSeconds > this.time;
          break;
        case AutoCrunchMode.X_LAST:
          proc = gainedInfinityPoints().gte(player.lastTenRuns[0][1].times(this.xLast));
          break;
      }
    }
    if (proc) {
      bigCrunchResetRequest();
    }
  }

  reset() {
    super.reset();
    if (EternityMilestone.bigCrunchModes.isReached) return;
    this.mode = AutoCrunchMode.AMOUNT;
  }
}();
