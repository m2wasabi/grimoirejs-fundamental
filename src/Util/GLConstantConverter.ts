/**
 * Provides utility methods for converting constants like
 * * Buffer element type and typed array constructor
 * * Buffer element type and Buffer element byte size
 *  ...
 */
export default class GLConstantConverter {
    /**
     * Get size of GL element type
     * @param type gl.FLOAT,gl.UNSIGNED_BYTE,gl_BYTE...
     */
    public static getElementByteSize(type: number): number {
        const wgc = WebGLRenderingContext;
        switch (type) {
            case wgc.UNSIGNED_INT:
            case wgc.INT:
            case wgc.FLOAT:
                return 4;
            case wgc.UNSIGNED_SHORT:
            case wgc.SHORT:
                return 2;
            case wgc.BYTE:
            case wgc.UNSIGNED_BYTE:
                return 1;
            default:
                throw new Error(`Unknown gl element type ${type}`);
        }
    }

    /**
     * Obtain maximum count of specified index buffer type.
     * @param indexType gl element type to be specified as index buffer type
     */
    public static getMaxElementCountOfIndex(indexType: number): number {
        const wgc = WebGLRenderingContext;
        switch (indexType) {
            case wgc.UNSIGNED_BYTE:
                return 256;
            case wgc.UNSIGNED_SHORT:
                return 65536;
            case wgc.UNSIGNED_INT:
                return 4294967296;
            default:
                throw new Error(`${indexType} is not suitable for index buffer`);
        }
    }

    /**
     * Get typed array constructor from gl element type
     * @param type
     */
    public static getTypedArrayConstructorFromElementType(type: number): new (buffer: number[], offset?: number, length?: number) => ArrayBufferView {
        const wgc = WebGLRenderingContext;
        switch (type) {
            case wgc.UNSIGNED_BYTE:
                return Uint8Array;
            case wgc.BYTE:
                return Int8Array;
            case wgc.UNSIGNED_SHORT:
                return Uint16Array;
            case wgc.SHORT:
                return Int16Array;
            case wgc.UNSIGNED_INT:
                return Uint32Array;
            case wgc.INT:
                return Int32Array;
            case wgc.FLOAT:
                return Float32Array;
            default:
                throw new Error(`Unknown typed array constructor for element type ${type}`);
        }
    }

    /**
     * Get gl element type number from typed array constructor
     * @param ctor
     */
    public static getElementTypeFromTypedArrayConstructor(ctor: new (buffer: number[], offset?: number, length?: number) => ArrayBufferView): number {
        const wgc = WebGLRenderingContext;
        const types = [wgc.UNSIGNED_BYTE, wgc.BYTE, wgc.UNSIGNED_SHORT, wgc.SHORT, wgc.UNSIGNED_INT, wgc.INT, wgc.FLOAT];
        for (let i = 0; i < types.length; i++) {
            if (GLConstantConverter.getTypedArrayConstructorFromElementType(types[i]) === ctor) {
                return types[i];
            }
        }
        throw new Error("Provided typed array constructor is not suitable for gl resource");
    }

    /**
     * Obtain gl element type fits count of vertices.
     * @param count
     */
    public static getSuitableElementTypeFromCount(count: number): number {
        const wgc = WebGLRenderingContext;
        const types = [wgc.UNSIGNED_BYTE, wgc.UNSIGNED_SHORT, wgc.UNSIGNED_INT];
        for (let i = 0; i < types.length; i++) {
            if (count <= GLConstantConverter.getMaxElementCountOfIndex(types[i])) {
                return types[i];
            }
        }
        throw new Error(`Suitable element type was not found since ${count} is too large for WebGL buffer`);
    }
}
