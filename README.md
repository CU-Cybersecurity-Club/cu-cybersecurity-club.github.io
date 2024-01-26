This repo contains the files used to generate the CU Cyber Club website.

## Current Design

Currently, the website is rendered from index.html. It was originally static pages, but has been updated so that the club members and events are dynamically populated from a Firebase store. Everything else is currently statically generated.

## How to update the website

The repo is set up with a github action (`pages-build-deployment`) that will automatically deploy changes that are made to the master branch. So, the general flow for updating the website is:

**If you only need to update club members or events:**
1) Make the changes to the firestore
2) These changes should be immediately reflected in the website, so double check they loaded correctly and you're done!

**If you need to make other changes (including the website style or structure):**
1) Pull down the latest version of this repo so you don't accidentally overwrite other changes.
2) If there is more than one person maintaining the website, it is recommended to make your changes in a fresh branch (e.g. `git checkout -b <branch_name>`).
3) Make the desired changes locally.
4) Test the desired changes locally on your machine (the website should be hosted under localhost).
5) Commit and push up the changes.
6) If you made your changes in a fresh branch, open a Pull Request (PR) on github to merge the new branch into the master branch
7) If multiple people are maintaining the website, have at least one other maintainer look over and approve the PR before merging it in.
8) As soon as your changes are pushed or merged into the master branch, the `pages-build-deployment` action should run. Monitor the action to make sure it succeeds successfully, and if it fails go back to step 3 to fix the changes as needed.
9) After the `pages-build-deployment` action completes successfully, the website should be updated. Double check the deployed website (at https://cucyberclub.com) to make sure it reflects the desired changes.
10) A `CodeQL` action should run once a week to flag any security issues with the latest version of the code. If there are any issues, make sure to resolve them (and go back to step 1 of this process). You can see all the flagged issues in the `Security` tab of the repo.
