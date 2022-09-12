export class BHTTile extends Tile {
    _getTileOffset() {
        const aw = Math.abs(this.document.width);
        const ah = Math.abs(this.document.height);
        const apo = 0.5 / Math.tan(Math.PI / 6);
        if ([CONST.GRID_TYPES.HEXODDQ, CONST.GRID_TYPES.HEXEVENQ].includes(canvas.grid.type)) {
            return [aw / 2, ah * apo / 2];
        } else if ([CONST.GRID_TYPES.HEXODDR, CONST.GRID_TYPES.HEXEVENR].includes(canvas.grid.type)) {
            return [aw * apo / 2, ah / 2];
        } else {
            return [aw / 2, ah / 2];
        }
    }

    /** @override */
    _refresh() {
        const w = this.document.width;
        const h = this.document.height;
        const r = Math.toRadians(this.document.rotation);

        // Update tile appearance
        this.position.set(this.document.x, this.document.y);
        if (this.tile) {

            this.tile.scale.x = w / this.texture.width;
            this.tile.scale.y = h / this.texture.height;
            this.tile.position.set(...this._getTileOffset());
            this.tile.rotation = r;

            // Tile appearance
            this.tile.alpha = this.document.hidden ? Math.min(0.5, this.document.alpha) : this.document.alpha;
            this.tile.tint = this.mesh.tint ? foundry.utils.colorStringToHex(this.mesh.tint) : 0xFFFFFF;
        }

        if ( this.mesh ) this.mesh.refresh();

        // Temporary tile background
        if (this.bg) this.bg.clear().beginFill(0xFFFFFF, 0.5).drawRect(0, 0, w, h).endFill();

        // Define bounds and update the border frame
        let bounds = (w === h) ?
            new NormalizedRectangle(0, 0, w, h) : // Square tiles
            NormalizedRectangle.fromRotation(0, 0, w, h, r); // Non-square tiles
        this.hitArea = this._controlled ? bounds.clone().pad(20) : bounds;
        this._refreshBorder(bounds);
        this._refreshHandle(bounds);

        // Set visibility
        this.visible = !this.document.hidden || game.user.isGM;
    }
}