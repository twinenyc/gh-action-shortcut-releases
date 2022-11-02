# GitHub action: Shortcut Release workflow

This github action will update tickets in shortcut 

## Inputs

### `shortcutAccessToken`

**Required** The shortcut access token.

### `shortcutCompletedStateId`

**Optional** The ID of the shortcut state to transition tickets to. If this is omitted, the ticket will not be moved to a new state.

### `commentOnTicket`

**Optional** Should the job comment on the shortcut ticket?
**Default** `false`

## Example usage

```yaml
uses: twinenyc/gh-action-shortcut-releases@v1.0.0
with:
  shortcutAccessToken: ${{ secrets.SHORTCUT_ACCESS_TOKEN }}
  shortcutCompletedStateId: 999999999
  commentOnTicket: true
```