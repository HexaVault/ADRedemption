import { corruptionPenalties } from "../secret-formula/mending/corruption";
import { AutobuyerState } from "./autobuyer";

export class RealityUpgradeAutobuyerState extends AutobuyerState {
  get name() {
    return RealityUpgrade(this.id).config.name;
  }

  get data() {
    return player.auto.realityUpgrades.all[this.id - 1];
  }

  get isUnlocked() {
    if (MendingMilestone.three.isReached){
      return true;
    }
    return Ra.unlocks.instantECAndRealityUpgradeAutobuyers.canBeApplied;
  }

  get hasUnlimitedBulk() {
    return true;
  }

  tick() {
    const upg = RealityUpgrade(this.id);
    while (Currency.realityMachines.gte(upg.cost)&&!(this.id<=5&&player.mending.corruptionChallenge.corruptedMend&&corruptionPenalties.repSing.hiddenFour[player.mending.corruption[8]])) upg.purchase();
  }

  static get entryCount() { return 5; }
  static get autobuyerGroupName() { return "Reality Upgrade"; }
  static get isActive() { return player.auto.realityUpgrades.isActive; }
  static set isActive(value) { player.auto.realityUpgrades.isActive = value; }
}
