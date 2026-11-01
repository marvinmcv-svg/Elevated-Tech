# Elevated Tech: project instructions

## Deployment (standing instruction from Marvin)

**Always deploy to Vercel after pushing, without asking.** Every time changes are committed and pushed, also deploy them to Vercel.

- Vercel team: `marvinmcv-svgs-projects` (`team_oJjp2m4ndYj0sRVbnyFFjypE`)
- Vercel project: `elevated-tech` (`prj_3E7WOmGyjGB5YvZ7p4TK7L0S5Lix`), framework `nextjs`, Node 22.x
- Deploy with the Vercel MCP `create_deployment`, using `gitSource` `{ type: "github", org: "marvinmcv-svg", repo: "Elevated-Tech", ref: "<branch>" }` and `target: "production"`.
- After deploying, check that the build reaches `READY`. If it fails, read the build logs, fix the problem, push and deploy again.
- Production URL: https://elevated-tech-marvinmcv-svgs-projects.vercel.app

## Before pushing

```bash
npm run typecheck && npm run lint && npm run build
```

See README.md for the architecture overview and the launch placeholder checklist.
