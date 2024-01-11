// extract item and method

class Item {
  item: string;
  getLogistic(): string {
    return this.item;
  }
  setLogistic(item: string): void {
    this.item = item;
  }
}

// "open" for extension
// for calculateGood()
const logisticMap = {
  "A City": () => 10,
  "B City": () => 20,
}

class TransportationFeeCalculator {

  // if you keep modifying this method by if-else, it violates the open-closed principle (never close)
  calculateBad(item: Item): number {
    if (item.getLogistic() === 'A City') {
      return 10;
    }
    
    return 20;
  }
  
  // the calculate should be our "closed" interface
  calculateGood(item: Item): number {
    return logisticMap[item.getLogistic()]();
  }
}