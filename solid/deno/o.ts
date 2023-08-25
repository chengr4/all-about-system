// extract item and method

class Item {
  getLogistic(): string {
    return 'A City';
  }
}

class TransportationFeeCalculator {

  // if you keep modifying this method by if-else, it violates the open-closed principle (never close)
  calculate(item: Item): number {
    if (item.getLogistic() === 'A City') {
      return 10;
    }

    return 20;
  }
}