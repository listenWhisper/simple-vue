function View(el, vm){
    this.el = document.querySelector(el);
    this.vm = vm;
    this.init();
}


View.prototype = {
    init: function (){
        if(this.el){
            this.fragment = this.nodeToFragment(this.el);
            this.compileElement(this.fragment);
            this.el.append(this.fragment);
        }else{
            console.log('Dom元素未找到')
        }
    },
    nodeToFragment: function (el){
        const fragment = document.createDocumentFragment();
        let child = el.firstChild;
        while (child){
            fragment.append(child);
            child = el.firstChild
        }
        return fragment;
    },
    compileElement: function (fragment){
        const childNodes = fragment.childNodes;
        childNodes.forEach(node => {
            const reg = /\{\{(.*)\}\}/;
            const content = node.textContent;
            if(node.nodeType === 1){ // div或者p元素
                this.elementCompile(node);
            }else if(node.nodeType === 3 && reg.test(content)){ // text
                this.compileText(node, reg.exec(content)[1]);
            }
            if(childNodes?.childNodes.length){
                this.compileElement(node)
            }
        })
    },
    elementCompile(node){

    },
    compileText(node, exp){
        const text = this.vm[exp];
        this.updateText(node, text);
    },
    updateText(node, text){
        node.textContent = !text? '' : text;
    }
}
