import { BitUpgradeState, RebuyableMechanicState } from "../game-mechanics";
import { GameDatabase } from "../secret-formula/game-database";

import { Quotes } from "./quotes";

export const Kohler = {
  get displayName(){
    return false ? "Kohler" : "???"
  },
  get possessiveName(){
    return false ? "Kohler's" : "???'s"
  },
  get isUnlocked() {
    return false;
  },
  quotes: Quotes.kohler,
  get symbol(){ 
    return false ? "<i class='fa-solid fa-staff-snake'></i>" : "?"
  }
};

class KohlerProgressUnlockState extends BitUpgradeState {
  get bits() { return player.celestials.kohler.unlockProgress; }
  set bits(value) { player.celestials.kohler.unlockProgress = value; }

  get isEffectActive() {
    return true;
  }

  get canBeUnlocked() {
    return !this.isUnlocked && this.condition;
  }

  get description() {
    return typeof this.config.description === "function" ? this.config.description() : this.config.description;
  }

  onUnlock() {
    this.config.onUnlock?.();
  }
}

export const KohlerProgressUnlocks = mapGameDataToObject(
  GameDatabase.mending.kohlerUnlockProgress.progressUnlocks,
  config => new KohlerProgressUnlockState(config)
);