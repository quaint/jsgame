class SpriteImage {
    ready: boolean = false;
    url: string = "images/sheet.png";
    image: any;

    constructor() {
        var image = new Image();
        image.src = this.url;
        image.onload = () => {
            this.ready = true;
        }
        this.image = image;
    }
}