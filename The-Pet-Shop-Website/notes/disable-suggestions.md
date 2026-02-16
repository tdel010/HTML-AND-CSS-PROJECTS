# Disable suggestions — quick reference

Workspace settings are saved at `.vscode/settings.json` in this project.

To re-enable automatic suggestions later, add or change these lines in the User or workspace `settings.json`:

```json
{
  "editor.quickSuggestions": { "other": true, "comments": true, "strings": true },
  "editor.suggestOnTriggerCharacters": true,
  "editor.inlineSuggest.enabled": true
}
```

Quick UI steps:

- Open Settings: `Ctrl+,` → search "Quick Suggestions" → check `Editor: Quick Suggestions`.
- Re-enable AI extensions: Extensions view → find extension (e.g., GitHub Copilot) → gear → `Enable` or `Enable (Workspace)`.
- Manually show suggestions: `Ctrl+Space`.
- If changes don't apply immediately: Command Palette (`Ctrl+Shift+P`) → `Developer: Reload Window`.

File saved here in this workspace:

- notes/disable-suggestions.md

---
Created to make it easy to re-enable suggestions later.
