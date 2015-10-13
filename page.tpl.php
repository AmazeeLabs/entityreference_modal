<div id="branding" class="clearfix">
  <?php if ($title): ?>
    <h1 class="page-title"><?php print $title; ?></h1>
  <?php endif; ?>
</div>
<div id="page">
  <div id="content" class="clearfix">
    <div class="element-invisible"><a id="main-content"></a></div>
    <?php if ($messages): ?>
      <div id="console" class="clearfix"><?php print $messages; ?></div>
    <?php endif; ?>
    <?php if ($page['help']): ?>
      <div id="help">
        <?php print render($page['help']); ?>
      </div>
    <?php endif; ?>
    <?php print render($page['content']); ?>
  </div>
</div>
<?php if ($page['footer']):?>
  <div id="footer">
    <?php print render($page['footer']);?>
  </div>
<?php endif;?>
