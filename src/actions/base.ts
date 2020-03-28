import * as github from '@actions/github'

export abstract class GithubBase {
  protected octokit: github.GitHub

  constructor(
    protected owner: string,
    protected repo: string,
    protected token: string
  ) {
    this.octokit = new github.GitHub(token)
  }
}
