import { RebuyableMechanicState, SetPurchasableMechanicState } from "./game-mechanics";
import { DC } from "./constants";
import FullScreenAnimationHandler from "./full-screen-animation-handler";
import { SpeedrunMilestones } from "./speedrun";
import { corruptionPenalties } from "./secret-formula/mending/corruption";
import { CorruptionUpgrade } from "./corruption-upgrades";

export function animateAndDilate() {
  FullScreenAnimationHandler.display("a-dilate", 2);
  setTimeout(startDilatedEternity, 1000);
}

// eslint-disable-next-line no-empty-function
export function animateAndUndilate(callback) {
  FullScreenAnimationHandler.display("a-undilate", 2);
  setTimeout(() => {
    eternity(false, false, { switchingDilation: true });
    if (callback) callback();
  }, 1000);
}

export function startDilatedEternityRequest() {
  if (!PlayerProgress.dilationUnlocked() || (Pelle.isDoomed && !Pelle.canDilateInPelle)) return;
  const playAnimation = player.options.animations.dilation && !FullScreenAnimationHandler.isDisplaying;
  if (player.dilation.active) {
    if (player.options.confirmations.dilation) {
      Modal.exitDilation.show();
    } else if (playAnimation) {
      animateAndUndilate();
    } else {
      eternity(false, false, { switchingDilation: true });
    }
  } else if (player.options.confirmations.dilation) {
    Modal.enterDilation.show();
  } else if (playAnimation) {
    animateAndDilate();
  } else {
    startDilatedEternity();
  }
}

export function startDilatedEternity(auto) {
  if (!PlayerProgress.dilationUnlocked()) return false;
  if (GameEnd.creditsEverClosed && !PlayerProgress.mendingUnlocked()) return false;
  if (player.dilation.active) {
    eternity(false, auto, { switchingDilation: true });
    return false;
  }
  Achievement(136).unlock();
  eternity(false, auto, { switchingDilation: true });
  player.dilation.active = true;
  if (Pelle.isDoomed) PelleStrikes.dilation.trigger();
  return true;
}

const DIL_UPG_NAMES = [
  null, "dtGain", "galaxyThreshold", "tachyonGain", "doubleGalaxies", "tdMultReplicanti",
  "ndMultDT", "ipMultDT", "timeStudySplit", "dilationPenalty", "ttGenerator",
  "dtGainPelle", "galaxyMultiplier", "tickspeedPower", "galaxyThresholdPelle", "flatDilationMult"
];

export function buyDilationUpgrade(id, bulk = 1) {
  if (GameEnd.creditsEverClosed && !PlayerProgress.mendingUnlocked()) return false;
  // Upgrades 1-3 are rebuyable, and can be automatically bought in bulk with a perk shop upgrade
  const upgrade = DilationUpgrade[DIL_UPG_NAMES[id]];
  if (id > 3 && id < 11) {
    if (player.dilation.upgrades.has(id)) return false;
    if (!Currency.dilatedTime.purchase(upgrade.cost)) return false;
    player.dilation.upgrades.add(id);
    if (id === 4) player.dilation.totalTachyonGalaxies *= 2;
  } else {
    const upgAmount = player.dilation.rebuyables[id];
    let whichCap = Pelle.isDoomed ? upgrade.config.pellePurchaseCap : upgrade.config.purchaseCap
    if (Currency.dilatedTime.lt(upgrade.cost) || upgAmount >= whichCap) return false;

    let buying = Decimal.affordGeometricSeries(Currency.dilatedTime.value,
      upgrade.config.initialCost, upgrade.config.increment, upgAmount).toNumber();
    buying = Math.clampMax(buying, bulk);
    buying = Math.clampMax(buying, whichCap - upgAmount);
    const cost = Decimal.sumGeometricSeries(buying, upgrade.config.initialCost, upgrade.config.increment, upgAmount);
    Currency.dilatedTime.subtract(cost);
    player.dilation.rebuyables[id] += buying;
    if (id === 2) {
      if (!Perk.bypassTGReset.isBought || Pelle.isDoomed) Currency.dilatedTime.reset();
      player.dilation.nextThreshold = DC.E3;
      player.dilation.baseTachyonGalaxies = 0;
      player.dilation.totalTachyonGalaxies = 0;
    }

    if (id === 3 && !Pelle.isDisabled("tpMults")) {
      let retroactiveTPFactor = Effects.max(
        1,
        Perk.retroactiveTP1,
        Perk.retroactiveTP2,
        Perk.retroactiveTP3,
        Perk.retroactiveTP4
      );
      if (Kohler.isRunning) {
        retroactiveTPFactor = Math.pow(retroactiveTPFactor, Enslaved.tachyonNerf);
      }
      if (Enslaved.isRunning) {
        retroactiveTPFactor = Math.pow(retroactiveTPFactor, Enslaved.tachyonNerf);
      }
      Currency.tachyonParticles.multiply(Decimal.pow(retroactiveTPFactor, buying));
      /*if (player.mending.corruptionChallenge.corruptedMend) {
        Currency.tachyonParticles.value = Currency.tachyonParticles.value.pow(Currency.tachyonParticles.value,corruptionPenalties.secondaryRejection[player.mending.corruption[7]]);
      }*/
    }
  }
  return true;
}

export function getTachyonGalaxyMult(thresholdUpgrade, amnt) {
  // This specifically needs to be an undefined check because sometimes thresholdUpgrade is zero
  const upgrade = thresholdUpgrade === undefined ? DilationUpgrade.galaxyThreshold.effectValue : thresholdUpgrade;
  let thresholdMult = 3.65 * upgrade + 0.35;
  const glyphEffect = getAdjustedGlyphEffect("dilationgalaxyThreshold");
  const glyphReduction = glyphEffect === 0 ? 1 : glyphEffect;
  let power = DilationUpgrade.galaxyThresholdPelle.canBeApplied
    ? DilationUpgrade.galaxyThresholdPelle.effectValue : 1;
  let tgSoftcapOne = 50000;
  let tgSoftcapOneApplytimes = Math.floor((amnt == undefined ? player.dilation.baseTachyonGalaxies : amnt) / 50000);
  //let tgSoftcapTwo = 150000;
  if ((amnt == undefined ? player.dilation.baseTachyonGalaxies : amnt) >= tgSoftcapOne && !Pelle.isDoomed){
    power *= ((1.5 - (0.005 * player.mending.rebuyables[11])) * tgSoftcapOneApplytimes);
  }
  /*if (player.dilation.totalTachyonGalaxies >= tgSoftcapTwo && !Pelle.isDoomed){
    power *= 1.5;
  }*/
  let one = Math.max(1.1, (thresholdMult * glyphReduction)) ** power
  return Math.min(Math.max(1, one), 1e300);
}

export function getDilationGainPerSecond() {
  if (Pelle.isDoomed) {
    let x = MendingMilestone.one.isReached ? 100 : 1;
    const tachyonEffect = Currency.tachyonParticles.value.pow(PelleRifts.paradox.milestones[1].effectOrDefault(1));
    let primeAnswer = new Decimal(tachyonEffect)
    .timesEffectsOf(DilationUpgrade.dtGain, DilationUpgrade.dtGainPelle, DilationUpgrade.flatDilationMult)
    .times(ShopPurchase.dilatedTimePurchases.currentMult ** 0.5).times(x)
    .times(Pelle.specialGlyphEffect.dilation).div(1e5);
    if(Ra.unlocks.unlockPelleGlyphEffects.isUnlocked) primeAnswer=primeAnswer.times(getAdjustedGlyphEffect("dilationDT")).times(Math.clampMin(Decimal.log10(Replicanti.amount) * getAdjustedGlyphEffect("replicationdtgain"), 1));
    return primeAnswer;
  }
  let dtRate = new Decimal(Currency.tachyonParticles.value)
    .timesEffectsOf(
      DilationUpgrade.dtGain,
      Achievement(132),
      Achievement(137),
      RealityUpgrade(1),
      AlchemyResource.dilation,
      Ra.unlocks.continuousTTBoost.effects.dilatedTime,
      Ra.unlocks.peakGamespeedDT,
      DilationUpgrade.dtGainPelle,
    );
  if (MendingMilestone.one.isReached){
    dtRate = dtRate.times(100);
  }
  dtRate = dtRate.times(getAdjustedGlyphEffect("dilationDT"));
  dtRate = dtRate.times(ShopPurchase.dilatedTimePurchases.currentMult);
  dtRate = dtRate.times(
    Math.clampMin(Decimal.log10(Replicanti.amount) * getAdjustedGlyphEffect("replicationdtgain"), 1));
  if(Ra.unlocks.relicShardBoost.isUnlocked) dtRate = dtRate.pow(1 + Math.max(0, (Currency.relicShards.value.log10() / 1337)));
  if (Kohler.isRunning && !dtRate.eq(0)) dtRate = Decimal.pow10(Math.pow(dtRate.plus(1).log10(), 0.85) - 1);
  if (Enslaved.isRunning && !dtRate.eq(0)) dtRate = Decimal.pow10(Math.pow(dtRate.plus(1).log10(), 0.85) - 1);
  if (V.isRunning) dtRate = dtRate.pow(0.5);
  if (V.isSuperRunning) dtRate = dtRate.pow(0.000001);
  if (player.mending.corruptionChallenge.corruptedMend) {
    let toDpower=corruptionPenalties.toD.power[player.mending.corruption[7]];
    let toDmult=corruptionPenalties.toD.mult[player.mending.corruption[7]]
    if(CorruptionUpgrade(23).isBought&&player.mending.corruption[7]>=1){
      toDpower+=0.2;
      toDmult=toDmult.times(100000);
    }
    dtRate = Decimal.pow(dtRate,toDpower);
    dtRate = dtRate.times(toDmult);
  }
  return dtRate;
}

export function tachyonGainMultiplier() {
  if (Pelle.isDisabled("tpMults")) return new Decimal(1);
  const pow = Enslaved.isRunning ? Enslaved.tachyonNerf : 1;
  return DC.D1.timesEffectsOf(
    DilationUpgrade.tachyonGain,
    GlyphSacrifice.dilation,
    Achievement(132),
    RealityUpgrade(4),
    RealityUpgrade(8),
    RealityUpgrade(15)
  ).pow(pow);
}

export function rewardTP() {
  Currency.tachyonParticles.bumpTo(getTP(player.records.thisEternity.maxAM, true));
  //I hope this is the only place for TP,TP so weird--sxy
  if (player.mending.corruptionChallenge.corruptedMend) {
    Currency.tachyonParticles.value = Decimal.pow(Currency.tachyonParticles.value,corruptionPenalties.toD.power[player.mending.corruption[7]]);
  }
  player.dilation.lastEP = Currency.eternityPoints.value;
}

// This function exists to apply Teresa-25 in a consistent way; TP multipliers can be very volatile and
// applying the reward only once upon unlock promotes min-maxing the upgrade by unlocking dilation with
// TP multipliers as large as possible. Applying the reward to a base TP value and letting the multipliers
// act dynamically on this fixed base value elsewhere solves that issue
export function getBaseTP(antimatter, requireEternity) {
  if (!Player.canEternity && requireEternity) return DC.D0;
  const am = (isInCelestialReality() || Pelle.isDoomed)
    ? antimatter
    : Ra.unlocks.unlockDilationStartingTP.effectOrDefault(antimatter);
  let baseTP = Decimal.pow(Decimal.log10(am) / 400, 1.5);
  if (Enslaved.isRunning) baseTP = baseTP.pow(Enslaved.tachyonNerf);
  return baseTP;
}

// Returns the TP that would be gained this run
export function getTP(antimatter, requireEternity) {
  let x = getBaseTP(antimatter, requireEternity).times(tachyonGainMultiplier());
  /*if (player.mending.corruptionChallenge.corruptedMend) {
    x = Decimal.pow(x,corruptionPenalties.secondaryRejection[player.mending.corruption[7]]);
  }*/
  return x;
}

// Returns the amount of TP gained, subtracting out current TP; used for displaying gained TP, text on the
// "exit dilation" button (saying whether you need more antimatter), and in last 10 eternities
export function getTachyonGain(requireEternity) {
  return getTP(Currency.antimatter.value, requireEternity).minus(Currency.tachyonParticles.value).clampMin(0);
}

// Returns the minimum antimatter needed in order to gain more TP; used only for display purposes
export function getTachyonReq() {
  let effectiveTP = Currency.tachyonParticles.value.dividedBy(tachyonGainMultiplier());
  if (Enslaved.isRunning) effectiveTP = effectiveTP.pow(1 / Enslaved.tachyonNerf);
  return Decimal.pow10(
    effectiveTP
      .times(Math.pow(400, 1.5))
      .pow(2 / 3)
      .toNumber()
  );
}

export function getDilationTimeEstimate(goal) {
  const currentDTGain = getDilationGainPerSecond();
  const rawDTGain = currentDTGain.times(getGameSpeedupForDisplay());
  const currentDT = Currency.dilatedTime.value;
  if (currentDTGain.eq(0)) return null;
  if (PelleRifts.paradox.isActive) {
    const drain = Pelle.riftDrainPercent;
    const goalNetRate = rawDTGain.minus(Decimal.multiply(goal, drain));
    const currNetRate = rawDTGain.minus(currentDT.times(drain));
    if (goalNetRate.lt(0)) return "Never affordable due to Rift drain";
    return TimeSpan.fromSeconds(currNetRate.div(goalNetRate).ln() / drain).toTimeEstimate();
  }
  return TimeSpan.fromSeconds(Decimal.sub(goal, currentDT)
    .div(rawDTGain).toNumber()).toTimeEstimate();
}

function affordsXUpgrades(currency, id) {
  return Decimal.affordGeometricSeries(currency, DilationUpgrade.all[id + 1].config.initialCost, DilationUpgrade.all[id + 1].config.increment, player.dilation.rebuyables[id + 1]).toNumber()
}

export function buyMaxDilationUpgrades() {
  const TGRBought = Perk.bypassTGReset.isBought || Pelle.isDoomed
  for (let i = 0; Pelle.isDoomed ? i <= 5 : i <= 2; i++) {
    if (!TGRBought && i == 1) return
    player.dilation.rebuyables[i + 1] += affordsXUpgrades(Currency.dilatedTime.value.div(1e6), i)
  }
  let bought = true
  for (let i = 0; i < 100 && bought; i++) {
    bought = false
    for (let i = 0; Pelle.isDoomed ? i <= 5 : i <= 2; i++) {
      if (!TGRBought && i == 1) return
      bought = buyDilationUpgrade(i + 1) || bought
      
    }
  }
  if (!TGRBought) buyDilationUpgrade(2)
}

export function dilatedValueOf(value) {
  const log10 = value.log10();
  const dilationPenalty = 0.75 * Effects.product(DilationUpgrade.dilationPenalty);
  return Decimal.pow10(Math.sign(log10) * Math.pow(Math.abs(log10), dilationPenalty));
}

class DilationUpgradeState extends SetPurchasableMechanicState {
  get currency() {
    return Currency.dilatedTime;
  }

  get set() {
    return player.dilation.upgrades;
  }

  onPurchased() {
    switch(this.id){
      case 4:{
        player.dilation.totalTachyonGalaxies *= 2;
        break;
      }
      case 10:{
        SpeedrunMilestones(15).tryComplete();
        break;
      }
      default:{
          //pass
      }
    }
  }
}

class RebuyableDilationUpgradeState extends RebuyableMechanicState {
  get currency() {
    return Currency.dilatedTime;
  }

  get boughtAmount() {
    return player.dilation.rebuyables[this.id];
  }

  set boughtAmount(value) {
    player.dilation.rebuyables[this.id] = value;
  }

  get isCapped() {
    return this.config.reachedCap();
  }

  purchase(bulk) {
    buyDilationUpgrade(this.config.id, bulk);
  }
}

export const DilationUpgrade = mapGameDataToObject(
  GameDatabase.eternity.dilation,
  config => (config.rebuyable
    ? new RebuyableDilationUpgradeState(config)
    : new DilationUpgradeState(config))
);

export const DilationUpgrades = {
  rebuyable: [
    DilationUpgrade.dtGain,
    DilationUpgrade.galaxyThreshold,
    DilationUpgrade.tachyonGain,
  ],
  fromId: id => DilationUpgrade.all.find(x => x.id === Number(id))
};
