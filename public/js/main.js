//By default load any module IDs from js/lib
requirejs.config({ baseUrl: 'js/lib',
  paths: { 
    'jquery': '//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min'
  }
});

// Start the main app logic.
requirejs(['jquery', 'knockout', 'site'],

function ($, ko, site) {

  // Knockout Localstorage
  (function(ko){
    // Wrap ko.observable and ko.observableArray
    var methods = ['observable', 'observableArray'];

    ko.utils.arrayForEach(methods, function(method){
      var saved = ko[method];
      
      ko[method] = function(initialValue, options){
        options = options || {};

        var key = options.persist;

        // Load existing value if set
        if(key && localStorage.hasOwnProperty(key)){
          try{
            initialValue = JSON.parse(localStorage.getItem(key))
          }catch(e){};
        }

        // Create observable from saved method
        var observable = saved(initialValue);

        // Subscribe to changes, and save to localStorage
        if(key){
          observable.subscribe(function(newValue){
            localStorage.setItem(key, ko.toJSON(newValue));
          });
        };

        return observable;
      }
    })
  })(ko);

  function Customer(name, initialMeal) {
      var self = this;
      self.name = name;
      self.meal = ko.observable(initialMeal);

      self.formattedPrice = ko.computed(function() {
          var price = self.meal().price;
          return price ? "$" + price.toFixed(2) : "None";        
      });    
  }

  // Overall viewmodel for this screen, along with initial state
  function OrdertakerViewModel() {
      var self = this;

      // Non-editable catalog data - would come from the server
      self.availableMeals = [
          { mealName: "", price: 0 }, // Default
          { mealName: "Fried Chicken", price: 100 },
          { mealName: "Burgers", price: 50.95 },
          { mealName: "Pizza", price: 190.22 }
      ];    

      // Editable data
      self.customers = ko.observableArray([
          new Customer("", self.availableMeals[0]),
          new Customer("", self.availableMeals[0]),
          new Customer("", self.availableMeals[0]),
          new Customer("", self.availableMeals[0]),
          new Customer("", self.availableMeals[0])
      ]);

      self.orders = ko.computed(function() {
        var total = 0;
        for (var i = 0; i < self.customers().length; i++)
          if(self.customers()[i].meal().price != 0)
            total = total + 1
        
        return total;
      }) 

      // Computed data
      self.totalSurcharge = ko.computed(function() {
         var total = 0;
         for (var i = 0; i < self.customers().length; i++)
             total += self.customers()[i].meal().price;
         return total;
      });    

      // Operations
      self.addCustomer = function() {
          self.customers.push(new Customer("", self.availableMeals[0]));
      }

      self.removeCustomer = function(customer) { self.customers.remove(customer) }

      self.removeAll = function() {
        self.customers([]);
      }
  }

  ko.applyBindings(new OrdertakerViewModel());
});
