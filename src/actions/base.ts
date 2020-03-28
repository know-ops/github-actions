import * as core from '@actions/core'
import * as github from '@actions/github'

export abstract class GithubBase {
  protected octokit: github.GitHub

  constructor(
    protected owner: string,
    protected repo: string,
    protected token: string
  ) {
    core.debug(`Owner: ${owner}: Repo: ${repo}: Token: ${token}`)
    this.octokit = new github.GitHub(token)
  }
}
