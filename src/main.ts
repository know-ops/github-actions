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

    switch (inputs.action) {
      case "repository_dispatch":
        
        if (inputs.repos) {
          var rps = new Map()
          var promises = new Array()
          let repos = inputs.repos.split(' ')

          repos.forEach(or => {
            let ownerRepo = or.split(':')[0]
            let owner = ownerRepo.split('/')[0]
            let repo = ownerRepo.split('/')[1]
            let token = or.split(':')[1]

            rps.set(ownerRepo, new actions.RepositoryDispatch(owner, repo, token, inputs.event_type, inputs.client_payload))

            promises.push(rps.get(ownerRepo).dispatch())
          })

          if (promises) { 
            Promise.all(promises)

            repos.forEach(or => {
              let ownerRepo = or.split(':')[0]
              let owner = ownerRepo.split('/')[0]
              let repo = ownerRepo.split('/')[1]

              console.log(`Owner: ${owner}: Repo: ${repo}: Result: ${rps.get(ownerRepo).result}`)
            })
          }
        } else {
          let ownerRepo = process.env.GITHUB_REPOSITORY
          if (ownerRepo) {
            let owner = ownerRepo.split('/')[0]
            let repo = ownerRepo.split('/')[1]
            let rp = new actions.RepositoryDispatch(owner, repo, inputs.token, inputs.event_type, inputs.client_payload)
            let result = rp.dispatch()

            console.log(`Owner: ${owner}: Repo: ${repo}: Result: ${result}`)
          }
        }
        break
    
      default:
        break;
    }

  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
