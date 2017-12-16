import EquirectangularToCube from "raw-loader!../../Shaders/EquirectangularToCube.sort";
import Skybox from "raw-loader!../../Shaders/Skybox.sort";
import Unlit from "raw-loader!../../Shaders/Unlit.sort";
import MaterialFactory from "../MaterialFactory";
export default class DefaultMaterial {
  public static register(): void {
    MaterialFactory.addSORTMaterial("unlit", Unlit);
    MaterialFactory.addSORTMaterial("skybox", Skybox);
    MaterialFactory.addSORTMaterial("erect2cube", EquirectangularToCube);
  }
}
