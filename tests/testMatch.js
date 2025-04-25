class TestClass {
    static hi = 'hi';
  constructor() {
    this.name = 'testClass';
  }

  testMethodA = () => {
    return 'testA';
  }

  test_MethodB = () => {
    return 'testB';
  }
}

const getAllMethods = (obj) => {
    let props = []

    do {
        const l = Object.getOwnPropertyNames(obj)
            .concat(Object.getOwnPropertySymbols(obj).map(s => s.toString()))
            .sort()
            .filter((p, i, arr) =>
                typeof obj[p] === 'function' &&  //only the methods
                p !== 'constructor' &&           //not the constructor
                (i == 0 || p !== arr[i - 1]) &&  //not overriding in this prototype
                props.indexOf(p) === -1          //not overridden in a child
            )
        props = props.concat(l)
    }
    while (
        (obj = Object.getPrototypeOf(obj)) &&   //walk-up the prototype chain
        Object.getPrototypeOf(obj)              //not the the Object prototype methods (hasOwnProperty, etc...)
    )

    return props
}

const testClass = new TestClass();
console.log(getAllMethods(testClass));