import IRenderingTarget from "./IRenderingTarget";

/**
 * Rendering target to render into canvas
 */
export default class DefaultRenderingTarget implements IRenderingTarget {
    bind(): void {
        this.gl.bindFramebuffer(WebGLRenderingContext.FRAMEBUFFER, null);
    }
    clear(flag: number, color: number[], depth: number): void {
        this.bind();
        let clearTarget = 0;
        if (color !== null){
            this.gl.clearColor.apply(this.gl, color);
            clearTarget |= WebGLRenderingContext.COLOR_BUFFER_BIT;
        }
        if (depth !== null){
            this.gl.clearDepth(depth);
            clearTarget |= WebGLRenderingContext.DEPTH_BUFFER_BIT;
        }
        if (clearTarget !== 0){
            this.gl.clear(clearTarget);
        }
    }

    constructor(public gl: WebGLRenderingContext){

    }
}