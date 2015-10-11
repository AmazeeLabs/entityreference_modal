(function($) {

  var lastActiveElementId = '';

  Drupal.behaviors.entityreferenceModal = {
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

  Drupal.ajax.prototype.commands.entityreference_modal_update_input = function(ajax, command, status) {
    $('#' + lastActiveElementId)
      .val(command.input_value)
      .closest('.form-item')
      .append(command.messages);
  };

})(jQuery);
