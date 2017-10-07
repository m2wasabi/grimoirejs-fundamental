import RenderBuffer from "./RenderBuffer";
import ResourceBase from "./ResourceBase";
import Texture2D from "./Texture2D";

export default class FrameBuffer extends ResourceBase {
  public readonly fbo: WebGLFramebuffer;

  constructor(gl: WebGLRenderingContext) {
    super(gl);
    this.fbo = gl.createFramebuffer();
  }

  public update(boundTo: RenderBuffer, attachTo?: number): void;
  public update(boundTo: Texture2D, level?: number, bindIndex?: number): void;
  public update(boundTo: Texture2D | RenderBuffer, level?: number, bindIndex?: number): void {
    this.gl.bindFramebuffer(WebGLRenderingContext.FRAMEBUFFER, this.fbo);
    if (boundTo instanceof Texture2D) {
      if (typeof bindIndex === "undefined") {
        bindIndex = 0;
      }
      if (typeof level === "undefined") {
        level = 0;
      }
      this.gl.framebufferTexture2D(WebGLRenderingContext.FRAMEBUFFER, WebGLRenderingContext.COLOR_ATTACHMENT0 + bindIndex, WebGLRenderingContext.TEXTURE_2D, boundTo.texture, level);
      if (this.gl.checkFramebufferStatus(WebGLRenderingContext.FRAMEBUFFER) !== WebGLRenderingContext.FRAMEBUFFER_COMPLETE) {
        throw new Error("INCOMPLETE framebuffer");
      }
    } else if (boundTo instanceof RenderBuffer) {
      const registerTarget: number = typeof level === "undefined" ? WebGLRenderingContext.DEPTH_ATTACHMENT : level;
      this.gl.framebufferRenderbuffer(WebGLRenderingContext.FRAMEBUFFER, registerTarget, WebGLRenderingContext.RENDERBUFFER, boundTo.renderBuffer);
    }
    this.gl.bindFramebuffer(WebGLRenderingContext.FRAMEBUFFER, null);
  }

  public bind(): void {
    this.gl.bindFramebuffer(WebGLRenderingContext.FRAMEBUFFER, this.fbo);
  }

  public destroy(): void {
    super.destroy();
    this.gl.deleteFramebuffer(this.fbo);
  }
}
