Array.prototype.each = function(func){
  for(var i = 0;i < this.length;i ++){
    func.call(this[i],i);
  }
}
var Compile = {
  functionAppend: function(funcString,addCode){//在一个function最后添加代码
      var reg = /}$/;
      return funcString.replace(reg,";" + addCode + "}");
  },
  timeoutCompile: function(funcString,addCode){
      var reg = /setTimeout\((function\(\)\{[^\}]*\})/i;
      var regFunc = reg.exec(funcString)[1] || "";
      var _this = this;
      return funcString.replace(reg,function(word){return _this.functionAppend(word,addCode)});

  }
};
function Timing(methodQueue){
  var methodArr = methodQueue.split("->");
  var functionArr = [];
  methodArr.each(function(i){
      functionArr.push(eval(methodArr[i]));
  });
  for(var i = 0;i < functionArr.length;i ++){
      var functionString = functionArr[i].toString();
      if(methodArr[i + 1]) {
        var compileString = Compile.timeoutCompile(functionString,methodArr[i + 1] + "();");
        eval(compileString);
      }
  }
  eval(methodArr[0])();
}
