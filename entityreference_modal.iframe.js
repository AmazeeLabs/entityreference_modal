(function($) {

  /**
   * Coses a dialog, if a corresponding setting presents.
   */
  Drupal.behaviors.entityreferenceModalIframe = {
    attach: function(context, settings) {
      if (settings && settings.entityreferenceModal && settings.entityreferenceModal.inputValue) {
        parent.Drupal.EntityreferenceModal.close(settings.entityreferenceModal.inputValue);
      }
    }
  };

})(jQuery);
