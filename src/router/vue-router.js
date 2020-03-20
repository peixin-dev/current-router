class HistoryRoute {
    constructor() {
        this.current = null
    }
}


class VueRouter {
    constructor(options) {
        this.mode = options.mode || 'hash'
        this.routes = options.routes || []
        // 传递过来的路由表  改造 {'/home' : Home, '/about': About}
        this.routesMap = this.createMap(this.routes)
        // 路由中需要存放当前路径  需要状态
        this.history = new HistoryRoute()
        // 初始化
        this.init()
    }

    init() {
        if (this.mode == 'hash') {
            // 判断有无hash  并赋值
            location.hash ? '' : location.hash = '/'
            window.addEventListener('load', () => {
                this.history.current = location.hash.slice(1)
            })
            window.addEventListener('hashchange', () => {
                this.history.current = location.hash.slice(1)
            })

        } else {
            location.pathname ? '' : location.pathname = '/'
            window.addEventListener('popstate', () => {
                this.history.current = location.pathname
            })
        }
    }

    createMap(routes) {
        return routes.reduce((pre, current) => {
            pre[current.path] = current.component
            return pre
        }, {})
    }

}


VueRouter.install = (Vue) => {
    // 给每个组件挂载 $router  $route 属性
    Vue.mixin({
        beforeCreate() {
            if(this.$options && this.$options.router){
                this.$router = this.$options.router
                // observer  深度数据劫持
                Vue.util.defineReactive(this, 'xxx', this.$router.history)
            }else if(this.$parent && this.$parent.$router){
                this.$router = this.$parent.$router
            }
            Object.defineProperty(this, '$route', {
                get(){
                    return {
                        current: this.$router.history.current
                    }
                }
            })
        },
    })

    Vue.component('router-link',{
        props: {
            to: String
        },
        render() {  //  h->  createElement 
            let mode = this._self.$router.mode
            // this.$slots.default 曲默认插槽
        return <a href={mode == 'hash' ? `#${this.to}` : this.to}>{this.$slots.default}</a>
        },
    })
    Vue.component('router-view', {
        // 根据路由表 routerMap 对应的current  找到相应的组件 并渲染
        render(h) {
            //  this -> Proxy   当前实例 this.self
            let current = this._self.$route.current
            let routesMap = this._self.$router.routesMap
            console.log(current, routesMap)
            return h(routesMap[current])
        },
    })
}


export default VueRouter