import { DC } from "../../constants";
import { GameDatabase } from "../game-database";
import { PlayerProgress } from "../../app/player-progress";

import { MultiplierTabIcons } from "./icons";

// See index.js for documentation
GameDatabase.multiplierTabValues.DT = {
  total: {
    name: () => "Dilated Time gain",
    displayOverride: () => `${format(getDilationGainPerSecond().times(getGameSpeedupForDisplay()), 2, 2)}/sec`,
    multValue: () => getDilationGainPerSecond().times(getGameSpeedupForDisplay()),
    isActive: () => getDilationGainPerSecond().gt(0),
    color: () => "var(--color-dilation)",
    overlay: ["Ψ"],
  },
  tachyon: {
    name: () => "Tachyon Particles",
    displayOverride: () => {
      const baseTPStr = format(new Decimal(Currency.tachyonParticles.value), 2, 2);
      return PelleRifts.paradox.milestones[1].canBeApplied
        ? `${baseTPStr}${formatPow(PelleRifts.paradox.milestones[1].effectValue, 1)}`
        : baseTPStr;
    },
    multValue: () => new Decimal(Currency.tachyonParticles.value)
      .pow(PelleRifts.paradox.milestones[1].effectOrDefault(1)),
    isActive: () => getDilationGainPerSecond().gt(0),
    icon: MultiplierTabIcons.TACHYON_PARTICLES,
  },
  achievement: {
    name: () => "Achievements",
    multValue: () => Achievement(132).effectOrDefault(1) * Achievement(137).effectOrDefault(1),
    isActive: () => Achievement(132).canBeApplied || Achievement(137).canBeApplied,
    icon: MultiplierTabIcons.ACHIEVEMENT,
  },
  dilation: {
    name: () => "Repeatable Dilation Upgrades",
    multValue: () => DC.D1.timesEffectsOf(
      DilationUpgrade.dtGain,
      DilationUpgrade.dtGainPelle,
      DilationUpgrade.flatDilationMult
    ),
    isActive: () => DC.D1.timesEffectsOf(
      DilationUpgrade.dtGain,
      DilationUpgrade.dtGainPelle,
      DilationUpgrade.flatDilationMult
    ).gt(1),
    icon: MultiplierTabIcons.UPGRADE("dilation"),
  },
  gamespeed: {
    name: () => "Current Game speed",
    multValue: () => getGameSpeedupForDisplay(),
    isActive: () => getGameSpeedupForDisplay() > 1,
    icon: MultiplierTabIcons.GAMESPEED,
  },
  realityUpgrade: {
    name: () => "Repeatable Reality Upgrade",
    multValue: () => RealityUpgrade(1).effectOrDefault(1),
    isActive: () => RealityUpgrade(1).canBeApplied,
    icon: MultiplierTabIcons.UPGRADE("reality"),
  },
  glyph: {
    name: () => "Glyph Effects",
    multValue: () => Decimal.times(getAdjustedGlyphEffect("dilationDT"),
      Math.clampMin(Decimal.log10(Replicanti.amount) * getAdjustedGlyphEffect("replicationdtgain"), 1)),
    isActive: () => PlayerProgress.realityUnlocked(),
    icon: MultiplierTabIcons.GENERIC_GLYPH
  },
  ra: {
    name: () => "Ra Upgrades",
    multValue: () => DC.D1.timesEffectsOf(
      AlchemyResource.dilation,
      Ra.unlocks.continuousTTBoost.effects.dilatedTime,
      Ra.unlocks.peakGamespeedDT
    ),
    isActive: () => Ra.unlocks.autoTP.canBeApplied,
    icon: MultiplierTabIcons.GENERIC_RA,
  },
  other: {
    name: () => "Other sources",
    multValue: () => new Decimal(ShopPurchase.dilatedTimePurchases.currentMult ** (Pelle.isDoomed ? 0.5 : 1))
      .times(Pelle.specialGlyphEffect.dilation),
    isActive: () => player.IAP.totalSTD > 0 || Pelle.isDoomed,
    icon: MultiplierTabIcons.OTHER,
  },
};