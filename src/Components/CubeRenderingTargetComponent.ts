import Component from "grimoirejs/ref/Node/Component";
import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";
import OffscreenCubemapRenderTarget from "../Resource/RenderingTarget/OffscreenCubemapRenderingTarget";
import OffscreenRenderingTarget from "../Resource/RenderingTarget/OffscreenRenderingTarget";
import RenderingTrargetRegistry from "../Resource/RenderingTarget/RenderingTargetRegistry";
import RenderingTargetComponentBase from "./RenderingTargetComponentBase";
import RenderBufferUpdator from "./Texture/RenderBufferUpdator";
import TextureContainer from "./Texture/TextureContainer";
import TextureCubeContainer from "./Texture/TextureCubeContainer";
/**
 * Register specified buffer to rendering target.
 * If there were no child buffer node, this component will instanciate default buffers.
 */
export default class CubeRenderingTargetComponent extends RenderingTargetComponentBase<OffscreenCubemapRenderTarget> {
    public static attributes: { [key: string]: IAttributeDeclaration } = {
        colorBufferFormat: {
            converter: "Enum",
            default: WebGLRenderingContext.RGBA,
            table: {
                RGBA: WebGLRenderingContext.RGBA,
                RGB: WebGLRenderingContext.RGB,
                ALPHA: WebGLRenderingContext.ALPHA,
                LUMINANCE: WebGLRenderingContext.LUMINANCE,
                LUMINANCE_ALPHA: WebGLRenderingContext.LUMINANCE_ALPHA,
                SRGB_EXT: WebGLRenderingContext["SRGB_EXT"],
                SRGB_ALPHA_EXT: WebGLRenderingContext["SRGB_ALPHA_EXT"],
                DEPTH_COMPONENT: WebGLRenderingContext["DEPTH_COMPONENT"],
                DEPTH_STENCIL: WebGLRenderingContext["DEPTH_STENCIL"],
            },
        },
        colorBufferType: {
            converter: "Enum",
            default: WebGLRenderingContext.UNSIGNED_BYTE,
            table: {
                UNSIGNED_BYTE: WebGLRenderingContext.UNSIGNED_BYTE,
                UNSIGNED_SHORT_5_6_5: WebGLRenderingContext.UNSIGNED_SHORT_5_6_5,
                UNSIGNED_SHORT_4_4_4_4: WebGLRenderingContext.UNSIGNED_SHORT_4_4_4_4,
                UNSIGNED_SHORT_5_5_5_1: WebGLRenderingContext.UNSIGNED_SHORT_5_5_5_1,
                UNSIGNED_SHORT: WebGLRenderingContext.UNSIGNED_SHORT,
                UNSIGNED_INT: WebGLRenderingContext.UNSIGNED_INT,
                FLOAT: WebGLRenderingContext.FLOAT,
            },
        },
        depthBufferType: {
            converter: "Enum",
            default: WebGLRenderingContext.DEPTH_COMPONENT16,
            table: {
                NONE: 0,
                DEPTH_COMPONENT16: WebGLRenderingContext.DEPTH_COMPONENT16,
            },
        },
        resizerType: {
            converter: "String",
            default: "ViewportSize",
        },
    };
    protected __instanciateRenderingTarget(gl: WebGLRenderingContext): OffscreenCubemapRenderTarget {
        const textures = this.node.getComponentsInChildren(TextureCubeContainer);
        const texture = textures[0].texture;
        const renderBuffer = this.node.getComponentsInChildren(RenderBufferUpdator);
        return new OffscreenCubemapRenderTarget(this.companion.get("gl"), texture, renderBuffer[0].buffer);
    }

    /**
     * Generate default buffers as children node
     * @param name
     */
    protected __instanciateDefaultBuffers(name: string): void {
        this.node.addChildByName("color-buffer-cube", {
            name,
            format: this.getAttribute("colorBufferFormat"),
            type: this.getAttribute("colorBufferType"),
            resizerType: this.getAttribute("resizerType"),
        });
        if (this.getAttribute("depthBufferType") !== 0) {
            this.node.addChildByName("render-buffer", {
                name,
                type: this.getAttribute("depthBufferType"),
                resizerType: this.getAttribute("resizerType"),
            });
        }
    }
}