import Component from "grimoirejs/ref/Core/Component";
import { IAttributeDeclaration } from "grimoirejs/ref/Interface/IAttributeDeclaration";
import ISceneUpdateArgument from "../SceneRenderer/ISceneUpdateArgument";
import RenderQueueRegistry from "../SceneRenderer/RenderQueueRegistry";
import Timer from "../Util/Timer";
import HierarchycalComponentBase from "./HierarchicalComponentBase";

/**
 * 特定のシーン内に関連する処理を行うためのコンポーネント
 * このコンポーネントには属性が存在しません。
 */
export default class Scene extends HierarchycalComponentBase {
  public static componentName = "Scene";
  public static attributes: { [key: string]: IAttributeDeclaration } = {};

  private static _sceneDescriptionCreationHandlers: ((sd: { [key: string]: any }, scene: Scene) => void)[] = [];

  public static onSceneDescriptionCreation(handler: (sd: { [key: string]: any }, scene: Scene) => void): void {
    Scene._sceneDescriptionCreationHandlers.push(handler);
  }

  public sceneDescription: { [key: string]: any } = {};

  public queueRegistry: RenderQueueRegistry = new RenderQueueRegistry();

  /**
   * The index of loop executed last time.
   * @type {number}
   */
  private _lastUpdateIndex: number;

  protected $mount(): void {
    super.$mount();
    Scene._sceneDescriptionCreationHandlers.forEach(v => v(this.sceneDescription, this));
  }

  protected $unmount(): void {
    super.$unmount();
  }

  /**
   * Notify update scene only when send update message is needed.
   * @param {Timer} timer [description]
   */
  public updateScene(timer: Timer): void {
    if (this._lastUpdateIndex !== timer.frameCount) {
      const sceneUpdateInfo: ISceneUpdateArgument = {
        sceneDescription: this.sceneDescription,
        timer,
      };
      this.node.broadcastMessage("update", sceneUpdateInfo);
      this._lastUpdateIndex = timer.frameCount;
    }
  }
}
