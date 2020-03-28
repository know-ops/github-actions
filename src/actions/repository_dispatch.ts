import * as core from '@actions/core'
import {GithubBase} from './base'

class RepositoryDispatch extends GithubBase {
  status = -1
  result = 0

  constructor(
    owner: string,
    repo: string,
    token: string,
    private eventType: string,
    private clientPayload: string
  ) {
    super(owner, repo, token)
  }

  async dispatch(): Promise<number> {
    this.octokit.repos
      .createDispatchEvent({
        owner: this.owner,
        repo: this.repo,
        event_type: this.eventType,
        client_payload: JSON.parse(this.clientPayload)
      })
      .then(({status}) => {
        this.status = 0
        this.result = status
        return status
      })

    return -1
  }
}

export async function repositoryDispatch(
  token: string,
  repos: string[],
  event_type: string,
  client_payload: string
): Promise<void> {
  core.debug(
    `Token: ${token}: Repos: ${repos}: Event Type: ${event_type}: Client Payload: ${client_payload}`
  )
  if (repos) {
    core.debug('Creating multiple repository dispatches')
    const rps = new Map()
    const promises: string[] = []
    for (const or of repos) {
      const ownerRepo = or.split(':')[0]
      const owner = ownerRepo.split('/')[0]
      const repo = ownerRepo.split('/')[1]
      token = or.split(':')[1]
      core.debug(`Owner: ${owner}: Repo: ${repo}`)
      rps.set(
        ownerRepo,
        new RepositoryDispatch(owner, repo, token, event_type, client_payload)
      )
      promises.push(rps.get(ownerRepo).dispatch())
    }
    if (promises) {
      Promise.all(promises)
      for (const or of repos) {
        const ownerRepo = or.split(':')[0]
        const owner = ownerRepo.split('/')[0]
        const repo = ownerRepo.split('/')[1]
        core.debug(
          `Owner: ${owner}: Repo: ${repo}: Result: ${rps.get(ownerRepo).result}`
        )
      }
    }
  } else {
    core.debug('Creating repository dispatch')
    const ownerRepo = process.env.GITHUB_REPOSITORY
    if (ownerRepo) {
      const owner = ownerRepo.split('/')[0]
      const repo = ownerRepo.split('/')[1]
      core.debug(`Owner: ${owner}: Repo: ${repo}`)
      const rp = new RepositoryDispatch(
        owner,
        repo,
        token,
        event_type,
        client_payload
      )
      const result = await rp.dispatch()
      core.debug(`Owner: ${owner}: Repo: ${repo}: Result: ${result}`)
    }
  }
}
