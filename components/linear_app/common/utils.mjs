async function streamIterator(stream) {
  const resources = [];
  for await (const resource of stream) {
    resources.push(resource);
  }
  return resources;
}

async function getAdditionalIssueInformation(issues = []) {
  const updatedIssues = [];
  for (const issue of issues) {
    const {
      _assignee, _creator, _project, _state, _team,
    } = issue;
    if (_assignee?.id) {
      issue._assignee = await this.linearApp.getUser(_assignee.id);
    }
    if (_creator?.id) {
      issue._creator = await this.linearApp.getUser(_creator.id);
    }
    if (_project?.id) {
      issue._project = await this.linearApp.getProject(_project.id);
    }
    if (_state?.id) {
      issue._state = await this.linearApp.getState(_state.id);
    }
    if (_team?.id) {
      issue._team = await this.linearApp.getTeam(_team.id);
    }
    updatedIssues.push(issue);
  }
  return updatedIssues;
}

export default {
  streamIterator,
  getAdditionalIssueInformation,
};
