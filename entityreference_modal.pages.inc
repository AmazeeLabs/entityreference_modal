<?php

/**
 * Actions menu callback.
 */
function entityreference_modal_actions_menu_callback($field_name) {
  $field = field_info_field($field_name);
  $entity_type = $field['settings']['target_type'];
  $path_mapping = _entityreference_modal_entity_path_mapping();
  $path_mapping = $path_mapping[$entity_type];
  $entity_info = entity_get_info($entity_type);
  $entity = $_POST['entity_id'] === 'null' ? NULL : entity_load_single($entity_type, $_POST['entity_id']);
  $entity_id = $_POST['entity_id'];

  // Prepare bundles.
  $target_bundles = $field['settings']['handler_settings']['target_bundles'];
  if (empty($target_bundles)) {
    $target_bundles = array_keys($entity_info['bundles']);
  }
  $bundles = array();
  foreach ($target_bundles as $bundle) {
    $bundle_url = $entity_type == 'node' ? str_replace('_', '-', $bundle) : $bundle;
    $bundles[$bundle_url] = $entity_info['bundles'][$bundle]['label'];
  }
  if (
    strpos($path_mapping['create-entity']['path'], '[bundle-url]') === FALSE
    && strpos($path_mapping['create-entity']['label'], '[bundle-label]') === FALSE
  ) {
    $bundles = array('fake' => 'this will not be used');
  }

  // Prepare languages.
  $languages = array();
  foreach (entity_translation_languages($entity_type) as $language) {
    $languages[$language->language] = $language->name;
  }

  // Generate links.
  $links = array();
  $link_options = array(
    'query' => array(
      'entityreference_modal' => '1',
    ),
    'attributes' => array(
      'class' => array('entityreference-modal-action'),
    ),
  );
  if ($entity) {
    $source_langcode = entity_language($entity_type, $entity);
    if ($source_langcode == LANGUAGE_NONE) {
      // Edit entity.
      $label = $path_mapping['edit-entity']['label'];
      $path = str_replace('[entity-id]', $entity_id, $path_mapping['edit-entity']['path']);
      $links[] = l($label, $path, $link_options);
    }
    else {
      // Add/edit entity translations.
      $handler = entity_translation_get_handler($entity_type, $entity);
      $translations = $handler->getTranslations();
      foreach ($languages as $translation_langcode => $translation_language_label) {
        $key = isset($translations->data[$translation_langcode]) ? 'edit-translation' : 'add-translation';
        $label = str_replace('[translation-language-label]', $translation_language_label, $path_mapping[$key]['label']);
        if ($translation_langcode == $source_langcode) {
          $label .= ' (' . t('source') . ')';
        }
        $placeholders = array(
          '[source-langcode]' => $source_langcode,
          '[translation-langcode]' => $translation_langcode,
          '[entity-id]' => $entity_id,
        );
        $path = str_replace(array_keys($placeholders), array_values($placeholders), $path_mapping[$key]['path']);
        $links[] = l($label, $path, $link_options);
      }
    }
    // Open in new tab.
    $uri = entity_uri($entity_type, $entity);
    $uri['options']['attributes']['target'] = '_blank';
    $links[] = l(t('Open in new tab'), $uri['path'], $uri['options']);
  }
  else {
    // Create new entity (optionally by bundle).
    foreach ($bundles as $bundle => $bundle_label) {
      $label = str_replace('[bundle-label]', $bundle_label, $path_mapping['create-entity']['label']);
      $path = str_replace('[bundle-url]', $bundle, $path_mapping['create-entity']['path']);
      $links[] = l($label, $path, $link_options);
    }
  }
  drupal_json_output(array(
    'links' => '<li>' . implode('</li><li>', $links) . '</li>',
  ));
}

/**
 * Page callback that closes dialog.
 */
function entityreference_modal_close_page() {
  if (!empty($_GET['entityreference_modal_input_value'])) {
    drupal_add_js(drupal_get_path('module', 'entityreference_modal') . '/entityreference_modal.iframe.js');
    drupal_add_js(array(
      'entityreferenceModal' => array(
        'inputValue' => $_GET['entityreference_modal_input_value'],
      ),
    ), 'setting');
    drupal_add_css('
    body {
      display: none;
    }
  ', 'inline');
  }
  return '';
}
