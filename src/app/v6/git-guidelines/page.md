---
title: Git Guidelines
description: Best practices for using Git with Laravolt projects
---

This guide outlines the standard Git workflow and best practices for Laravolt projects.

---

## Workflow

Git workflow defines our branching strategy when using Git for software development, covering:

1. How to name branches?
2. When to create a new branch?
3. When can deployment be done?
4. Which branch should new branches be created from?
5. Where should branches be merged when completed?
6. How to handle production bugs?
7. And other branching strategy concerns

There are two methods commonly used as references:

1. [GitFlow](https://nvie.com/posts/a-successful-git-branching-model/) (ideal version for product development, relatively more complex, suitable for large teams and project scopes)
2. [Github Flow](https://guides.github.com/introduction/flow/) (simple, suitable for small teams and projects)

Each method has its own advantages and disadvantages. In our journey, we've implemented a new method that's appropriate for developing information systems in Indonesia, called **[Simplified Git Flow](https://medium.com/goodtogoat/simplified-git-flow-5dc37ba76ea8)**.

### Simplified Git Flow

- There should always be at least 2 branches:
  - `main` is the (protected) branch ready for deployment to production.
  - `develop` is the (protected + default) branch actively used during development. Testing is done on this branch.
- When programmers start working on something, they create a new branch from `develop` following the **branch naming rules** (see below).
- If there's a bug in production, programmers create a _hotfix_ branch from `main`. Once completed, merge to `develop` for testing (don't delete the _hotfix_ branch) **and if it passes testing**, continue by merging that _hotfix_ branch to `main`.
- Periodically (usually weekly), after passing testing, the `develop` branch is merged to the `main` branch and automatically deployed to production.
  - At this stage, a **_tagging new version_** process can be done to make referencing easier. So if there's a bug, we can say "oh, this appeared since version 1.1" and not "oh, this appeared 2 or 3 weeks ago".

## Branch Naming

1. Branch names should be written in **kebab-case** format
2. Two mandatory branches are:
   - `main` as the main branch. Merging to `main` means promoting to production.
   - `develop` as the development branch. Merging to `develop` means promoting to staging.
3. According to the task type, branch names must begin with one of these prefixes:
   - `feature/` for new features or enhancements to existing features
   - `issue/` for bug fixes
   - `hotfix/` for critical bug fixes that need immediate deployment to production
   - `refactor/` for code improvements without adding new features
   - `styling/` for UI improvements without adding new features

> Previously, we knew the _default branch name_ commonly used was `master`. But since 2020, the term `master` has been replaced with `main`.
> References related to this change:
>
> - [Github](https://github.blog/changelog/2020-10-01-the-default-branch-for-newly-created-repositories-is-now-main/)
> - [Gitlab](https://about.gitlab.com/blog/2021/03/10/new-git-default-branch-name/)

### Examples

#### ✅ Good

- `feature/crud-faq`
- `feature/mockup-login`
- `issue/password-edit-failure`
- `hotfix/remove-hardcoded-userid`
- `refactor/cleanup-user-controller`
- `styling/login-page`
- `styling/enlarge-topbar-searchbox`

#### ❌ Bad

- `crudFaq`
- `password_edit_failure`
- `hotfix_remove-userId`
- `ui-improvements` (Which UI?)
- `feature/john` (avoid using personal names)

## Commits

1. Before committing, review the list of _modified files_ and ensure there's no junk code.
2. If you find unrelated changes that you want to keep, use `git stash`.

## Commit Messages

Allocate at least **30 seconds** to remember **why** you made those changes.
Write the answer to that **why** question as your _commit message_. Do this under any circumstances, relaxed or under pressure. Delaying a commit for **30 seconds** won't cause World War III.

### Examples

| ❌ Bad                                              | Why Bad?     | ✅ Good                                                                                                             |
| --------------------------------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------- |
| Fix product rating                                  | Too general  | Fix product rating: handle null rating values                                                                       |
| Fix bug                                             | Too general  | Fix admin role check when deleting comments                                                                         |
| Add validation                                      | Too general  | Add product price validation: minimum input value of "0"                                                            |
| Grocery page 404                                    | Ambiguous    | Fix 404 when accessing grocery page due to incorrect route order                                                    |
| Error message appears if profile incomplete         | Ambiguous    | Show error message when profile is incomplete<br />**or**<br />Remove error message even when profile is incomplete |
| remove whitespace in PartnerController.php line 217 | Too specific | Remove whitespace causing blank response                                                                            |
| search button filter kost                           | Too general  | Adjust "Search" button size on kost filter page                                                                     |
| styling searchbox                                   | Too general  | Make searchbox more contrasting and visible                                                                         |
| fixing mobile view                                  | Too general  | Adjust search page layout to match Zeplin design                                                                    |
| migration                                           | Too general  | migration: add item_task column                                                                                     |
| change migration                                    | Too general  | migration: make users.name column nullable                                                                          |

## Pull/Merge Requests

1. Before creating a Pull/Merge Request, ensure:
   1. Your commit messages follow the guidelines
   2. You've performed self-testing
   3. You've removed all `comments` and `unused debugging code`
2. Provide an explanation of what was added or changed. If you're using a _task management_ system (ActiveCollab, Jira, Trello, Basecamp, etc.), simply include a link to the relevant task.
3. Assign to the designated Reviewer.
4. If changes are needed, the Reviewer changes the `Assignee` back to the original programmer.
5. After making changes, the programmer changes the `Assignee` back to the Reviewer.
6. When everything is satisfactory, the Reviewer:
   1. Approves the request
   2. Deletes the _merged branch_
   3. Performs _squash commits_ if necessary

## Code Review

Code review in a PR/MR is a unique learning process because many cases will be encountered by the Programmer for the first time, but the Reviewer has experienced them repeatedly. Therefore, questions sometimes arise: "It's already working, why do we need to change it?"

This is where natural knowledge transfer happens. The Programmer provides solutions based on current conditions, and the Reviewer provides input based on future possibilities. Programmers can gain a lot of experience without having to experience it themselves. Software quality is better maintained.

**It's a win-win solution**.

### Reviewer Checklist

1. Code follows standard _style guidelines_
2. Code changes align with the PR/MR
3. No hardcoded rules
4. If there are lengthy code portions that aren't understood, ask for explanations
5. Each migration script should be accompanied by appropriate seeders

## .gitignore

`.gitignore` contains a list of files and folders not included in the git index. These typically have characteristics such as:

1. Contains configurations that differ for each programmer, like `.env`.
2. All folders for storing user-uploaded files.
3. All folders generated automatically by the application, such as JS or CSS compilation results.
4. All folders generated by the OS and editors/IDEs like Sublime Text, Visual Studio Code, or PHPStorm.
5. For convenience, you can use https://www.gitignore.io/ to get commonly used `.gitignore` files.

## Common Mistakes

### Setting Default Branch to `main`

When a programmer clones a repository, they should immediately get the code that's actively being developed, which is the `develop` branch. Remember, the `main` branch is for production deployment, while the `develop` branch is for active development.

### Naming Default Branch `dev`

`develop` is more commonly used. `dev` itself has a [special meaning](https://getcomposer.org/doc/articles/aliases.md) in composer, so it's better to avoid it.

### Not Deleting Merged Branches

Undeleted merged branches become clutter and disrupt the _developer experience_.

The ideal number of branches is 2 + (2 x number of programmers). For example, if 3 programmers are involved at one time, the number of branches should not exceed 8.

### Author Name Duplication

Some programmers use multiple tools for committing: git command line, git kraken, sourcetree, or fork. Problems arise when each tool has different configurations regarding the identity used for commits.

Make sure each tool is set up with uniform names and emails. Alternatively, [configure git to use the same identity](https://crunchify.com/how-to-set-github-user-name-and-user-email-per-repository-different-config-for-different-repository/).

## References

- [git - the simple guide](https://rogerdudler.github.io/git-guide/)
- [Mastering Git by thoughbot](https://thoughtbot.com/upcase/mastering-git)
- [Source Code management for Beginners by Dicoding](https://www.dicoding.com/academies/116)
- [GitFlow Workflow Best Practices](https://vitalflux.com/gitflow-workflow-best-practices-quiz-questions/)
- [Git and Release Management Workflow](https://rubygarage.org/blog/git-and-release-management-workflow)
