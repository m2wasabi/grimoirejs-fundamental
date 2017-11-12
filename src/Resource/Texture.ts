import TextureSizeCalculator from "../Util/TextureSizeCalculator";
import GLResource from "./GLResource";
import GLUtility from "./GLUtility";
import IResizeResult from "./IResizeResult";
export default abstract class Texture extends GLResource<WebGLTexture> {

    private static _resizerCanvas: HTMLCanvasElement = document.createElement("canvas");

    /**
    * ミップマップの更新が必要なフィルタ
    * @type {number[]}
    */
    private static _filtersNeedsMipmap: number[] = [
        WebGLRenderingContext.LINEAR_MIPMAP_LINEAR,
        WebGLRenderingContext.LINEAR_MIPMAP_NEAREST,
        WebGLRenderingContext.NEAREST_MIPMAP_LINEAR,
        WebGLRenderingContext.NEAREST_MIPMAP_NEAREST,
    ];

    protected __texParameterChanged = true;

    private __magFilter: number = WebGLRenderingContext.LINEAR;

    private __minFilter: number = WebGLRenderingContext.LINEAR;

    private __wrapS: number = WebGLRenderingContext.REPEAT;

    private __wrapT: number = WebGLRenderingContext.REPEAT;

    public get magFilter(): number {
        return this.__magFilter;
    }

    public set magFilter(filter: number) {
        if (this.__magFilter !== filter) {
            this.__texParameterChanged = true;
            this.__magFilter = filter;
            this.__ensureMipmap();
        }
    }

    public get minFilter(): number {
        return this.__minFilter;
    }

    public set minFilter(filter: number) {
        if (this.__minFilter !== filter) {
            this.__texParameterChanged = true;
            this.__minFilter = filter;
            this.__ensureMipmap();
        }
    }

    public get wrapS(): number {
        return this.__wrapS;
    }

    public set wrapS(filter: number) {
        if (this.__wrapS !== filter) {
            this.__texParameterChanged = true;
            this.__wrapS = filter;
        }
    }

    public get wrapT(): number {
        return this.__wrapT;
    }

    public set wrapT(filter: number) {
        if (this.__wrapT !== filter) {
            this.__texParameterChanged = true;
            this.__wrapT = filter;
        }
    }

    constructor(gl: WebGLRenderingContext, public textureType: number) {
        super(gl, gl.createTexture());
    }

    public register(registerNumber: number): void {
        this.gl.activeTexture(WebGLRenderingContext.TEXTURE0 + registerNumber);
        this.gl.bindTexture(this.textureType, this.resourceReference);
        if (this.__texParameterChanged) {
            this._updateTexParameter();
        }
    }

    public destroy(): void {
        super.destroy();
        this.gl.deleteTexture(this.resourceReference);
    }

    protected __getRawPixels<T extends ArrayBufferView = ArrayBufferView>(type: number, format: number, x = 0, y = 0, width: number, height: number, readFrom: number = WebGLRenderingContext.TEXTURE_2D): T {
        const bufferCtor = GLUtility.typeToTypedArrayConstructor(type);
        const buffer = new bufferCtor(width * height * GLUtility.formatToElementCount(format));
        const frame = this.gl.createFramebuffer();
        if (this.textureType === WebGLRenderingContext.TEXTURE_CUBE_MAP) {
            if (readFrom !== WebGLRenderingContext.TEXTURE_2D) {
                throw new Error("Read from must be specified when retrive pixels from cube map");
            }
        }
        this.gl.bindFramebuffer(WebGLRenderingContext.FRAMEBUFFER, frame);
        this.gl.framebufferTexture2D(WebGLRenderingContext.FRAMEBUFFER, WebGLRenderingContext.COLOR_ATTACHMENT0, readFrom, this.resourceReference, 0);
        if (this.gl.checkFramebufferStatus(WebGLRenderingContext.FRAMEBUFFER) === WebGLRenderingContext.FRAMEBUFFER_COMPLETE) {
            this.gl.readPixels(x, y, width, height, format, type, buffer);
        }
        this.gl.bindFramebuffer(WebGLRenderingContext.FRAMEBUFFER, null);
        return buffer as T;
    }

    protected __justifyResource(image: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement): IResizeResult {
        if (image instanceof HTMLImageElement) {
            return this.__justifyImage(image);
        } else if (image instanceof HTMLCanvasElement) {
            return this.__justifyCanvas(image);
        } else if (image instanceof HTMLVideoElement) {
            return this.__justifyVideo(image);
        } else {
            throw new Error("Unsupported resource type");
        }
    }

    // There should be more effective way to resize texture
    protected __justifyImage(img: HTMLImageElement): IResizeResult {
        const w = img.naturalWidth, h = img.naturalHeight;
        const size = TextureSizeCalculator.getPow2Size(w, h);
        if (w !== size.width || h !== size.height) {
            const canv = Texture._resizerCanvas;
            canv.height = size.height;
            canv.width = size.width;
            canv.getContext("2d").drawImage(img, 0, 0, w, h, 0, 0, size.width, size.height);
            return {
                result: canv,
                height: canv.height,
                width: canv.width,
            };
        }
        return {
            result: img,
            width: w,
            height: h,
        };
    }

    protected __justifyCanvas(canvas: HTMLCanvasElement): IResizeResult {
        const w = canvas.width;
        const h = canvas.height;
        const size = TextureSizeCalculator.getPow2Size(w, h);
        if (w !== size.width || h !== size.height) {
            canvas.width = size.width;
            canvas.height = size.height;
            return {
                result: canvas,
                width: canvas.width,
                height: canvas.height,
            };
        }
        return {
            result: canvas,
            width: canvas.width,
            height: canvas.height,
        };
    }

    protected __justifyVideo(video: HTMLVideoElement): IResizeResult {
        const w = video.videoWidth, h = video.videoHeight;
        const size = TextureSizeCalculator.getPow2Size(w, h); // largest 2^n integer that does not exceed s
        if (w !== size.width || h !== size.height) {
            const canv = Texture._resizerCanvas;
            canv.height = size.height;
            canv.width = size.width;
            canv.getContext("2d").drawImage(video, 0, 0, w, h, 0, 0, size.width, size.height);
            return {
                result: canv,
                width: w,
                height: h,
            };
        }
        return {
            result: video,
            width: w,
            height: h,
        };
    }

    /**
     * Check specified min filter requires mip map or not.
     * @param minFilter min filter type
     */
    protected __needMipmap(minFilter: number): boolean {
        return Texture._filtersNeedsMipmap.indexOf(minFilter) > -1;
    }

    protected __ensureMipmap(): void {
        if (this.__needMipmap(this.minFilter)) {
            this.gl.bindTexture(this.textureType, this.resourceReference);
            this.gl.generateMipmap(this.textureType);
        }
    }

    private _updateTexParameter(): void {
        this.gl.texParameteri(this.textureType, WebGLRenderingContext.TEXTURE_MIN_FILTER, this.__minFilter);
        this.gl.texParameteri(this.textureType, WebGLRenderingContext.TEXTURE_MAG_FILTER, this.__magFilter);
        this.gl.texParameteri(this.textureType, WebGLRenderingContext.TEXTURE_WRAP_S, this.__wrapS);
        this.gl.texParameteri(this.textureType, WebGLRenderingContext.TEXTURE_WRAP_T, this.__wrapT);
        this.__texParameterChanged = false;
    }
}
