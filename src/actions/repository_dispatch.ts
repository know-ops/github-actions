import {GithubBase} from './base'

export class RepositoryDispatch extends GithubBase {
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
