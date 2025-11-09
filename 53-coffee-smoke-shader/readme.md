## Notes

- instead of using perlin noise fn in shaders, its much better for perf to use a pre-created noise texture
  - http://kitfox.com/projects/perlinNoiseMaker/
  - https://opengameart.org/content/noise-texture-pack
- geometry is transformed in such a way that [0,0] is at the base of the smoke
