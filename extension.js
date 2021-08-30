const Main = imports.ui.main;
const ThumbnailsBox = imports.ui.workspaceThumbnail.ThumbnailsBox
const workspaceThumbnail = imports.ui.workspaceThumbnail
const SecondaryMonitorDisplay = imports.ui.workspacesView.SecondaryMonitorDisplay


function enable () {
// Hides the search textbox
  this.c = {
    searchEntry: Main.overview.searchEntry,
    searchController: Main.overview._overview.controls._searchController,
  }

  this.c.searchEntry.hide()
    this.connectedId = this.c.searchController.connect('notify::search-active', () => {
      if (this.c.searchController.searchActive) {
        this.c.searchEntry.show();
      } else {
        this.c.searchEntry.hide();
      }
    })

// Makes the workspace thumbnails always visible
  this.bkp = ThumbnailsBox.prototype._updateShouldShow
  ThumbnailsBox.prototype._updateShouldShow = function() {
    if (!this._shouldShow) {
      this._shouldShow = true;
      this.notify('should-show');
    }
  }

// Increases the workspace thumbnail size to 0.09
  // Thumbnails on main monitor
  this.bkp_MAX_THUMBNAIL_SCALE = workspaceThumbnail.MAX_THUMBNAIL_SCALE
  workspaceThumbnail.MAX_THUMBNAIL_SCALE = 0.08

  // Thumbnails on second monitor
  this.bkp_SecondaryMonitorDisplay_getThumbnailsHeight = SecondaryMonitorDisplay.prototype._getThumbnailsHeight
  SecondaryMonitorDisplay.prototype._getThumbnailsHeight = function(box) {
    if (!this._thumbnails.visible)
      return 0;

    const [width, height] = box.get_size();
    const { expandFraction } = this._thumbnails;
    const [thumbnailsHeight] = this._thumbnails.get_preferred_height(width);
    return Math.min(
      thumbnailsHeight * expandFraction,
      height * workspaceThumbnail.MAX_THUMBNAIL_SCALE);
  }
}

function disable () {
// Undo - Hides the search textbox
  if (this.connectedId) {
    this.c.searchController.disconnect(this.connectedId)
  }

  this.c.searchEntry.show()
// Undo - Makes the workspace thumbnails always visible
  if (this.bkp) {
    ThumbnailsBox.prototype._updateShouldShow = this.bkp
  }
        
// Undo - Increases the workspace thumbnail size to 0.09
  if (this.bkp_MAX_THUMBNAIL_SCALE) {
    workspaceThumbnail.MAX_THUMBNAIL_SCALE = this.bkp_MAX_THUMBNAIL_SCALE
  }

  if (this.bkp_SecondaryMonitorDisplay_getThumbnailsHeight) {
    SecondaryMonitorDisplay.prototype._getThumbnailsHeight = this.bkp_SecondaryMonitorDisplay_getThumbnailsHeight
  }
}
