# Local Artifact Storage

- By default, save agent-generated local/non-repository artifacts in `.local/` unless the user explicitly asks for another location.
- This includes temporary or local deliverables such as ad-hoc plans, analysis notes, one-off reports, and other helper files generated for the current machine/user workflow.
- Do not place repository-facing artifacts in `.local/`.
- If a file is intended to be shared in the repository (for example project documentation, project rules, conventions, feature work descriptions, or other canonical team artifacts), save it in the appropriate project location instead.
