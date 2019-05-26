// global datastore
let store = { neighborhoods: [], meals: [], customers: [], deliveries: [] };
let neighborhoodId = 0
let mealId = 0
let customerId = 0
let deliveryId = 0

// A neighborhood has many deliveries
// A neighborhood has many customers through deliveries
// A neighborhood has many meals through deliveries
class Neighborhood{
  constructor(name){
    this.id = ++neighborhoodId;
    this.name = name;
    store.neighborhoods.push(this);
  }

  deliveries(){
    return store.deliveries.filter(
      function(delivery) {
        return delivery.neighborhoodId === this.id
      }.bind(this)
    )
  }

  customers(){
    return store.customers.filter(
      function(customer){
        return customer.neighborhoodId === this.id
      }.bind(this)
    )
  }
  // A neighborhood has many customers through deliveries
  // A neighborhood has many meals through deliveries
  meals(){
    let all = this.deliveries().map(delivery=> delivery.meal())
    let unique = [... new Set(all)]
    return unique
  }


}

// A meal has many customers
class Meal{
  constructor(title, price){
    this.id = ++mealId;
    this.title = title;
    this.price = price;
    store.meals.push(this);
  }

  deliveries(){
    return store.deliveries.filter(
      function(delivery){
        return delivery.mealId === this.id
      }.bind(this)
    )
  }

  //customer does not have a mealId so use map and treat as the through relationship
  //meal has deliveries through customers??
  customers(){
    return this.deliveries().map(meal=> meal.customer())
  }
  static byPrice(){
    return store.meals.sort((a,b) => b.price - a.price)
  }
}

// A delivery belongs to a meal, belongs to a customer, and belongs to a neighborhood
class Delivery {
  constructor(mealId, neighborhoodId, customerId){
    this.id = ++deliveryId;
    this.mealId = mealId;
    this.neighborhoodId = neighborhoodId;
    this.customerId = customerId;
    store.deliveries.push(this);
  }
  meal(){
    return store.meals.find(
      function(meal){
        return meal.id === this.mealId
      }.bind(this)
    )
  }

  customer(){
    return store.customers.find(
      function(customer){
        return customer.id === this.customerId
      }.bind(this)
    )
  }

  neighborhood(){
    return store.neighborhoods.find(
      function(neighborhood){
        return neighborhood.id === this.neighborhoodId
      }.bind(this)
    )
  }
}

// A customer has many deliveries
// A customer has many meals through deliveries
// A customer belongs to a neighborhood
class Customer{
  constructor(name, neighborhoodId){
    this.id = ++customerId;
    this.name = name;
    this.neighborhoodId = neighborhoodId;
    store.customers.push(this);
  }

  deliveries(){
    return store.deliveries.filter(
      function(delivery){
        return delivery.customerId === this.id
      }.bind(this)
    )
  }

  meals(){
    return this.deliveries().map(delivery => delivery.meal())
  }

  totalSpent(){
    return this.meals().reduce((accumulator, meal) => accumulator + meal.price, 0)
  }
}
