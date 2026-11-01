# Elevated Tech: project instructions

## Deployment (standing instruction from Marvin)

**Always deploy to Vercel after pushing, without asking.** Every time changes are committed and pushed, they must end up deployed on Vercel.

- Vercel team: `marvinmcv-svgs-projects` (`team_oJjp2m4ndYj0sRVbnyFFjypE`)
- Vercel project: `elevated-tech` (`prj_3E7WOmGyjGB5YvZ7p4TK7L0S5Lix`), framework `nextjs`
- The project is **linked to GitHub** (`marvinmcv-svg/Elevated-Tech`), so every push deploys automatically. Don't create a second deployment by hand. After pushing, use `list_deployments` (filter by `sha`) to find the automatic deployment and check it reaches `READY`.
- Only if no deployment appears for the pushed commit within a couple of minutes, deploy manually with `create_deployment`, using `gitSource` `{ type: "github", org: "marvinmcv-svg", repo: "Elevated-Tech", ref: "<branch>" }` and `target: "production"`.
- If a build fails, read the build logs, fix the problem, then push again.
- Production URL: https://elevated-tech.vercel.app

## Before pushing

```bash
npm run typecheck && npm run lint && npm run build
```

See README.md for the architecture overview and the launch placeholder checklist.
