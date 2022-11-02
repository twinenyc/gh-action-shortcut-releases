import { ShortcutClient } from '@useshortcut/client'
import core from '@actions/core'
import github from '@actions/github'

function extractStoryIds(content) {
  const regex = /(?<=sc|sc-|ch|ch-)\d{1,7}/gi
  const all = content.match(regex)
  const unique = [...new Set(all)]
  return unique
}

async function main(releaseBody, tag, releaseUrl, runId, shortcutAccessToken, completedStateId, commentOnTicket = true) {
  const shortcut = new ShortcutClient(shortcutAccessToken)
  const storyIds = extractStoryIds(releaseBody)

  for (const id of storyIds) {
    if (completedStateId !== 'undefined') {
      const stateId = parseInt(completedStateId)
      await shortcut.updateStory(id, {
        workflow_state_id: stateId
      })
    }
    if (commentOnTicket) {
      const commentText = `## 🚀 Release ${tag}\nLink: ${releaseUrl}\rrun id: ${runId}`
      await shortcut.createStoryComment(id, {
        text: commentText
      })
    }
  }

  return storyIds
}

try {
  // make sure we are in a release event
  const { payload, eventName, runId } = github.context;
  if (eventName !== "release") {
    console.warn("Skipping action because this is not a release event")
    process.exit(0)
  }

  const { body, html_url, tag_name } = payload.release;
  const token = core.getInput('shortcutAccessToken')
  const completedStateId = core.getInput('shortcutCompletedStateId')
  const commentOnTicket = core.getInput('commentOnTicket')
  
  main(body, tag_name, html_url, runId, token, completedStateId, commentOnTicket)
    .then((stories) => {
      console.log("Updated stories", stories)
    })
    .catch((err) => console.error(err))

} catch (error) {
  core.setFailed(error.message);
}