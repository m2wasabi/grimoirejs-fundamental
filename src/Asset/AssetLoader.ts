import EEObject from "grimoirejs/ref/Base/EEObject";
import Component from "grimoirejs/ref/Core/Component";
import { Nullable } from "grimoirejs/ref/Tool/Types";
type AssetLoadingInfoTuple = {
  promise: Promise<any>,
  component: Component,
};

/**
 * Provides managing all promise on initializing resources.
 */
class AssetLoader extends EEObject {
  /**
   * Promise count registered.
   * @type {number}
   */
  public registerCount = 0;
  /**
   * Promise count finished successfully.
   * @type {number}
   */
  public loadCount = 0;
  /**
   * Promise count completed(success and errored)
   * @type {number}
   */
  public completeCount = 0;
  /**
   * Promise count errored
   * @type {number}
   */
  public errorCount = 0;
  /**
   * Main promise to provide tasks for waiting for all resource loading.
   * @type {Promise<void>}
   */
  public promise: Promise<void> = new Promise<void>((resolve) => { this._resolve = resolve; });
  /**
   * For memorize resolve function generated by main promise.
   * @type {[type]}
   */
  private _resolve: () => void;

  /**
   * Register an promise to be waited until finished.
   */
  public async register<T>(promise: Promise<T>, component: Component): Promise<Nullable<T>> {
    this.registerCount++;
    let result: Nullable<T> = null;
    try {
      result = await promise;
      this.loadCount++;
    } catch (e) {
      console.error(`Failed to resolve asset loading promise.\n\nLoading fired by: ${component.name.fqn}\nAttached node:${component.node.name.fqn}\n${e}`);
      this.errorCount++;
    }
    this.completeCount++;
    this._checkLoadCompleted();
    return result;
  }

  /**
   * Verify all promises are completed.
   */
  private _checkLoadCompleted(): void {
    this.emit("progress", this);
    if (this.registerCount === this.completeCount) {
      this._resolve();
    }
  }
}
export default AssetLoader;
