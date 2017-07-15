var repeat = function(func, times, wait){
  var current = 0
  var timer ;
  var timeFunc = function(param){

    return function(){
      if(current++ < times)
        func(param);
      else {
        window.clearInterval(timer)
      }
    }
  }

  var called = function(param){
    console.log(wait);
    timer = setInterval(timeFunc(param), wait);
  }
  return called;
}
