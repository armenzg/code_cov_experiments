const host = 'https://hg.mozilla.org'
const headers = {
  'Accept': 'text/plain'
}

export const getDiff = (changeset) =>
  fetch(`${host}/mozilla-central/raw-rev/${changeset}`, { headers })

export const getJsonPushes = (repo_name) =>
  fetch(`${host}/${repo_name}/json-pushes?version=2&full=1`, {
    'Accept': 'application/json'
  })
