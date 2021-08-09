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
            if(node?.childNodes?.length){
                this.compileElement(node)
            }
        })
    },
    elementCompile(node){
        const attributes = node.attributes;
        const that = this;
        Array.prototype.forEach.call(attributes, (attr) => {
            let attrName = attr.name;
            if(attrName.indexOf('v-') !== 0){
                return;
            }
            if(attrName.indexOf('v-model') === 0){
                that.elementCompileModel(node, attr, this.vm);
            }else if(attrName.indexOf('v-html') === 0){
                that.elementCompileHtml(node, attr, this.vm);
            }else if(attrName.indexOf('v-bind') === 0){
                that.elementCompileBind(node, attr, this.vm);
            }else if(attrName.indexOf('v-on:click') === 0){
                that.elementCompileEvent(node, attr, this.vm);
            }else{
                console.error(`无法识别${attrName}`)
            }
        })
    },
    elementCompileModel(node, attr, vm){
        const value = attr.value;
        node.value = vm.data[value];
        node.removeAttribute(attr.name);
    },
    elementCompileBind(node, attr, vm){
        const name = attr.name;
        const value = attr.value;
        const reg = /\:(.*)/;
        const bindName = reg.exec(name)[1];
        node[bindName] = vm.data[value]
    },
    elementCompileHtml(node, attr, vm){
        node.removeAttribute(attr.name);
    },
    elementCompileEvent(node, attr, vm){
        const value = attr.value;
        const handle = vm.methods && vm.methods[value];
        if(handle){
            node.addEventListener('click', handle.bind(vm), false);
        }
        node.removeAttribute(attr.name);
    },
    compileText(node, exp){
        const text = this.vm[exp];
        this.updateText(node, text);
    },
    updateText(node, text){
        node.textContent = !text? '' : text;
    }
}
