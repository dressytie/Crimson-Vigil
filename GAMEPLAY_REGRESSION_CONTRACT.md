# Crimson Vigil — Approved Gameplay Contract

**Status:** mandatory project specification. Read before changing any gameplay, enemy, renderer, combat, animation, or asset code. These requirements persist across conversations.

## Non-negotiable player-facing features

1. **All floors:** Preserve approved enemy silhouettes, textures, clawed hands/feet, actual movement cycles (idle/walk/run/attack/hit), and recognizable floor-specific enemy populations. Never replace approved models with primitives or silent procedural substitutes.
2. **Death:** All applicable corporeal mobs use the approved impact-driven, articulated breakaway ragdoll. Limbs separate visibly at anatomically correct joints, then react independently to gravity, ground collisions, and hit direction. No generic floating cubes, spheres, or chunks. Explicit ethereal exceptions must retain their approved dissolve.
3. **Blood:** Preserve the approved cohesive, directional weapon-impact blood and ground/wall splatters, with High/Medium/Low/Off settings. No FluidGPU dependency and no fallback to random fountains or generic particle bursts. Off preserves death stains only.
4. **Ghoul:** Preserve the imported animated GLB with its actual clawed geometry and authored animations. Its death must not silently switch to a stiff sideways roll or generic chunk fallback.
5. **Floor 2:** Preserve cave enemy designs, locomotion and animations. Do not attribute Floor 2 performance problems to Floor 1-only ghoul assets without profiling evidence.
6. **Performance:** Record reproducible frame-time measurements and counts of enemies, draw calls, geometries, textures, materials, particle effects, and active ragdolls per floor. Do not trade quality for speculative optimization.

## Release gate

- Make changes on feature branches only; never push gameplay changes directly to main.
- Before changing a system, compare the code and visual output with its last known approved implementation.
- Add automated tests for each affected feature and each floor; include tests that assert **visible geometry and animation behavior**, not just that a mesh or object exists.
- Test imported models, fallback paths, death impacts, limb detachment, and long-duration combat at representative enemy counts.
- Capture and compare gameplay video/screenshots for floor-specific enemy motion and death effects. Human visual review is required for animations and gore quality.
- Test the **production build** and compare baseline frame times before merging. Fix failed tests; never weaken or delete checks to force a pass.
- Merge only after all gates pass and the user approves the visual result. Keep a tagged/recorded last-known-good commit and a tested rollback procedure.
- If evidence is missing, label the change unverified and keep it on a draft PR.

## Active work / known issues

- Main still has broken or incomplete ragdoll breakaway across mobs; do not claim it is fixed based on the prior smoke test.
- Floor 2 creature restoration is in PR #9 and needs visual validation.
- Ghoul anatomical dismemberment prototype is in PR #8 and is not production ready.
- The existing smoke test proves only basic execution, not approved visual fidelity or performance.

## New-chat handoff

Before any change, read this file, inspect current main and all active PRs, review the approved asset history, and explain exactly what will change and what must remain untouched. Never assume a new conversation authorizes a fresh rewrite or direct deployment.
