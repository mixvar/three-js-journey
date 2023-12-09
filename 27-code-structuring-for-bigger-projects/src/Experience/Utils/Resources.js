import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import EventEmitter from "./EventEmitter";

export default class Resources extends EventEmitter {
  constructor(sources) {
    super();

    // Options
    this.sources = sources;

    // Setup
    this.items = {};
    this.loadedItemsCount = 0;

    this.setLoaders();
    this.loadAllSources();
  }

  setLoaders() {
    this.loaders = {};

    this.loaders.gltfLoader = new GLTFLoader();
    this.loaders.textureLoader = new THREE.TextureLoader();
    this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader();
  }

  loadAllSources() {
    this.sources.forEach((source) => {
      switch (source.type) {
        case "gltfModel": {
          this.loaders.gltfLoader.load(source.path, (file) => {
            this.onSourceLoaded(source, file);
          });
          break;
        }
        case "texture": {
          this.loaders.textureLoader.load(source.path, (file) => {
            this.onSourceLoaded(source, file);
          });
          break;
        }
        case "cubeTexture": {
          this.loaders.cubeTextureLoader.load(source.path, (file) => {
            this.onSourceLoaded(source, file);
          });
          break;
        }
        default:
          throw new Error(`source '${source.type}' not supported! `);
      }
    });
  }

  onSourceLoaded(source, file) {
    this.items[source.name] = file;
    this.loadedItemsCount++;

    if (this.loadedItemsCount === this.sources.length) {
      console.log("finished loading");
      this.dispatch("ready");
    }
  }
}
