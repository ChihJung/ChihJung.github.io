const app = new Vue({
    el: '#app',
    data: {
        newTodo: '',
        todoArr: [],
        visiblility: 'all'
    },
    created() {
        this.setTodo()
    },
    watch:{
        todoArr : {
            deep: true,
            handler(){
                localStorage.setItem('todo', JSON.stringify(this.todoArr))
            }
        }
    },
    computed: {
        filterTodo(){
            //three state all/uncomplete/complete
            if(this.visiblility == 'all'){
                return this.todoArr
            }else if(this.visiblility == 'uncomplete'){
                return this.todoArr.filter(item => !item.isComplete)
            }else{
                return this.todoArr.filter(item => item.isComplete)
            }
        }
    },
    methods: {
        setTodo(){
            this.todoArr = (JSON.parse(localStorage.getItem('todo') || '[]'))
        },
        addTodo(){
            if(this.newTodo == ''){
                return
            }
            let todoObj = {
                id: this.todoArr.length,
                title: this.newTodo,
                isComplete: false
            }
            this.todoArr.push(todoObj)
            this.newTodo = ''
        },
        removeTodo(todo){
            let idx = this.todoArr.indexOf(todo)
            this.todoArr.splice(idx,1)
        },
        editTodo(todo){
            let idx = this.todoArr.indexOf(todo)
            let todoTitle = document.querySelectorAll('.todo-title')[idx]
            todoTitle.classList.remove('noFocusFrame')
            todoTitle.removeAttribute('readonly')
            todoTitle.focus()
        },
        setReadonly(todo){
            let idx = this.todoArr.indexOf(todo)
            let todoTitle = document.querySelectorAll('.todo-title')[idx]
            todoTitle.classList.add('noFocusFrame')
            todoTitle.setAttribute('readonly',true)
        }
    }
})