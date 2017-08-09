/*[[

]]*/
install("web.business.Group",function($S){
    var logger = Log.getLogger("web.business.Group");
    const {UI,Service,Resource} = Smart,
        {Grid, Icon,Popconfirm , Select, Row,Col,Card,Tabs ,Button ,DatePicker,DateFormat, Modal, message,Form,FormItem,Input,Switch,Lookup,Calendar} = UI;

    var curWindow = null;
    const confirm = Modal.confirm;
    const service = Service.New("goods/business/Group");
    var vaData = [];//验证删除的数据
    var appthis;

    //复选框选取内容
    var stdRows={};
    const rowSelection = {
        onSelect(record, selected, selectedRows) {
            stdRows=selectedRows;
        },
        onSelectAll(selected, selectedRows) {
            stdRows=selectedRows;
        }
    };

    const columns = [{
        title: '操作',
        dataIndex: 'operation',
        width: 80,
        render(text, row, index) {
            return (
                <span>
  				        <span title="编辑" onClick={_.bind(edit,this,row)}><i className="fa fa-pencil" /></span>
  				        <span className="ant-divider"></span>
						<span>
							<Popconfirm title="确定要删除该条分组吗？" onConfirm={_.bind(del,this,row)}><span title="删除"><i className="fa fa-trash-o" /></span></Popconfirm>
						</span>
  				      </span>
            );
        }
    },
        {
            title: '分组名称',
            dataIndex: 'groupName',
        },
        {
            title: '分组状态',
            dataIndex: 'groupStatusDesp',
        },
    ];

    var del = function(data) {
        var currId = data.id;
        if(!getVaData(currId)){
            service.remove("{0}".format(currId),(result)=>{
                if(result=="undefined"){
                    message.success('删除失败');
                }else{
                    message.success('删除成功');
                }
            });
        }else{
            message.warn('该分组已存在属性信息，不能删除！');
        }
        return;
    };

    var edit = function(data) {
        showWindow('修改界面',data)
    };

    var getVaData = (id)=> {//遍历属性表中groupNum是否存在该分组id
        let isExist=false;
        for(let i = 0;i<vaData.length;i++){
            if(id == vaData[i].groupNum) {
                isExist=true;
                break;
            }
        }
        return isExist;
    }

    const showWindow = function(title,row){
        curWindow = UI.window({
            title:title,
            width: 1000,
        },<DataTypeForm data = {row} />);
    };

    const toolbar = [{
        text:'新增',
        icon: 'solution',
        handler:function(){
            showWindow('新增界面');
        },
    },
        {
            text:'删除',
            icon: 'delete',
            handler:function(){
                if(stdRows.length == 0 || stdRows.length== undefined){
                    message.warn('请选择一条数据！');
                    return;
                }
                confirm({
                    title:'您是否确认要删除这项内容？',
                    onOk(){
                        var ids = new Array();
                        for(var x in stdRows){
                            if(getVaData(stdRows[x].id)){
                                message.warn('选择的分组中已存在属性信息，不能删除！');
                                return;
                            }
                            ids[x] = stdRows[x].id;
                        }
                        service.remove(ids,(data)=>{
                            stdRows = {};
                            message.success('删除成功');
                        });
                    },
                    onCancel(){}
                });
            }
        },
    ];
    //新增编辑界面弹窗
    const DataTypeForm = Form.create({mapPropsToFields:function(props){
        const {data} = props;
        const mapValuesJson = _.mapValues(_.extend({},data),function(value){
            return {value:value}
        });
        return mapValuesJson;
    }})(React.createClass({

        handleSubmit:function(e){
            e.preventDefault();
            const {form} = this.props;
            var fieldsValue = form.getFormatFieldsValue();
            console.log(fieldsValue);
            form.validateFields((errors,value)=>{
                if(!!errors){
                    return;
                }
                this.doSubmit(fieldsValue,form);
            });
        },
        handleReset:function(){
            this.props.form.resetFields();
        },

        doSubmit(data,form){
            if(data.id != undefined){//定义了id就是更新，否则就是更新
                service.update(data,null,(data)=>{
                    form.resetFields();
                    curWindow.close();
                })
            }else{
                service.create(data,null,(data)=>{
                    form.resetFields();
                    curWindow.close();
                });
            }
        },

        render(){
            const {form} = this.props;
            const {getFieldDecorator} = form;
            return (
                <Form horizontal>
                    <Card title="分组信息">
                        <Row>
                            <Col span="12">
                                <FormItem label = "分组名称：" labelCol = {{span:5}} wrapperCol = {{span:8}}>
                                    {getFieldDecorator('groupName',{
                                        rules:[{required:true,message:'请输入分组名称'},],
                                    })(<Input placeholder = "请输入分组名称" />)}
                                </FormItem>
                            </Col>
                            <Col span="12">
                                <FormItem label = "分组状态：" labelCol = {{span:5}} wrapperCol = {{span:8}}>
                                    {getFieldDecorator('groupStatus',{
                                        rules:[{required:true,type:'array',message:'请选择分组状态'},],
                                    })(<Lookup placeholder = "请选择分组状态" groupCode = "GroupStatus"/>)}
                                </FormItem>
                            </Col>
                        </Row>
                    </Card>
                    <FormItem wrapperCol={{ span: 12, offset: 7 }} >
                        {getFieldDecorator('id')(<Input type="hidden"  />)}
                        <Button type="primary" onClick={this.handleSubmit}>保存</Button>
                        &nbsp;&nbsp;&nbsp;
                        <Button type="ghost"  onClick={this.handleReset}>重置</Button>
                    </FormItem>
                </Form>
            );
        }
    }));

    let QForm = React.createClass({
        render() {
            const { getFieldProps} = this.props.form;


            const groupName = getFieldProps('Q_groupName_S_LK');
            const groupStatus = getFieldProps('Q_groupStatus_S_LK');

            return (
                <Form inline onSubmit={this.props.querySubmit}>
                    <FormItem label="分组名称：">
                        <Input placeholder="请输入分组名称" {...groupName} />
                    </FormItem>
                    <FormItem label="分组状态：">
                        <Lookup placeholder = "请选择分组状态" groupCode = "GroupStatus" {...groupStatus} />
                    </FormItem>
                    {this.props.children}
                </Form>
            );
        }
    });

    QForm = Form.create()(QForm);

    const App = React.createClass({
        getInitialState: function() {
            return {
                vaData:[],
            };
        },
        //获取属性表的所有数据
        componentWillMount()
        {
            vaData =this.state.vaData;
            appthis =this;
            Resource.get("services/goods/business/Attribute/list",(data)=>{
                vaData = data;
                appthis.setState({vaData:vaData});
            });
        },
        render: function() {
            return <Grid rowKey='id'
                         QForm={QForm}
                         columns={columns}
                         service={service} toolbar = {toolbar} rowSelection = {rowSelection}/>
        }
    });

    this.ready = function(){
        return App;
    };
});