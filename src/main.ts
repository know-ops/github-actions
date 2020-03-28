import * as core from '@actions/core'
import * as actions from './actions/load'

async function run(): Promise<void> {
  try {
    const inputs = {
      action: core.getInput('github_action'),
      token: core.getInput('github_token'),
      repos: core.getInput('github_repos'),
      event_type: core.getInput('github_event_type'),
      client_payload: core.getInput('github_client_payload')
    }

    core.debug(JSON.stringify(inputs))
    switch (inputs.action) {
      case 'repository_dispatch':
        await actions.repositoryDispatch(
          inputs.token,
          inputs.repos.split(' '),
          inputs.event_type,
          inputs.client_payload
        )
        break

      default:
        break
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
