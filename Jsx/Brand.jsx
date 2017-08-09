/*[[
import "web/goods/business/component/selector.jsx"
]]*/
install("web.business.Brand",function($S){
    var logger = Log.getLogger("web.business.Brand");
    const {UI,Service,Resource} = Smart,
        {Grid, Icon,Popconfirm , Select, Row,Col,Card,Tabs ,Button ,DatePicker,DateFormat, Modal, dialog,message,Form,FormItem,Input,Switch,Lookup,Calendar} = UI;
    const confirm = Modal.confirm;
    const {Selector} = web.goods.selector;
    const service = Service.New("/goods/brand");


    const columns = [{
        title: '操作',
        dataIndex: 'operation',
        width: 80,
        render(text, row, index) {
            return <span>
				<span title="修改" onClick = {function(){UI.forward("web/goods/business/BrandEdit.jsx",{id:row.id});}}><i className="fa fa-edit" /></span>
				<span className="ant-divider"></span>
				<span title="删除" ><Popconfirm title="确定要删除这个品牌吗？" onConfirm={_.bind(del,this,row.id)}><span><i className="fa fa-trash-o" /></span></Popconfirm></span>
			</span>
        }
    },
        {
            title: '品牌名称',
            dataIndex: 'brandName',
        },
        {
            title: '品牌别名',
            dataIndex: 'brandAlias',
        },
        {
            title: '品牌LOGO',
            dataIndex: 'brandLogo',
            render(text, record, index){
                return(<a onClick = {_.bind(showDialog,this,text)}>查看</a>);
            }
        },
        {
            title: '品牌状态',
            dataIndex: 'brandStatus',
        },
    ];

    //查看品牌logo
    const showDialog = function (text) {
        Modal.success({
            title: '当前品牌logo',
            okText:"关闭",
            width: 300,
            content: <img alt={text} style={{ width: '100%' }} src ={"services/goods/brand/img/"+text}/>,
        });
    };

    //删除操作，暂时没有考虑与类目的关联关系
    const del = function(id) {
        confirm({
            title: '真的确认删除吗',
            onOk() {
                service.remove(id);
            },
        });
    };

    let QForm = React.createClass({
        render() {
            const { getFieldProps} = this.props.form;


            const brandName = getFieldProps('Q_brandName_S_LK');
            const brandAlias = getFieldProps('Q_brandAlias_S_LK');
            const brandStatus = getFieldProps('Q_brandStatus_S_LK');

            return (
                <Form inline onSubmit={this.props.querySubmit}>
                    <FormItem label="品牌名称：">
                        <Input placeholder="请输入品牌名称" {...brandName} />
                    </FormItem>
                    <FormItem label="品牌别名：">
                        <Input placeholder="请输入品牌别名" {...brandAlias} />
                    </FormItem>
                    <FormItem label="品牌状态：" >
                        <Selector style={{ width: 80 }} allowClear url="services/lookup/init/GroupStatus" placeholder="请选择状态" text="desp" valueKey="code" {...brandStatus}/>
                    </FormItem>
                    {this.props.children}
                </Form>
            );
        }
    });

    QForm = Form.create()(QForm);

    const App = React.createClass({
        getInitialState(){
            return{
                allSelectedRowKeys:[],
            }
        },
        componentWillMount(){

        },
        render: function () {
            let appThis = this;
            let {allSelectedRowKeys} = appThis.state;
            const toolbar = [{
                text: '添加新品牌',
                icon: 'plus',
                handler: () => {
                    let url = "web/goods/business/BookEdit.jsx";
                    UI.forward(url);
                }
            }, {
                text: '批量删除',
                icon: 'delete',
                handler: () => {
                    let flag = 0;
                    if (undefined == allSelectedRowKeys.length || allSelectedRowKeys.length == 0) {
                        message.warn("请至少选择一个选项！");
                    } else {
                        confirm({
                            title: "确认删除?",
                            onOk() {
                                let ids = new Array();
                                for (let x in allSelectedRowKeys) {
                                    ids[x] = allSelectedRowKeys[x];
                                }
                                service.remove(ids, (data) => {
                                    appThis.setState({allSelectedRowKeys: []});
                                }.bind(this)
                            )
                                ;
                            },
                            onCancel() {
                                return;
                            }
                        });
                    }

                }
            }];
            const rowSelection = {
                selectedRowKeys: appThis.state.allSelectedRowKeys,
                onChange(selectedRowKeys) {
                    appThis.setState({allSelectedRowKeys: selectedRowKeys});
                },
            }
            return <Grid rowKey='id'
                         QForm={QForm}
                         columns={columns}
                         toolbar={toolbar}
                         rowSelection={rowSelection}
                         service={service}/>
        }
    });

    this.ready = function(){
        return App;
    };
});