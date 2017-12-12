import { Nullable } from "grimoirejs/ref/Base/Types";
import ICubemapSource from "./ICubemapSource";
import IElementOfCubemapDirection from "./IElementOfCubemapDirection";
import ITextureUploadConfig from "./ITextureUploadConfig";
import Texture from "./Texture";

/**
 * Cube map texture
 */
export default class TextureCube extends Texture {

    public static defaultTextures: Map<WebGLRenderingContext, TextureCube> = new Map<WebGLRenderingContext, TextureCube>();

    public static imageDirections: IElementOfCubemapDirection<number> = {
        posX: WebGLRenderingContext.TEXTURE_CUBE_MAP_POSITIVE_X,
        negX: WebGLRenderingContext.TEXTURE_CUBE_MAP_NEGATIVE_X,
        posY: WebGLRenderingContext.TEXTURE_CUBE_MAP_POSITIVE_Y,
        negY: WebGLRenderingContext.TEXTURE_CUBE_MAP_NEGATIVE_Y,
        posZ: WebGLRenderingContext.TEXTURE_CUBE_MAP_POSITIVE_Z,
        negZ: WebGLRenderingContext.TEXTURE_CUBE_MAP_NEGATIVE_Z,
    };

    /**
     * Obtain default texture that is used when valid texture is not specified.
     * @param gl
     */
    public static getDefaultTexture(gl: WebGLRenderingContext): TextureCube {
        let defaultTexture = TextureCube.defaultTextures.get(gl);
        if (!defaultTexture) {
            const cube = new TextureCube(gl);
            gl.bindTexture(cube.textureType, cube.resourceReference);
            for (const key in TextureCube.imageDirections) {
                gl.texImage2D(TextureCube.imageDirections[key], 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([1, 1, 1, 1]));
            }
            cube.valid = true;
            defaultTexture = cube;
            TextureCube.defaultTextures.set(gl, defaultTexture);
        }
        return defaultTexture;
    }

    public width: Nullable<number> = null;

    public height: Nullable<number> = null;

    constructor(gl: WebGLRenderingContext) {
        super(gl, WebGLRenderingContext.TEXTURE_CUBE_MAP);
    }

    public update(source: ICubemapSource, uploadConfig?: ITextureUploadConfig): void {
        this.gl.bindTexture(this.textureType, this.resourceReference);
        uploadConfig = {
            flipY: true,
            premultipliedAlpha: false,
            ...uploadConfig,
        };
        this.__prepareTextureUpload(uploadConfig);
        for (const key in TextureCube.imageDirections) {
            const resize = this.__updateWithSourceImage(TextureCube.imageDirections[key], source[key]);
            this.width = resize.width;
            this.height = resize.height;
        }
        this.__ensureMipmap();
        this.valid = true;
    }
}