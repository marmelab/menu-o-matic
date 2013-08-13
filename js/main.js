$(function(){

  var Menu = Backbone.Model.extend({
    defaults: function() {
      return {
        title: '',
        url: '',
        order: Menus.nextOrder()
      };
    }
  });

  var MenuList = Backbone.Collection.extend({
    model: Menu,
    localStorage: new Backbone.LocalStorage("menus-backbone"),
    nextOrder: function() {
      if (!this.length) return 1;
      return this.last().get('order') + 1;
    },
    comparator: 'order'
  });

  var Menus = new MenuList();
  var menuFormView;

  var MenuView = Backbone.View.extend({
    tagName:  "li",
    events: {
      "click"     : "select"
    },
    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.remove);
    },
    render: function() {
      this.$el
        .addClass('item')
        .attr({
          'tabindex': this.model.get('order'),
          'data-url': this.model.get('url'),
          'title': this.model.get('url')
        })
        .text(this.model.get('title'));
      return this;
    },
    select: function() {
      if (menuFormView) {
        menuFormView.remove();
      }
      menuFormView = new MenuFormView({ model: this.model });
      $(".menuform")
        .html(menuFormView.render().el)
        .show();
    }
  });

  var MenuFormView = Backbone.View.extend({
    template: _.template($('#form-template').html()),
    events: {
      'change input[name="title"]': 'updateTitle',
      'keyup input[name="title"]': 'updateTitle',
      'change input[name="url"]': 'updateUrl',
      'keyup input[name="url"]': 'updateUrl',
      'click #delete': 'removeMenu',
      'focus input': 'enterInput',
      'blur input': 'leaveInput'
    },
    initialize: function() {
      this.listenTo(this.model, 'destroy', this.remove);
    },
    render: function() {
      this.$el.html(this.template(this.model.attributes));
      return this;
    },
    updateTitle: function(e) {
      this.model.set('title', this.$('input[name="title"]').val());
    },
    updateUrl: function(e) {
      this.model.set('url', this.$('input[name="url"]').val());
    },
    removeMenu: function() {
      this.model.destroy();
    },
    enterInput: function() {
      if (this.onFormBlur) {
        clearTimeout(this.onFormBlur);
      }
    },
    leaveInput: function() {
      this.model.save();
      var self = this;
      this.onFormBlur = setTimeout(function() {
        self.remove();
      }, 500);
    }
  });

  var MenuBarView = Backbone.View.extend({
    el: $(".menubar"),
    events: {
      'click #add': 'createMenu'
    },
    initialize: function() {
      this.listenTo(this.collection, 'add', this.addOne);
      this.listenTo(this.collection, 'reset', this.addAll);
      this.listenTo(this.collection, 'all', this.render);
      // fetch menus from storage
      this.collection.fetch();
    },
    addOne: function(menu) {
      var view = new MenuView({ model: menu });
      this.$('ul').append(view.render().el);
    },
    addAll: function() {
      this.collection.each(this.addOne, this);
    },
    createMenu: function() {
      this.collection.create({title: "Nouveau menu"});
    }
  });

  var App = new MenuBarView({ collection: Menus });

});

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
