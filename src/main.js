function SimpleVue(option){
    this.data = option?.data;
    this.methods = option?.methods;
    Object.keys(this.data).forEach(item => {
        this.proxyKeys(item)
    })
    new View(option.el, this);
}

SimpleVue.prototype = {
    proxyKeys: function (key){
        const that = this;
        Object.defineProperty(this, key, {
            enumerable: false,
            configurable: true,
            get: function (){
                return that.data[key];
            },
            set: function (data){
                that.data[key] = data;
            }
        })
    }
}
