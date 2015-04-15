# Treadstone

Route tracking and visualization for cyclists

Treadstone Git Flow
README.md
Based on: http://nvie.com/posts/a-successful-git-branching-model/

googledoc: https://docs.google.com/document/d/1On2krMGCtfYS8xnR6FLhZ-gO1UUJtNCcDmZQY6UojFU/edit

git checkout -b <your branch> developer
→ Make Changes
git add / git commit
→ code review
git checkout developer
git merge --no-ff <your branch>
git pull (updates the developer branch)
→ deal with conflict using merge tool.
git push origin developer
-> delete your branch
git branch -d <your branch>




there’s no tracking information for the current branch (ERROR):
if the branch doesn’t exist: git branch developer origin/developer
if the branch exists: git pull origin developer
if neither work: delete repo and re-clone
