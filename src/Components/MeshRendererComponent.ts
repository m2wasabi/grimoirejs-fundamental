import IRenderMessageArgs from "../Camera/IRenderMessageArgs";
import TransformComponent from "./TransformComponent";
import {Vector3} from "grimoirejs-math";
import Geometry from "../Geometry/Geometry";
import Program from "../Resource/Program";
import GeometryBuilder from "../Geometry/GeometryBuilder";
import Shader from "../Resource/Shader";
import Component from "grimoirejs/lib/Core/Node/Component";
import IAttributeDeclaration from "grimoirejs/lib/Core/Node/IAttributeDeclaration";
import GeometryUtility from "../Geometry/GeometryUtility";

import fs from "../TestShader/Sample_frag.glsl";
import vs from "../TestShader/Sample_vert.glsl";

export default class MeshRenderer extends Component {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    // Specify the attributes user can intaract
  };

  public prog: Program;
  public geom: Geometry;
  private _transformComponent: TransformComponent;

  public $awake() {
    this.geom = GeometryBuilder.build(this.companion.get("gl"), {
      indicies: {
        default: {
          generator: function* () {
            yield* GeometryUtility.cubeIndex(0);
          },
          topology: WebGLRenderingContext.TRIANGLES
        },
        wireframe: {
          generator: function* () {
            yield* GeometryUtility.linesFromTriangles(GeometryUtility.ellipseIndex(0, 100));
          },
          topology: WebGLRenderingContext.LINES
        }
      },
      verticies: {
        main: {
          size: {
            position: 3,
            normal: 3,
          },
          count: GeometryUtility.cubeSize(),
          getGenerators: () => {
            return {
              position: function* () {
                yield* GeometryUtility.cubePosition(Vector3.Zero, Vector3.YUnit, Vector3.XUnit, Vector3.ZUnit.negateThis());
                // yield* GeometryUtility.ellipsePosition(new Vector3(0, 0, -0.3), Vector3.YUnit.multiplyWith(0.3), Vector3.XUnit, 100);
              },
              normal: function* () {
                while (true) {
                  yield* [0, 0, 1];
                }
              }
            };
          }
        }
      }
    });
    const fshader: Shader = new Shader(this.companion.get("gl"), WebGLRenderingContext.FRAGMENT_SHADER, fs);
    const vshader: Shader = new Shader(this.companion.get("gl"), WebGLRenderingContext.VERTEX_SHADER, vs);
    this.prog = new Program(this.companion.get("gl"));
    this.prog.update([fshader, vshader]);
  }
  public $mount() {
    this._transformComponent = this.node.getComponent("Transform") as TransformComponent;
  }

  public $render(args: IRenderMessageArgs) {
    this.prog.use();
    this.prog.uniforms.uniformMatrix("_matPVW", this._transformComponent.calcPVW(args.camera.camera));
    this.geom.draw("default", ["position"], this.prog);
    this.companion.get("gl").flush();
  }
}