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
      "click":       "select",
      "updateOrder": "updateOrder"
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
      this.$el.parent().children('.item').removeClass('selected');
      this.$el.addClass('selected');
      menuFormView = new MenuFormView({ model: this.model });
      $(".menuform")
        .html(menuFormView.render().el)
        .show()
        .find('input[name="title"]').focus();
    },
    updateOrder: function() {
      this.model.save({ order: this.el.tabIndex });
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
      if (!confirm('Vous êtes sur le point de supprimer le menu "' + this.model.get('title') + '".')) return;
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
        $('.item').removeClass('selected');
      }, 500);
    }
  });

  var MenuBarView = Backbone.View.extend({
    el: $(".menubar"),
    events: {
      'click #add': 'createMenu'
    },
    initialize: function() {
      // fetch menus from storage and reorder
      this.collection.fetch();
      this.collection.sortBy('order');
      // render
      this.addAll();
      // bind collection events
      this.listenTo(this.collection, 'add', this.addOne);
      this.listenTo(this.collection, 'remove', this.removeOne);
      this.listenTo(this.collection, 'change', this.updateLayout);
      this.listenTo(this.collection, 'reset', this.addAll);
      // initialize Packery
      pckry = new Packery(this.$('.menus').get(0), {
        gutter: 5,
        rowHeight: 40,
        "itemSelector": ".item",
        "stamp": ".stamp"
      });
      // make items draggable
      pckry.getItemElements().forEach(function(elem) {
        pckry.bindDraggabillyEvents(new Draggabilly(elem));
      });
      pckry.on('layoutComplete', this.orderItems.bind(this));
      pckry.on('dragItemPositioned', this.updateLayout.bind(this));
      this.pckry = pckry;
    },
    addOne: function(menu) {
      var view = new MenuView({ model: menu });
      this._views.push(view);
      var elem = view.render().el;
      $(elem).addClass('selected');
      this.$('ul').append(elem);
      this.pckry.prepended(elem);
      this.updateLayout();
      this.pckry.bindDraggabillyEvents(new Draggabilly(elem));
    },
    removeOne: function(menu) {
      var viewToRemove = _(this._views).select(function(view) { return view.model === menu; })[0];
      this._views = _(this._views).without(viewToRemove);
      this.pckry.remove(viewToRemove.el);
      this.updateLayout();
    },
    updateLayout: function() {
      this.pckry.layout();
    },
    addAll: function() {
      this._views = [];
      var self = this;
      this.collection.each(function(menu) {
        var view = new MenuView({ model: menu });
        self._views.push(view);
        self.$('ul').append(view.render().el);
      });
    },
    orderItems: function() {
      // items are in order within the layout
      var itemElems = this.pckry.getItemElements();
      for (var i = 0, len = itemElems.length; i < len; i++) {
        var elem = itemElems[i];
        elem.tabIndex = i + 1;
        $(elem).trigger('updateOrder'); // caught by menu views
      }
    },
    createMenu: function() {
      var model = this.collection.create({ title: "Nouveau menu" });
      var viewToSelect = _(this._views).select(function(view) { return view.model === model; })[0];
      viewToSelect.$el.trigger('click');
    }
  });

  var App = new MenuBarView({ collection: Menus });

});
