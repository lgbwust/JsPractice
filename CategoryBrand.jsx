install("web.business.CategoryBrand",function($S){
    var logger = Log.getLogger("web.business.CategoryBrand");
    const {UI,Service,Resource} = Smart,
        {Grid, Icon,Popconfirm , Col,Select,Tabs ,Button , Alert ,Tree, TreeNode,Form,FormItem, Cascader,Input,message,Upload,Lookup,Row} = UI;
    const service = Service.New("/goods/categorybranddetail");
    const cbservice = Service.New("/goods/categorybranddetail");
    const columns = [{
        title: '操作',
        dataIndex: 'operation',
        width: 80,
        render(text, row, index) {
            return
				<span title="删除" ><Popconfirm title="确定要删除这个品牌吗？" onConfirm={_.bind(del,this,row.id)}><span><i className="fa fa-trash-o" /></span></Popconfirm></span>
        }
    },
        {
            title: '类目名称',
            dataIndex: 'categoryName',
            render(text, record,index){
                return (
                    <span>
	  					<span onClick={_.bind(showCagInf,this,record)}><a href='javascript:void(0);'>{text}</a></span>
	  					</span>
                );
            }
        },
        {
            title: '品牌名称',
            dataIndex: 'brandName',
            render(text, record,index){
                return (
                    <span>
	  					<span onClick={_.bind(showBrandInf,this,record)}><a disabled = {false}>{text}</a></span>
	  					</span>
                );
            }
        },
        {
            title: '品牌序号',
            dataIndex: 'brandOrdinal',
        },
    ];

    //类目详情页面
    const CagColumns = [
        {
            title: '类目名称',
            dataIndex:'categoryName',
        },
        {
            title: '类目图标',
            dataIndex: 'categoryLogo',
        },
        {
            title: '类目状态',
            dataIndex: 'categoryStatus',
        },
    ];

    //品牌详情页面
    const BrandColumns = [
        {
            title: '品牌名称',
            dataIndex:'brandName'
        },
        {
            title:'品牌别名',
            dataIndex:'brandAlias',
        },
        {
            title:'品牌图标',
            dataIndex:'brandLogo',
        },
        {
            title:'品牌状态',
            dataIndex:'brandStatus',
        },
    ];

    //Window
    var showCagInfWindow = null;
    var showCagInf = function(data){
        showCagInfWindow = UI.window({
                title: '类目详情页面',
                width: 1000,
            },
            <CagGrid data = {data}/>
        )
    };

    const CagGrid=React.createClass({
        render(){
            var {id} =this.props.data;
            var qs = {Q_id_L_EQ :id};
            return (<Grid
                    qs = {qs}
                    columns = {CagColumns}
                    service = {service} />
            );
        }
    });

    var showBrandInfWindow = null;
    var showBrandInf = function(data){
        showBrandInfWindow = UI.window({
                title: '品牌详情页面',
                width : 1000,
            },
            <BrandGrid data = {data}/>
        )
    };
    const BrandGrid=React.createClass({
        render(){
            var {id} =this.props.data;

            var qs = {Q_id_L_EQ :id};
            return (<Grid
                    columns = {BrandColumns}
                    qs = {qs}
                    service = {service}/>
            );
        }
    });

    //删除操作
    const del = function(id) {
        confirm({
            title: '真的确认删除吗',
            onOk() {
                service.remove(id);
            },
        });
    };

    //查询窗口
    let QForm = React.createClass({
        render() {
            const { getFieldProps} = this.props.form;
            const categoryName = getFieldProps('Q_categoryName_S_LK');
            const brandName = getFieldProps('Q_brandName_LK');
            return (
                <Form inline onSubmit={this.props.querySubmit}>
                    <FormItem label="类目名称：">
                        <Input placeholder="请输入类目名称" {...categoryName} />
                    </FormItem>
                    <FormItem label="品牌名称：">
                        <Input placeholder="请输入品牌名称" {...brandName} />
                    </FormItem>
                    {this.props.children}
                </Form>
            );
        }
    });

    QForm = Form.create()(QForm);
    const App = React.createClass({
        render: function() {
            return <Grid rowKey='id'
                         QForm={QForm}
                         columns={columns}
                         service={cbservice} />
        }
    });

    this.ready = function(){
        return App;
    };
});