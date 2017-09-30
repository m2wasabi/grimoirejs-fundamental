import RenderHitArea from "./Components/RenderHitareaComponent";
import PositionConverter from "./Converters/PositionConverter";
import NodeConverter from "./Converters/NodeConverter";
import DefaultMaterial from "./Material/Defaults/DefaultMaterial";
import GLExtRequestor from "./Resource/GLExtRequestor";
import DefaultPrimitives from "./Geometry/DefaultPrimitives";

import GrimoireInterface from "grimoirejs";
import AssetLoadingManagerComponent from "./Components/AssetLoadingManagerComponent";
import CameraComponent from "./Components/CameraComponent";
import CanvasInitializerComponent from "./Components/CanvasInitializerComponent";
import FullscreenComponent from "./Components/FullscreenComponent";
import GeometryComponent from "./Components/GeometryComponent";
import GeometryRegistoryComponent from "./Components/GeometryRegistoryComponent";
import LoopManagerComponent from "./Components/LoopManagerComponent";
import MaterialComponent from "./Components/MaterialComponent";
import MaterialContainerComponent from "./Components/MaterialContainerComponent";
import MaterialImporterComponent from "./Components/MaterialImporterComponent";
import MeshRendererComponent from "./Components/MeshRendererComponent";
import MouseCameraControlComponent from "./Components/MouseCameraControlComponent";
import RenderBufferComponent from "./Components/RenderBufferComponent";
import RendererComponent from "./Components/RendererComponent";
import RendererManagerComponent from "./Components/RendererManagerComponent";
import RenderQuadComponent from "./Components/RenderStage/RenderQuadComponent";
import RenderSceneComponent from "./Components/RenderStage/RenderSceneComponent";
import SceneComponent from "./Components/SceneComponent";
import ColorBufferTextureUpdator from "./Components/Texture/ColorBufferTextureUpdator";
import TextureContainer from "./Components/Texture/TextureContainer";
import TransformComponent from "./Components/TransformComponent";
import CanvasSizeConverter from "./Converters/CanvasSizeConverter";
import GeometryConverter from "./Converters/GeometryConverter";
import MaterialConverter from "./Converters/MaterialConverter";
import TextureConverter from "./Converters/TextureConverter";
import Texture2DConverter from "./Converters/TextureConverter";
import ViewportConverter from "./Converters/ViewportConverter";
import RenderingTargetConverter from "./Converters/RenderingTargetConverter";
import ImageTextureUpdator from "./Components/Texture/ImageTextureUpdator";
import VideoTextureUpdator from "./Components/Texture/VideoTextureUpdator";

export default () => {
    GrimoireInterface.register(async () => {
        GrimoireInterface.registerComponent("AssetLoadingManager", AssetLoadingManagerComponent);
        GrimoireInterface.registerComponent("Camera", CameraComponent);
        GrimoireInterface.registerComponent("CanvasInitializer", CanvasInitializerComponent);
        GrimoireInterface.registerComponent("Fullscreen", FullscreenComponent);
        GrimoireInterface.registerComponent("Geometry", GeometryComponent);
        GrimoireInterface.registerComponent("GeometryRegistory", GeometryRegistoryComponent);
        GrimoireInterface.registerComponent("LoopManager", LoopManagerComponent);
        GrimoireInterface.registerComponent("Material", MaterialComponent);
        GrimoireInterface.registerComponent("MaterialContainer", MaterialContainerComponent);
        GrimoireInterface.registerComponent("MaterialImporter", MaterialImporterComponent);
        GrimoireInterface.registerComponent("MeshRenderer", MeshRendererComponent);
        GrimoireInterface.registerComponent("MouseCameraControl", MouseCameraControlComponent);
        GrimoireInterface.registerComponent("RenderBuffer", RenderBufferComponent);
        GrimoireInterface.registerComponent("Renderer", RendererComponent);
        GrimoireInterface.registerComponent("RendererManager", RendererManagerComponent);
        GrimoireInterface.registerComponent("RenderQuad", RenderQuadComponent);
        GrimoireInterface.registerComponent("RenderScene", RenderSceneComponent);
        GrimoireInterface.registerComponent("Scene", SceneComponent);
        GrimoireInterface.registerComponent("ColorBufferTextureUpdator", ColorBufferTextureUpdator);
        GrimoireInterface.registerComponent("TextureContainer", TextureContainer);
        GrimoireInterface.registerComponent("Transform", TransformComponent);
        GrimoireInterface.registerComponent("RenderHitArea", RenderHitArea);
        GrimoireInterface.registerComponent("ImageTextureUpdator", ImageTextureUpdator);
        GrimoireInterface.registerComponent("VideoTextureUpdator", VideoTextureUpdator);

        GrimoireInterface.registerConverter("CanvasSize", CanvasSizeConverter);
        GrimoireInterface.registerConverter("Geometry", GeometryConverter);
        GrimoireInterface.registerConverter("Material", MaterialConverter);
        GrimoireInterface.registerConverter("Texture", TextureConverter);
        GrimoireInterface.registerConverter("Texture2D", TextureConverter);
        GrimoireInterface.registerConverter("Viewport", ViewportConverter);
        GrimoireInterface.registerConverter("Node", NodeConverter);
        GrimoireInterface.registerConverter(PositionConverter);
        GrimoireInterface.registerConverter("RenderingTarget",RenderingTargetConverter);

        GrimoireInterface.registerNode("goml", ["CanvasInitializer", "LoopManager", "AssetLoadingManager", "GeometryRegistory", "RendererManager", "Fullscreen"]);
        GrimoireInterface.registerNode("scene", ["Scene"]);
        GrimoireInterface.registerNode("object", ["Transform"]);
        GrimoireInterface.registerNode("camera", ["Camera"], { position: "0,0,10" }, "object");
        GrimoireInterface.registerNode("mesh", ["MaterialContainer", "MeshRenderer"], {}, "object");
        GrimoireInterface.registerNode("renderer", ["Renderer"]);
        GrimoireInterface.registerNode("geometry", ["Geometry"]);
        GrimoireInterface.registerNode("texture", ["TextureContainer"]);
        GrimoireInterface.registerNode("image-texture", ["ImageTextureUpdator"], {}, "texture");
        GrimoireInterface.registerNode("video-texture", ["VideoTextureUpdator"], {}, "texture");
        GrimoireInterface.registerNode("material", ["Material"]);
        GrimoireInterface.registerNode("import-material", ["MaterialImporter"]);
        GrimoireInterface.registerNode("texture-buffer", ["ColorBufferTextureUpdator"]);
        GrimoireInterface.registerNode("render-buffer", ["RenderBuffer"]);
        GrimoireInterface.registerNode("render-scene", ["RenderScene", "RenderHitArea"], {
            material: null
        });
        GrimoireInterface.registerNode("render-quad", ["MaterialContainer", "RenderQuad"], {
            material: null
        });
        DefaultPrimitives.register();
        DefaultMaterial.register();
    });
};
