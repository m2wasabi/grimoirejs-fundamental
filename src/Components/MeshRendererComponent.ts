import Vector3 from "grimoirejs/lib/Core/Math/Vector3";
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
  public prog: Program;
  public geom: Geometry;
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    // Specify the attributes user can intaract
  };

  public $awake() {
    this.geom = GeometryBuilder.build(this.sharedObject.get("gl"), {
      indicies: {
        default: {
          generator: function* () {
            yield* GeometryUtility.ellipseIndex(0, 100);
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
          count: GeometryUtility.ellipseSize(100),
          getGenerators: () => {
            return {
              position: function* () {
                yield* GeometryUtility.ellipsePosition(Vector3.Zero, Vector3.YUnit.multiplyWith(0.3), Vector3.XUnit, 100);
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
    const fshader: Shader = new Shader(this.sharedObject.get("gl"), WebGLRenderingContext.FRAGMENT_SHADER, fs);
    const vshader: Shader = new Shader(this.sharedObject.get("gl"), WebGLRenderingContext.VERTEX_SHADER, vs);
    this.prog = new Program(this.sharedObject.get("gl"));
    this.prog.update([fshader, vshader]);
  }

  public $render() {
    this.geom.draw("default", ["position"], this.prog);
    this.sharedObject.get("gl").flush();
  }
}
