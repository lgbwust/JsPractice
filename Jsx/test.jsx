/*[[
   
]]*/
install("web.km.UserBook",function($S){
    var logger = Log.getLogger("web.km.UserBook");
    const {UI,Service,Resource} = Smart,
        {Grid, Icon,Popconfirm , Select, Row,Col,Card,Tabs ,Button ,DatePicker,DateFormat, Modal, message,Form,FormItem,Input,Switch,Lookup,Calendar} = UI;

    var EditWindow = null;
    const Option = Select.Option;
    var ACklDepartPermission = null;

    const EditService = Service.New("/user/userbook");

    const columns = [{
        title: '操作',
        dataIndex: 'operation',
        width: 80,
        render(text,row,index) {
            return <span>
				<span disabled={false} title="编辑" onClick={_.bind(edit,this,row)}><i className="fa fa-pencil" /></span>
				<span className="ant-divider"></span>
				<span disabled={!hasPerm('10107.004')}>
					<Popconfirm title="确定要删除这条信息吗？" onConfirm={_.bind(del,this,row)}><span title="删除"><i className="fa fa-trash-o" /></span></Popconfirm>
				</span>
			</span>
        }
    },
        {
            title: 'name',
            dataIndex: 'name',
        },
        {
            title: 'others',
            dataIndex: 'others',
        },
    ];


    let QForm = React.createClass({
        render() {
            const { getFieldProps} = this.props.form;


            const name = getFieldProps('Q_name_S_LK');
            const others = getFieldProps('Q_others_S_LK');

            return (
                <Form inline onSubmit={this.props.querySubmit}>
                    <FormItem label="name：">
                        <Input placeholder="请输入name" {...name} />
                    </FormItem>
                    <FormItem label="others：">
                        <Input placeholder="请输入others" {...others} />
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
                         service={EditService} />
        }
    });



    //审核通过的编辑表单
    const EditForm = Form.create({mapPropsToFields:function(props){          //编辑弹出框
        const {data} = props;
        data.examTime = DateFormat.toDate(data.examTime);
        return _.mapValues(_.extend({},data),function(value){    // 根据data值，循环复制到各个空间
            return {value:value}
        });


    }})(React.createClass({
        handleSubmit(e) {
            e.preventDefault();
            const {form} = this.props;
            // debugger;
            var EditData = form.getFormatFieldsValue();
            var EditAllData = this.props.data;
            EditAllData.id = EditAllData.id;
            EditAllData.name = EditData.name;
            EditAllData.others = EditData.others;

            this.doSubmit(EditAllData,form);
        },
        handleReset(){
            this.props.form.resetFields();
        },
        doSubmit(data, form) {
            //处理结果
            EditService.update(data,(result)=>{
                message.success("修改成功");
            });
            EditWindow.close();
            return;
        },
        render() {
            const {linkState,form} = this.props;
            const { getFieldProps, getLookupFieldProps,getFieldError, isFieldValidating } = this.props.form;

            debugger;
            const name = getFieldProps('name', {
                rules: [
                    { required: true, message: '名称'}
                ],
            });
            const others = getFieldProps('others', {
                rules: [
                    { required: true,  message: '其它'},
                ],
            });
            return (
                <Form horizontal >
                    <div>
                        <Card title="测试信息">
                            <Row>
                                <Col span="6">
                                    <FormItem key="item2" label="名称：" labelCol={{ span: 8}} wrapperCol={{ span: 16 }}>
                                        <Input type="input" placeholder="名称"  {...name} />
                                    </FormItem>
                                </Col>

                                <Col span="6">
                                    <FormItem key="item3" label="其它：" labelCol={{ span: 8}} wrapperCol={{ span: 16 }}>
                                        <Input type="input" placeholder="其它"  {...others} />
                                    </FormItem>
                                </Col>
                            </Row>
                        </Card>
                    </div>
                    <div>
                        <Row>
                            <FormItem wrapperCol={{ span: 8, offset: 10 }} >
                                <Input type="hidden" {...getFieldProps('id')} />
                                <Button type="primary" htmlType="submit" onClick={this.handleSubmit}>保存</Button>
                                &nbsp;&nbsp;&nbsp;
                                <Button type="dashed"  onClick={this.handleReset}>重置</Button>
                            </FormItem>
                        </Row>
                    </div>
                </Form>
            );
        }
    }));

    //编辑界面的window框
    var edit = function(data){
        EditWindow = UI.window({
            title: '编辑界面',
            width: 1000,
        },<EditForm  data={data} />)
    };

    var del = function(data) {
        var currId = data.id;

        EditService.remove("{0}".format(currId),(result)=>{  //Service.New()之后则不需要写UI路径，只传参
            if(result=="undefined"){
                message.success('删除失败');
            }else{
                message.success('删除成功');
            }
        });
        return;

    };

    this.ready = function(){
        return App;
    };
});