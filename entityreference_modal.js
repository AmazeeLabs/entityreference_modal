(function($) {

  /**
   * The "id" attribute of the input element near which an Action link was used.
   */
  var lastActiveElementId = '';

  /**
   * Loads action links for the Actions dropdown.
   */
  Drupal.behaviors.entityreferenceModalLoadActions = {
    attach: function(context, settings) {
      if (!settings.entityreferenceModal || !settings.entityreferenceModal.elementIdToFieldNameMap) {
        return;
      }
      $.each(settings.entityreferenceModal.elementIdToFieldNameMap, function(elementId, fieldName) {
        if (!settings.entityreferenceModal || !settings.entityreferenceModal.fields || !settings.entityreferenceModal.fields[fieldName]) {
          return;
        }
        var fieldSettings = settings.entityreferenceModal.fields[fieldName];
        $('#' + elementId, context).once('entityreference-modal', function() {
          var $autocomplete = $(this);
          var $dropdown = $autocomplete.closest('.form-item').parent().find('.entityreference-modal-actions');
          var $dropdownContainer = $dropdown.find('.ctools-dropdown-container');
          var $list = $dropdown.find('.ctools-dropdown-container ul');
          var initialListContent = $list.html();
          $dropdown.find('.ctools-dropdown-link-wrapper a').mouseup(function() {
            var listIsVisible = !$dropdownContainer.is(':visible');
            if (listIsVisible) {
              $list.html(initialListContent);
              var match = $autocomplete.val().match(/ \(([0-9]+)\)$/);
              var entityId = match ? match[1] : null;
              var $language = $autocomplete.closest('form').find('select[name=language]:enabled');
              $.post(fieldSettings.actionsUrl, {entity_id: entityId}, function(response) {
                $list.html(response.links);
                Drupal.attachBehaviors($list, settings);
                lastActiveElementId = elementId;
              });
            }
          });
        });
      });
    }
  };

  /**
   * Behaviors for the action links.
   */
  Drupal.behaviors.entityreferenceModalProcessActions = {
    attach: function (context, settings) {
      $('a.entityreference-modal-action', context).once('entityreference-modal-action').click(function() {
        Drupal.EntityreferenceModal.open($(this).attr('href'));
        return false;
      });
    }
  };

  /**
   * Dialog functionality.
   */
  Drupal.EntityreferenceModal = {

    /**
     * The jQuery Dialog instance which is currently opened.
     */
    dialog: null,

    /**
     * Opens an URL in the dialog.
     */
    open: function (url) {
      if (!this.dialog) {
        this.dialog = $('<iframe src="' + url + '" style="min-width: 100%;height:100%;"></iframe>').dialog({
          width: $(window).width() / 100*80,
          height: $(window).height() / 100*90,
          modal: true,
          resizable: false,
          position: ['center', 50],
          close: function () {
            Drupal.EntityreferenceModal.dialog = null;
          }
        });
      }
    },

    /**
     * Closes dialog.
     */
    close: function (inputValue) {
      this.dialog.dialog('close');
      $('#' + lastActiveElementId).val(inputValue);
    }
  };

})(jQuery);
