# Featured films (HyperFrames)

The two videos in the "Destacado" sections (`public/media/films/`) are rendered from these HTML compositions with [HyperFrames](https://www.npmjs.com/package/hyperframes). Each one is bilingual: the `lang` variable picks the copy.

Re-render after editing a composition (needs Node 22+ and FFmpeg):

```bash
cd films/schools            # or films/restaurants
mkdir -p assets && cp ../../node_modules/gsap/dist/gsap.min.js assets/
npx hyperframes@0.8.229 render . -o ../out/schools-es.mp4 --variables '{"lang":"es"}'
npx hyperframes@0.8.229 render . -o ../out/schools-en.mp4 --variables '{"lang":"en"}'
```

Then compress for the web and refresh the posters:

```bash
ffmpeg -i ../out/schools-es.mp4 -an -vf scale=1280:-2 -c:v libx264 -crf 26 -preset slow -pix_fmt yuv420p -movflags +faststart ../../public/media/films/schools-es.mp4
ffmpeg -i ../out/schools-es.mp4 -an -vf scale=1280:-2 -c:v libvpx-vp9 -b:v 0 -crf 40 ../../public/media/films/schools-es.webm
ffmpeg -ss 3.9 -i ../out/schools-es.mp4 -frames:v 1 -vf scale=1280:-2 ../../public/media/films/schools-es.webp
```

Chapter times shown under each video live in `src/content/portfolio.ts` (`films`); keep them in step with the scene starts here.
