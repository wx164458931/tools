/**
 * 技巧1:
 * 这是一个示例的
 * 这个技巧是对类型标注的一种精巧的使用示范
 * 假设定义这么一个类型，他是一个对象，这个对象中有一个方法，这个方法用于监听对象中的属性变化，变化后执行对应的回调
 * 方法实现忽略，只关注类型标注
 * 1.首先这个被监听的对象类型由于不可预测，所以得使用泛型，这个泛型就是T。
 * 2.由于被监听的约定是一个对象，所以可以对泛型T增加一个约束，即 T extends Object
 * 3.接下来是on方法，这个方法可以用来监听对象中的任意属性，为了约束第一个参数event，我们使用字符串字面量类型，即 `${K}Changed`，其中K就是属性名。
 * 4.因为使用了K泛型，所以必须在on方法中增加泛型K
 * 5.K他也要有约束，即K extends keyof T
 * 5.只对K进行上述约束会发生报错，因为keyof T 取到的类型有可能是Symbol类型，因为TS中对于对象K的类型就string、number、symbol，所以需要增加约束，即K extends string | number
 * 6.综合上述两条约束，我们对K的约束就变为K extends keyof T & (string | number)
 * 7.接下来是回调函数，这个回调函数的参数oldValue和newValue的类型就是T[K],表名他们的类型和被监听对象的属性类型一致
 * 这样我们我们的Watcher类型就定义好了,这个类型定义可以充分利用TS的类型推导，让watch方法在使用的时候避免很多错误，以及带来优秀的代码提示。
 * 可参考示例
 */
type Watcher<T extends Object> = {
  on<K extends keyof T & (string | number)>(event: `${K}Changed`, callback: (oldValue:T[K], newValue:T[K]) => void): void
}

export declare function watch<T extends Object>(obj:T): Watcher<T>

//示例
enum Sex {
  Male = 1,
  Female = 2
}

const objWatcher = watch({
  name: '张三',
  age: 18,
  sex: Sex.Female
})

objWatcher.on('sexChanged', (oldValue, newValue) => {
  /**
   * 此处可以发现，第一个参数只能填写nameChanged、ageChanged、sexChanged。
   * 同时第一个参数一旦指定，鼠标放到oldValue和newValue上，会提示对应的类型。
   * 例如第一个参数填写sexChanged，那么oldValue和newValue的类型就是Sex类型。
   */
})


/**
 * 技巧2:
 * 利用never进行类型约束
 * 达到当代码修改遗漏时会发生报错，提示我们不要忘记还有代码需要调整
 */
/**
 * 假设定义一个枚举类型产品类型，
 * 最开始有
 * Book = 'book',
 * Movie = 'movie',
 * Music = 'music',
 * Game = 'game'
 */

enum ProductType {
  Book = 'book',
  Movie = 'movie',
  Music = 'music',
  Game = 'game',
  // Food = 'food'
}

/**
 * 存在一个方法，方法中针对不同的产品类型执行不同的操作
 * 然后在里面使用switch case进行判断if也行
 * 在所有场景判断完毕后，增加一段代码const n:never = type;
 * 因为根据TS的类型 推断，我们现在已经把所有可能都走完了，最后的这个分支是不可能走到的，所以在这个分支内得type就是never类型，表示不可达到
 * 如果以后代码修改，ProductType新增了一个类型，例如food, 那么这个const n:never = type;就会报错
 * 因为此时我们的可能性还没有结束，原本type只能是never的分支中，现在type的类型不止是never，还有可能是food，而food类型是不可能赋值给一个never类型的常量n的，所以就会报错
 * 这个报错就会提示我们不要忘记还有代码需要调整
 * 可以尝试在ProductType新增一个类型，例如food，然后运行代码，就会看到报错
 * @param type 
 */
function saleProduct(type: ProductType) {
  //使用Switch来遍历所有可能
  switch (type) {
    case ProductType.Book:
      console.log('卖书')
      break 
    case ProductType.Movie:
      console.log('卖电影')
      break
    case ProductType.Music:
      console.log('卖音乐')
      break
    case ProductType.Game:
      console.log('卖游戏')
      break
    default:
      const n:never = type;
      break
  }

  //使用if来判断所有可能
  if(type === ProductType.Book) {

  }
  else if(type === ProductType.Movie) {

  }
  else if(type === ProductType.Music) {
    
  }
  else if(type === ProductType.Game) {
    
  }
  else {
    const n:never = type;
  }
}