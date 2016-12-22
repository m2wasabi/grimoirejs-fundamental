import gr from "grimoirejs";
import MaterialFactory from "../Material/MaterialFactory";
import Material from "../Material/Material";
import Component from "grimoirejs/ref/Node/Component";
import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";
import ResourceBase from "../Resource/ResourceBase";


export default class MaterialComponent extends Component {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    type: {
      converter: "String",
      default: null
    }
  };

  public materialPromise: Promise<Material>;

  public material: Material;

  public ready: boolean;

  public materialArgs: { [key: string]: any } = {};

  public $mount(): void {
    const typeName = this.getAttribute("type");
    if (typeName) {
      this.materialPromise = (this.companion.get("MaterialFactory") as MaterialFactory).instanciate(typeName);
      this._registerAttributes();
    }
  }

  private async _registerAttributes(): Promise<void> {
    this.material = await this.materialPromise;
    for (let key in this.material.argumentDeclarations) {
      this.__addAtribute(key, this.material.argumentDeclarations[key]);
      this.getAttributeRaw(key).boundTo(key, this.material.arguments);
    }
    for (let key in this.material.macroDeclarations) {
      this.__addAtribute(key, this.material.macroDeclarations[key]);
      this.getAttributeRaw(key).watch((v) => {
        this.material.setMacroValue(key, v);
      }, true);
    }
    this.ready = true;
  }
}
