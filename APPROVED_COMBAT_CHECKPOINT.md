# LOCKED APPROVAL: Blood, Gore Whip and Death Effects

Approved by player on 2026-11-06 and reconfirmed on 2026-11-07. This checkpoint is a **minimum quality bar**, not a request to revert unrelated gameplay.

## Source checkpoints
- Blood and Gore Whip shedding approval: `5ccd35b651`
- Six-piece breakaway from 15 anatomical regions approval: `93ee481220`
- Gothic enemy refinements: `8c7590774a`, `7e0afa053f`
- Approved 180-degree curved sweep and fling: `work/enemy-model-overhaul-2026-11-06`
- Restored candidate: `restore/approved-checkpoint-preview-20261107` (PR #16)
- Pre-restoration backup: `backup/pre-approved-checkpoint-20261107`

## Non-negotiable invariants
1. Gore Whip visibly travels through a curved **180-degree arc**, not a straight beam, and flings blood from the moving lash. Preserve attack timing, recoil, and later level-specific sweeps.
2. Blood must retain the approved coherent directional appearance, sizing, ground contact marks and High/Medium/Low/Off control. Do not substitute square spray, generic particles or rejected FluidGPU experiments.
3. Deaths use the **original enemy geometry/materials** with 15 anatomical region candidates and 4–6 independently moving breakaway pieces, without duplicated corpse meshes or generic primitive chunks.
4. Optimize without downgrading quality: use pooling, instancing, culling and scheduling while preserving visual output. Performance regressions and visual regressions are both release blockers.
5. Animated ghoul integration is **deferred** until this checkpoint and performance are approved; it must not replace the approved blood or deaths.

## Release protocol
- Never overwrite this checkpoint or its backup. Make future gameplay edits on a new feature branch.
- Run the combat regression workflow. It guards required implementation paths and runtime death/blood behavior, but **cannot establish visual fidelity**.
- Compare Gore Whip, blood, and dismemberment footage against approved reference before release. Request explicit visual sign-off for changes touching these systems.
- Keep production main unchanged until preview and performance are checked. Do not use a whole-file rollback to fix an isolated feature.
