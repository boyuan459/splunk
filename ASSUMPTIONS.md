# Assumptions & Interpretation Notes

This document records every interpretation decision made in this implementation.

## 1. Memory range vs. Example 1 (the main conflict)

The **Configurable attributes** section says the memory range is
**4,096MB (included) – 8,388,608MB (included)**. But **Example 1** submits
**1,024MB** and expects **"No Options"** (citing Rule 4's 2,048MB floor).
These cannot both be hard input-validation rules: if 1,024MB were rejected at
input, Example 1 could never reach the rules and produce "No Options".

**Resolution — split format from magnitude:**

- **Input validation** (`parseMemory`) enforces only *format*: the value must be
  a comma-separated positive integer, a **power of two**, and **≤ 8,388,608MB**.
  Invalid format blocks submit and shows an inline error.
- **Magnitude thresholds** (2,048 / 131,072 / 524,288MB) live in the **rules
  engine**, not input validation. So 1,024MB is accepted as input and the rules
  return "No Options", exactly as Example 1 requires.

This choice reproduces **all four** published examples. The lower bound of the
documented range (4,096MB) is therefore treated as guidance rather than a hard
gate; the effective behavioral floor is Rule 4's 2,048MB.

## 2. Both "multiple of 1024" and "power of 2" are enforced

The spec requires memory to be both a multiple of 1024 and a power of two, so
`parseMemory` checks both independently. The subsumption only holds one way:
a power of two ≥ 1024 is always a multiple of 1024, but a power of two *below*
1024 (e.g. 512, 256, 2) is **not** — those are rejected. (Examples confirm:
2,048 and 4,096 accepted, 3,072 rejected for not being a power of two, 512
rejected for not being a multiple of 1024.)

## 3. High Density Server requires a GPU

Rule 1 makes High Density the GPU model; Rule 2 says a Power CPU can build all
other models *except* High Density. We therefore never offer High Density Server
for a configuration without a GPU Accelerator Card.

## 4. GPU implies "only High Density is possible"

Rule 1 says *"Only High Density Server is available when select GPU."* We read
this strictly: when the GPU box is checked, the **only** possible result is High
Density Server, and only if CPU = ARM **and** memory ≥ 524,288MB. Any other
GPU configuration yields "No Options" (e.g. GPU + X86, or GPU + ARM + 262,144MB).

## 5. Mainframe memory floor

Rule 2 says the Mainframe memory limitation "is applied on Rule 4", so Mainframe
uses only the general 2,048MB floor — there is no separate Mainframe-specific
minimum. Mainframe additionally requires a Power CPU.

## 6. Tower Server availability

Rule 3 says memory below 131,072MB "can only be Tower Server". Combined with
Rule 4, Tower Server is available for any non-GPU configuration with memory
≥ 2,048MB (regardless of CPU).

## 7. Output ordering & format

Matching models are shown in a fixed, stable order: **Tower Server → 4U Rack
Server → Mainframe → High Density Server**. An empty match set renders as
**"No Options"**.

## 8. Output visibility

Per the demo, the output section is hidden until the user submits. It appears
only after a successful (validation-passing) submit. A submit that fails
validation shows the error and hides any previous output.
