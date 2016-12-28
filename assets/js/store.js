angular.module('storeFront', [])
.controller('storeFrontCtrl',storeFrontCtrl)
.factory('storeFrontService',storeFrontService)

function storeFrontCtrl($scope, storeFrontService){
	var vm = this;
	vm.cart = storeFrontService.cart;
	vm.cartTotal = storeFrontService.cartTotal;
	vm.cartQuantity = storeFrontService.cartQuantity;

	vm.addToCart = addToCart;
	vm.removeFromCart = removeFromCart;
	vm.updateProductPrice = updateProductPrice;
	vm.updateTotals = updateTotals;

	activate();

	function activate(){
		storeFrontService.loadData().then(function(response){
			storeFrontService.products = storeFrontService.prepData(response.data.products);
			vm.products = storeFrontService.products;
		})
	}

	function addToCart(product){
		var index = storeFrontService.findItemInCart(product);
		if(index>=0){
			storeFrontService.cart[index].quantity+=1;
		}else{
			storeFrontService.cart.push({id:product.id, image: product.mainImage.ref, price:product.price, quantity:1, name:product.name, wholesale: false});
		}
		vm.updateTotals();
	}

	function removeFromCart(product){
		storeFrontService.cart.splice(storeFrontService.findItemInCart(product),1);
		vm.updateTotals();
	}

	function updateProductPrice(product){
		if(product.wholesale){
			product.price *= .75
		}else{
			product.price /= .75
		}
		vm.updateTotals();
	}

	function updateTotals(){
		storeFrontService.calculateTotals();
		vm.cartTotal = storeFrontService.cartTotal;
		vm.cartQuantity = storeFrontService.cartQuantity;
	}
}

function storeFrontService($http){
	var products = [];
	var cart = [];
	var cartTotal = 0;
	var cartQuantity = 0;
	var service = {
		products: products,
		cart: cart,
		cartTotal: cartTotal,
		cartQuantity: cartQuantity,
		loadData: loadData,
		prepData: prepData,
		findItemInCart: findItemInCart,
		calculateTotals: calculateTotals
	}

	return service;


	// functions
	function loadData(){
		return $http.get('https://sneakpeeq-sites.s3.amazonaws.com/interviews/ce/feeds/store.js');
	}

	function prepData(data){
		for(var i = 0;i<data.length;i++){
			data[i].price = data[i].msrpInCents/100;
		}
		return data;
	}

	function calculateTotals(){
		this.cartTotal = 0;
		this.cartQuantity = 0;
		for(var i = 0;i<cart.length;i++){
			this.cartTotal += (cart[i].quantity*cart[i].price);
			this.cartQuantity += parseInt(cart[i].quantity);
		}
	}

	function findItemInCart(p){
		var index = -1;
		for(var i = 0;i<cart.length;i++){
			if(cart[i].id==p.id){
				index = i;
				break;
			}
		}
		return index;
	}
}