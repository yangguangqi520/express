//存取localStorage中的数据
var store={    //封装一个对象
    save(key,value){  //es6函数写法
        localStorage.setItem(key,JSON.stringify(value));  //将数据转换为json形式的字符串

    },
    fetch(key){
        return JSON.parse(localStorage.getItem(key))||[];
        //获得的数据是json字符串，需要用json.parse解析一下,若没取到就返回空
    }
}
//取出所有的值
//到localStorage中取数据
var matter_list=store.fetch("boss_matters");
var menu_list=store.fetch("boss_menus");

var top_bar = new Vue({
	el: '#top_bar',
	data:{
		search_name:'',
		title:'',
		matter_name:'',
	},
	methods:{
		serach_matter:function(){
			vm.search_name = this.matter_name;
			vm.search_sign = true;
			alert(vm.search_sign);
			alert(this.matter_name);
		}
	},
});
var list = new Vue({
	el: '#menu_list',
	data:{
		newList:{
			id:"",
			name:"",
		},
		Lists:menu_list,
	},
	watch:{           //监控功能
    /* list:function(){      //监控list这个属性，当值发生变化时就会执行后面的函数
         store.save("miaov-new-class",this.list);
     }//浅监控*/
       Lists:{
           handler:function(){
               store.save("boss_menus",this.Lists);
           },
           deep:true          //深监控
       }
     },
	computed: {
		menu_lists: function(){
			
			return this.Lists;
		},
	},
	methods:{
		show_myToday:function(){
			vm.sign = 'today';
			vm.now_list_name = 'today';
			top_bar.title = '我的一天'
		},
		show_all:function(){
			vm.sign = 'all';
			vm.now_list_name = 'all';
			top_bar.title = 'To-Do';

		},
		show_lists:function(list_name){
			vm.sign = list_name;
			vm.list_name = list_name;
			vm.now_list_name = list_name;
			top_bar.title = list_name;
		},
		addList:function(){
			alert('1123');
		}
	},
});
var vm = new Vue({
	el: '#app',
	data:{
		Matters:matter_list,
		search_name_11:'',
		search: '',
		youjian:'',
		now_list_name:'',
		list_name:"",
		sign:'all',
		cur_name:'',
		cur_id:'',
		search_name:'',
		search_sign:false,
		newMatter:{
			id:0,
			name:"",
			date_year:"",
			date_month:"",
			date_day:"",
			remaining_time:'',
			situation:'',
			date_week:"",
			sign:"",
			parent_name:"",
			message:"",
			my_Today:"",
			isChecked:false,
		},
		edit:false,
		add:false,
		openAdd:false,
	},
	watch:{           //监控功能
    /* list:function(){      //监控list这个属性，当值发生变化时就会执行后面的函数
         store.save("miaov-new-class",this.list);
     }//浅监控*/
       Matters:{
           handler:function(){
               store.save("boss_matters",this.Matters);
           },
           deep:true          //深监控
       }
     },
	computed:{
			show_matter: function(){
				var sort_matter = this.sort(this.Matters);
				var search = top_bar.search_name;
				if(search){
					return sort_matter.filter(function(product) {
                        return Object.keys(product).some(function(key) {
                            return String(product[key]).toLowerCase().indexOf(search) > -1
                        })
                    })
				}else if (this.sign == 'all') {
					return sort_matter;
				}else if(this.sign == 'today'){
					var day_matters = new Array();
					var j = 0;
					for (var i=0;i<sort_matter.length;i++) {
						if (sort_matter[i].my_Today&!sort_matter[i].isChecked) {
							day_matters[j++]=sort_matter[i];
						}
					}
					return day_matters;
				}else if(this.sign == this.list_name){
					var day_matters = new Array();
					var j = 0;
					for (var i=0;i<sort_matter.length; i++) {
						if (sort_matter[i].parent_name == this.list_name) {
							day_matters[j++]=sort_matter[i];
						}	
					}
					return day_matters;
				}
			},
		},
	methods:{
		callback:function(){
			this.openAdd=false;
			this.add=false;
		},
		add_my_day:function(){
			this.cur_name.my_Today=true;
		},
		addMatter:function(index){
			this.add = true;
			this.openAdd = true;
			for (var i = 0; i<this.Matters.length; i++) {
				if (this.Matters[i].id==index) {
					this.cur_name = this.Matters[i];
				}
			}
		},
		SendForm: function(){
			var uname = document.getElementById('uname').value;
			var add_date = document.getElementById('add_date').value;
			var message = document.getElementById('message').value;
			var now_date=this.getFormatYMD(Date.parse(new Date()));
			var sArr = now_date.split("-");
			var eArr = add_date.split("-");
			var sRDate = new Date(sArr[0], sArr[1], sArr[2]);
			var eRDate = new Date(eArr[0], eArr[1], eArr[2]);
			var days =  parseInt((eRDate-sRDate)/(24*60*60*1000)); 
			var situation = this.setSituation(days);
			var id = parseInt(this.Matters.length) + 1;
			this.newMatter = {
				id:id,
				name:uname,
				date_year:add_date,
				date_week:"",
				remaining_time:days,
				situation:situation,
				sign:"all",
				parent_name:this.now_list_name,
				message:message,
				my_Today:false,
				isChecked:false,
			};
			this.Matters.push(this.newMatter);
			this.newMatter = {
				id:0,
				name:"",
				date_year:"",
				remaining_time:'',
				situation:'',
				date_week:"",
				sign:"",
				parent_name:"",
				message:"",
				my_Today:"",
				isChecked:false,
			};
		},
		getFormatYMD:function(timesamp){
			var date = new Date(timesamp);
			Y = date.getFullYear() + '-';
			M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
			D = date.getDate();
			D= D.toString().length==1 ? '0'+D:D;
			return Y+M+D;
		},
		setSituation:function(days){
			if(days===2)
				return '急';
			else if(days<=1)
				return '紧急';
			else
				return '一般';
		},
		SendFormList:function(){
			var list_name = document.getElementById('list_name').value;
			var id = parseInt(list.Lists.length) + 1;
			list.newList = {
				id:id,
				name:list_name,
			}
			list.Lists.push(list.newList);

		},
		contextmenu:function(matter_id){
			init(matter_id);
			this.youjian = matter_id;
		},
		sort:function(array){
			var matter;
			var array_Checkedtwo = new Array();
			var array_Checkedone = new Array();
			var array_matter;
	        for(var i=0;i<array.length;i++) {
	            for(var j=i+1;j<array.length;j++) {
	                if(array[i].remaining_time>array[j].remaining_time) {
	                    matter = array[i];
	                    array[i] = array[j];
	                    array[j] = matter;
	                }
	            }
	        }
	        for(var i=0,j=0,k=0;i<array.length;i++) {
                if(!array[i].isChecked) {
                    array_Checkedtwo[j++] = array[i];
                }else if(array[i].isChecked){
                	array_Checkedone[k++] = array[i];
                }
	        }
			array_matter = array_Checkedtwo.concat(array_Checkedone);
	        return array_matter;
		},
		finish:function(){
			var sort_matter = this.sort(this.Matters);
			for(var i=0;i<sort_matter.length;i++)
			{
				if(sort_matter[i].id===this.youjian)
					sort_matter[i].isChecked = true;
			}
			var clientMenu = document.getElementById('clientMenu');
			clientMenu.style.visibility = 'hidden';

		},
		deletematter:function(){
			for(var i=0;i<this.Matters.length;i++)
			{
				
				if(this.Matters[i].id===this.youjian)
					this.Matters.splice(i,1);

			}
			var clientMenu = document.getElementById('clientMenu');
			clientMenu.style.visibility = 'hidden';
		},
		menu_add_today:function(){
			var sort_matter = this.sort(this.Matters);
			for(var i=0;i<sort_matter.length;i++)
			{
				if(sort_matter[i].id===this.youjian)
					sort_matter[i].my_Today = true;
			}
			var clientMenu = document.getElementById('clientMenu');
			clientMenu.style.visibility = 'hidden';
		}
	}
});