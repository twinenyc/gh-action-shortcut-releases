# GitHub action: Shortcut Release workflow


## Inputs

### `shortcutAccessToken`

**Required** The shortcut access token

### `shortcutCompletedStateId`

**Required** The ID of the shortcut state to transition tickets to.

### `commentOnTicket`

**Required** Should the job comment on the shortcut ticket?

## Example usage

```yaml
uses: actions/hello-world-javascript-action@v1.1
with:
  shortcutAccessToken: ${{ secrets.SHORTCUT_ACCESS_TOKEN }}
  shortcutCompletedStateId: 999999999
  commentOnTicket: true
```