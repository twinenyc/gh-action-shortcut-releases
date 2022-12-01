import { ShortcutClient } from '@useshortcut/client'
import core from '@actions/core'
import github from '@actions/github'

const ACTION_RELEASE = 'release'
const ACTION_DRAFT_RELEASE = 'draft-release'

function extractStoryIds(content) {
  const regex = /(?<=sc|sc-|ch|ch-)\d{1,7}/gi
  const all = content.match(regex)
  const unique = [...new Set(all)]
  return unique
}

async function main(releaseBody, releaseUrl, runId, tag, action, shortcutAccessToken, targetShortcutStateId) {
  const shortcut = new ShortcutClient(shortcutAccessToken)
  const storyIds = extractStoryIds(releaseBody)

  for (const id of storyIds) {
    // move the ticket to the desired state if present
    if (targetShortcutStateId !== '') {
      const stateId = parseInt(completedStateId)
      await shortcut.updateStory(id, { workflow_state_id: stateId })
    }

    // comment on the ticket according to the action
    switch (action) {
      case ACTION_RELEASE:
        await shortcut.createStoryComment(id, {
          text: `## 🚢 Released ${tag}\nLink: ${releaseUrl}\rRun id: ${runId}`
        })
        break;
      case ACTION_DRAFT_RELEASE:
        await shortcut.createStoryComment(id, {
          text: `## 📦 Added to draft release ${tag}\nLink: ${releaseUrl}\rRun id: ${runId}`
        })
        break;
    }
  }

  return storyIds
}

try {
  // retrieve github action context and input
  const { payload, eventName, runId } = github.context;
  if (eventName !== "release") {
    core.setFailed("This action can only be run in a release workflow event type")
  }

  const { body, html_url } = payload.release;

  // collect all the inputs that were manually passed in
  const action = core.getInput('action')
  const tag = core.getInput('tag')
  const shortcutAccessToken = core.getInput('shortcutAccessToken')
  const targetShortcutStateId = core.getInput('targetShortcutStateId')
  
  // execute the action
  main(body, html_url, runId, tag, action, shortcutAccessToken, targetShortcutStateId)
    .then((stories) => {
      console.log("Updated stories", stories)
    })
    .catch((err) => {
      core.setFailed(err);
    })

} catch (error) {
  core.setFailed(error.message);
}