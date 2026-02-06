// A utility is a piece of code that performs a general-purpose task and can be reused in different parts of your program.

module.exports = (fn)=>{
    return function(req,res,next){
        fn(req,res,next).catch(next);
    }
}