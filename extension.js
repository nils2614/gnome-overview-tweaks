const Main = imports.ui.main;
const ThumbnailsBox = imports.ui.workspaceThumbnail.ThumbnailsBox
const workspaceThumbnail = imports.ui.workspaceThumbnail


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

// Increases the workspace thumbnail size to 0.08
  this.bkp_MAX_THUMBNAIL_SCALE = workspaceThumbnail.MAX_THUMBNAIL_SCALE
  workspaceThumbnail.MAX_THUMBNAIL_SCALE = 0.08
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
        
// Undo - Increases the workspace thumbnail size to 0.08
  if (this.bkp_MAX_THUMBNAIL_SCALE) {
    workspaceThumbnail.MAX_THUMBNAIL_SCALE = this.bkp_MAX_THUMBNAIL_SCALE
  }
}
