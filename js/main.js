/**
 * sort items with an arbitrary order
 * @param {Array} keys - ordered keys
 * @param {Function} getSortKey - called on each item to retrieve its key
 */
Packery.prototype.sortItems = function( keys, getSortKey ) {
  // copy items
  var itemsBySortKey = {};
  var key, item;
  for ( var i=0, len = this.items.length; i < len; i++ ) {
    item = this.items[i];
    key = getSortKey( item );
    itemsBySortKey[ key ] = item;
  }

  i=0;
  len = keys.length;
  var sortedItems = [];
  for ( ; i < len; i++ ) {
    key = keys[i];
    item = itemsBySortKey[ key ];
    this.items[i] = item;
  }
};


docReady(function() {

  var pckry = new Packery(document.querySelector('.packery'), {
    gutter: 5,
    rowHeight: 40,
    // disable initial layout
    isInitLayout: false
  });
  
  restoreSortOrder();

  // trigger initial layout
  pckry.layout();
  
  // make items draggable
  pckry.getItemElements().forEach(function(elem) {
    pckry.bindDraggabillyEvents(new Draggabilly(elem));
  });

  // make items selectable
  $('.item').on('mouseup', function(e) {
    var $el = $(this);
    $('#item_id').val($el.attr('tabindex'));
    $('#item_title').val($el.text());
    $('#item_url').val($el.data('url'));
    $('form').show();
  });

  // delete item when delete button is pressed
  $('#delete').on('click', function(e) {
    var target = $('.item[tabindex="' + $('#item_id').val() + '"]');
    pckry.remove(target.get());
    pckry.layout();
    $('form').trigger('blur');
  });

  // update item based on form change
  $('#item_title').on('change', function(e) {
    $('.item[tabindex="' + $('#item_id').val() + '"]').text($(this).val());
    pckry.layout();
  });
  $('#item_url').on('change', function(e) {
    $('.item[tabindex="' + $('#item_id').val() + '"]').data('url', $(this).val());
  });

  // hide form on blur
  var onFormBlur;
  $('form input').blur(function() {
    onFormBlur = setTimeout(function() {
    $('form').trigger('blur');
   }, 1000);
  }).focus(function() {
   clearTimeout(onFormBlur);
  });
  $('form').on('blur', function(e) {
    $(this).hide();
  }).hide();

  function applySortOrder(sortOrder) {
    pckry.sortItems(sortOrder, function(item) {
      return item.element.getAttribute('tabindex');
    });
  }

  function getSortOrder() {
    var itemElems = pckry.getItemElements();
    var sortOrder = [];
    for (var i=0; i< itemElems.length; i++) {
      sortOrder[i] = itemElems[i].getAttribute("tabindex");
    }
    return sortOrder;
  }

  function storeSortOrder() {
    localStorage.setItem('sortOrder', JSON.stringify(getSortOrder()));
  }

  function restoreSortOrder() {
    var storedSortOrder = localStorage.getItem('sortOrder');
    if (storedSortOrder) {
      applySortOrder(JSON.parse(storedSortOrder));
    }
  }

  pckry.on('layoutComplete', storeSortOrder);
  pckry.on('dragItemPositioned', function() { 
    pckry.layout(); 
  });
});
