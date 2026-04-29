# Architecture Loading Policy

- Document architecture conventions in `docs/conventions/architecture/` or equivalent location.
- Load architecture context progressively; do not load unrelated areas by default.
- When a task touches a specific layer (API, data, UI, infra), load only the conventions relevant to that layer.
- Canonical detail stays in `docs/conventions/**`; `.ai/` only defines the loading policy.
- TODO: specify canonical sources, scope-to-source mapping, and loading precedence for this project.
