Temporary home of the web console frontend.

## Picking an issue

We've broken the work into 3 phases.

1. console output
2. object inspection
3. JS terminal

We're currently working on [Phase 1](https://github.com/devtools-html/gecko-dev/milestone/7). The [milestones](https://github.com/devtools-html/gecko-dev/milestones?direction=desc&sort=completeness&state=open) list has our current sprint.

If you want to take an issue, add a comment with your interest and we'll help you figure out the next steps on the issue.

## Seeing your changes

From the root directory:

1. `./mach build`
2. `./mach run`
3. Go to `about:config`
4. Turn on the `devtools.webconsole.new-frontend-enabled` pref

## Running tests

```
cd devtools/client/webconsole
npm install
npm run test
```
