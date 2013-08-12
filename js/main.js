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

  var container = document.querySelector('.packery');
  
  var pckry = new Packery( container, {
    columnWidth: 80,
    rowHeight: 80,
    // disable initial layout
    isInitLayout: false
  });
  
  restoreSortOrder();

  // trigger initial layout
  pckry.layout();
  
  // make items draggable
  var itemElems = pckry.getItemElements();
  for ( var i=0, len = itemElems.length; i < len; i++ ) {
    var elem = itemElems[i];
    // make element draggable with Draggabilly
    var draggie = new Draggabilly( elem );
    // bind Draggabilly events to Packery
    pckry.bindDraggabillyEvents( draggie );
  }

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

  pckry.on( 'layoutComplete', storeSortOrder );
  pckry.on( 'dragItemPositioned', storeSortOrder );

});
