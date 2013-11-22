//By default load any module IDs from js/lib
requirejs.config({ baseUrl: 'js/lib',
  paths: { 
    'jquery': '//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min'
  }
});

// Start the main app logic.
requirejs(['jquery', 'knockout', 'site'],

function ($, ko, site, jollibee) {

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

  // WIP
  // function Restaurant(name) {
  //   var self = this;
  //   self.name = name;
  // }

  // function Customer(name, orders) {
  //   var self = this;
  //   self.name = ko.observable(name, { persist: 'name' });
  //   self.orders = ko.observableArray(orders);
  // }

  // function RestaurantsViewModel() {
  //   var self = this;

  //   self.availableRestaurants = ko.observableArray(['Jollibee', 'Mcdo', 'KFC']);

  //   var restaurantsContainer = [];
  //   for (var i = 0; i < self.availableRestaurants().length; i++)
  //     var restaurant = new Restaurant(self.availableRestaurants[i]);
  //     restaurantsContainer + [restaurant] 

  //   self.restaurants = ko.observableArray(restaurantsContainer, { persist: 'restaurants' });

  //   self.customers = ko.observableArray([
  //     new Customer(null, self.orders)     
  //   ]);

  //   self.orders = [
  //     { orderName: 'chicken', price: 10 }
  //   ]

  // }

  // Class to represent a row in the seat reservations grid
  //
  function SeatReservation(name, initialMeal) {
      var self = this;
      self.name = name;
      self.meal = ko.observable(initialMeal);

      self.formattedPrice = ko.computed(function() {
          var price = self.meal().price;
          return price ? "$" + price.toFixed(2) : "None";        
      });    
  }

  // Overall viewmodel for this screen, along with initial state
  function ReservationsViewModel() {
      var self = this;

      // Non-editable catalog data - would come from the server
      self.availableMeals = [
          { mealName: "Standard (sandwich)", price: 0 },
          { mealName: "Premium (lobster)", price: 34.95 },
          { mealName: "Ultimate (whole zebra)", price: 290 }
      ];    

      // Editable data
      self.seats = ko.observableArray([
          new SeatReservation("Steve", self.availableMeals[0]),
          new SeatReservation("Bert", self.availableMeals[0])
      ]);

      // Computed data
      self.totalSurcharge = ko.computed(function() {
         var total = 0;
         for (var i = 0; i < self.seats().length; i++)
             total += self.seats()[i].meal().price;
         return total;
      });    

      // Operations
      self.addSeat = function() {
          self.seats.push(new SeatReservation("", self.availableMeals[0]));
      }
      self.removeSeat = function(seat) { self.seats.remove(seat) }
  }

  ko.applyBindings(new ReservationsViewModel());
  // ko.applyBindings(new RestaurantsViewModel());
});
