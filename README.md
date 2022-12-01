# GitHub action: Shortcut Release workflow

This github action will update tickets in shortcut. It is useful to track tickets across github and Shortcut during release activities.

## Inputs

| Name | Required? | Description |
|--|--|--|
| `action` | ✅ | Possible values: `release`, `draft-release` |
| `tag` | ✅ | This is the tag that will be added to the comment title. example: `${{ github.release.tag_name }}`|
|`shortcutAccessToken`| ✅ | Your Shortcut API access token. Be sure to keep this in a github secret.|
| `targetShortcutStateId` | | The ID of the Shortcut state to transition tickets to. If this is omitted, the ticket will not be moved to a new state. |

## Example usage

### Adding a comment to a Shortcut for a _drafted_ release

```yaml
uses: twinenyc/gh-action-shortcut-releases@v2.0.0
with:
  action: draft-release
  tag: ${{ github.event.inputs.release-tag }}
  shortcutAccessToken: ${{ secrets.SHORTCUT_ACCESS_TOKEN }}
```

### Commenting and moving a ticket to "complete" for the release

```yaml
uses: twinenyc/gh-action-shortcut-releases@v2.0.0
with:
  action: release
  tag: ${{ github.release.tag_name }}
  shortcutAccessToken: ${{ secrets.SHORTCUT_ACCESS_TOKEN }}
  targetShortcutStateId: 999999999
```