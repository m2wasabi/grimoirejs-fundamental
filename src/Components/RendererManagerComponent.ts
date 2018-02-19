import Color4 from "grimoirejs-math/ref/Color4";
import Component from "grimoirejs/ref/Core/Component";
import { IAttributeDeclaration } from "grimoirejs/ref/Interface/IAttributeDeclaration";
import MaterialFactory from "../Material/MaterialFactory";
import Timer from "../Util/Timer";
import LoopManager from "./LoopManagerComponent";
import GLStateConfigurator from "../Material/GLStateConfigurator";
import { companion } from "grimoirejs/ref/Core/Decorator";
/**
 * 全レンダラーを管理するためのコンポーネント
 */
export default class RendererManager extends Component {
  public static componentName = "RendererManager";
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    /**
     * キャンバスの初期化色
     */
    bgColor: {
      default: new Color4(0, 0, 0, 0),
      converter: "Color4",
    },
    /**
     * キャンバスの初期化深度値
     */
    clearDepth: {
      default: 1.0,
      converter: "Number",
    },
    /**
     * goml内にrendererが一つもなかった場合に自動的に補完するかどうか
     */
    complementRenderer: {
      default: true,
      converter: "Boolean",
    },
  };

  private static _sortImportedFromHTML = false;
  @companion("gl")
  public gl!: WebGLRenderingContext;

  public bgColor!: Color4;

  public clearDepth!: number;

  public complementRenderer!: boolean;

  protected $mount(): void {
    this.__bindAttributes();
  }

  protected $treeInitialized(): void {
    this.node.getComponent(LoopManager)!.register(this.onloop.bind(this), 1000);
    if (this.getAttribute("complementRenderer") && this.node.getChildrenByNodeName("renderer").length === 0) {
      this.node.addChildByName("renderer", {});
    }
    this._importSortFromHTML();
  }

  public onloop(timer: Timer): void {
    if (this.enabled) {
      const c: Color4 = this.bgColor;
      const gc = GLStateConfigurator.get(this.gl);
      gc.applyIfChanged("clearColor", c.R, c.G, c.B, c.A);
      gc.applyIfChanged("clearDepth", this.clearDepth);
      this.gl.clearDepth(this.clearDepth);
      this.gl.clear(WebGLRenderingContext.COLOR_BUFFER_BIT | WebGLRenderingContext.DEPTH_BUFFER_BIT);
      this.node.broadcastMessage(1, "renderRenderer", {
        timer,
      });
    }
  }

  private _importSortFromHTML(): void {
    if (RendererManager._sortImportedFromHTML) {
      return;
    }
    const scripts = document.getElementsByTagName("script");
    for (let i = 0; i < scripts.length; i++) {
      i = i;
      const script = scripts.item(i);
      if (script.getAttribute("type") === "text/sort") { // If the script tag is for shader file
        const typeName = script.getAttribute("typeName");
        if (!typeName) {
          throw new Error("Every script tag with 'text/sort' type should have typeName attribute to specify the name to be registered as a material.");
        }
        const src = script.getAttribute("src");
        if (src) {
          MaterialFactory.addSORTMaterialFromURL(typeName, src);
        } else {
          MaterialFactory.addSORTMaterial(typeName, script.innerText);
        }
      }
    }
    RendererManager._sortImportedFromHTML = true;
  }
}
