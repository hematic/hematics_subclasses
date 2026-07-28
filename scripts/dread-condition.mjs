/**
 * ============================================================================
 *  DREAD CONDITION  -  module startup script
 *  For FoundryVTT v14.365 / dnd5e 5.3.3
 * ----------------------------------------------------------------------------
 *  Registers "Dread" as a first-class condition/status for the Oath of the
 *  Scourge, so it appears in the token HUD status menu (clickable, with its
 *  own icon and rules reference) and, when applied, imposes a bane-style
 *  -1d4 penalty on the Dreaded creature's attack rolls.
 *
 *  This is a PERSISTENT registration (runs every world load), so it belongs in
 *  the module's code, not a run-once macro. It is wired in via the module.json
 *  "esmodules" field.
 *
 *  The -1d4 attack keys were copied from the working 'bane' spell on this
 *  system (system.bonuses.<type>.attack). Dread applies the penalty to attacks
 *  only (not saves). Per design, this is bane-style (all the Dreaded creature's
 *  attacks) rather than "only against the paladin," which keeps it clean and
 *  fully automated.
 * ============================================================================
 */

(() => {
  const DREAD_ID = "dread";
  const DREAD_LABEL = "Dread";
  // Use a thematic icon that ships with the dnd5e system so no extra asset is
  // required. Swap for a custom path in your module if you prefer.
  const DREAD_ICON = "systems/dnd5e/icons/svg/statuses/frightened.svg";

  // The bane-style attack penalty (attacks only; no save penalty for Dread).
  const DREAD_CHANGES = [
    { key: "system.bonuses.mwak.attack", value: "-1d4", mode: CONST.ACTIVE_EFFECT_MODES.ADD, priority: 20 },
    { key: "system.bonuses.msak.attack", value: "-1d4", mode: CONST.ACTIVE_EFFECT_MODES.ADD, priority: 20 },
    { key: "system.bonuses.rsak.attack", value: "-1d4", mode: CONST.ACTIVE_EFFECT_MODES.ADD, priority: 20 },
    { key: "system.bonuses.rwak.attack", value: "-1d4", mode: CONST.ACTIVE_EFFECT_MODES.ADD, priority: 20 },
  ];

  const DREAD_DESCRIPTION =
    "<p><strong>Dread.</strong> A magical condition created by the Oath of the Scourge. " +
    "Immunity to the frightened condition does not protect a creature from Dread. " +
    "While a creature has Dread, it subtracts 1d4 from its attack rolls and can't willingly move closer to the source of its Dread. " +
    "Dread lasts until the end of the Scourge's next turn unless a feature states otherwise, and cannot be removed by a saving throw.</p>";

  Hooks.once("init", () => {
    // 1. Register in the dnd5e condition types (so it's a known condition).
    if (CONFIG.DND5E?.conditionTypes && !CONFIG.DND5E.conditionTypes[DREAD_ID]) {
      CONFIG.DND5E.conditionTypes[DREAD_ID] = {
        name: DREAD_LABEL,
        img: DREAD_ICON,
        // reference left blank; the effect carries its own description below.
      };
    }

    // 2. Register in the token HUD status effects list (so it's clickable).
    const already = (CONFIG.statusEffects ?? []).some(s => (s.id ?? s._id) === DREAD_ID);
    if (!already) {
      CONFIG.statusEffects.push({
        id: DREAD_ID,
        _id: "hematicdread00000",   // 16-char stable id for the created effect
        name: DREAD_LABEL,
        img: DREAD_ICON,
        description: DREAD_DESCRIPTION,
        changes: DREAD_CHANGES,
        // no duration here; the applier (Menacing Presence, etc.) governs it.
      });
    }
  });

  // Optional: when the world is ready, log confirmation for the GM.
  Hooks.once("ready", () => {
    const ok = (CONFIG.statusEffects ?? []).some(s => (s.id ?? s._id) === DREAD_ID);
    console.log(`Hematic Subclasses | Dread condition registered: ${ok}`);
  });
})();
