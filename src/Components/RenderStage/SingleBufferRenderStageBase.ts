import Color4 from "grimoirejs-math/ref/Color4";
import IAttributeDeclaration from "grimoirejs/ref/Interface/IAttributeDeclaration";
import IRenderingTarget from "../../Resource/RenderingTarget/IRenderingTarget";
import RenderStageBase from "./RenderStageBase";

export default class SingleBufferRenderStageBase extends RenderStageBase {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    out: {
      converter: "RenderingTarget",
      default: "default",
    },
    clearColor: {
      default: "#0000",
      converter: "Color4",
    },
    clearColorEnabled: {
      default: true,
      converter: "Boolean",
    },
    clearDepthEnabled: {
      default: true,
      converter: "Boolean",
    },
    clearDepth: {
      default: 1,
      converter: "Number",
    },
  };

  public clearColor: Color4;

  public clearColorEnabled: boolean;

  public clearDepth: number;

  public clearDepthEnabled: boolean;

  public _out: Promise<IRenderingTarget>;

  public out: IRenderingTarget;

  public $awake(): void {
    this.getAttributeRaw("clearColor").bindTo("clearColor");
    this.getAttributeRaw("clearColorEnabled").bindTo("clearColorEnabled");
    this.getAttributeRaw("clearDepthEnabled").bindTo("clearDepthEnabled");
    this.getAttributeRaw("clearDepth").bindTo("clearDepth");
    this.getAttributeRaw("out").watch((promise: Promise<IRenderingTarget>) => {
      this._out = promise;
      promise.then(r => this.out = r);
    }, true);
  }

  protected __beforeRender(): boolean {
    if (!this.out) {
      return false;
    }
    let clearFlag = 0;
    if (this.clearColorEnabled) {
      clearFlag |= WebGLRenderingContext.COLOR_BUFFER_BIT;
    }
    if (this.clearDepthEnabled) {
      clearFlag |= WebGLRenderingContext.DEPTH_BUFFER_BIT;
    }
    this.out.beforeDraw(clearFlag, this.clearColor.rawElements as number[], this.clearDepth);
    return true;
  }
}
