export default interface Renderer {

    ctx: CanvasRenderingContext2D;

    render(object: any): void;
}