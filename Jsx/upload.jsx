install("web.smartas.security.role",function($S){
    const {UI,Service} = Smart;
    const {Select, Radio,Checkbox,Input, Button, Lookup, InputNumber,Row,Col, Form,FormItem, Cascader} = UI;
    var id = null;
    const roleService = Service.New("security/role");
    this.RoleForm= Form.create({mapPropsToFields:function(props){
        const data = props.data ? props.data :{};
        id = data.id || null;
        return _.mapValues(_.extend({},data),function(value){
            return {value:value}
        });
    }})(React.createClass({

        handleSubmit(e) {
            e.preventDefault();
            const {form} = this.props;
            form.validateFields((errors, values) => {
                if (!!errors) {
                    return;
                }
                var values = form.getFormatFieldsValue();
                this.props.handleSubmit(values);
            });
        },

        handleReturn(){
            history.go(-1);
        },

        nameValidate(rule, value, callback) {
            if(!value){
                callback();
            }else{
                var reg = /^[A-Za-z0-9_]+$/;
                if(!reg.test(value) && value.length >=5){
                    callback([new Error('抱歉，角色名只能由英文字母、数字和下划线组成。')]);
                }else{
                    callback();
                }
            }
        },
        nameExsits(rule,value,callback){
            if(!value){
                callback([new Error('用户账户必须填写，且不能超出80个字符')]);
            }else{
                setTimeout(() => {
                    var queryFilter = {};
                    const nameFilter = "Q_name_EQ";
                    queryFilter[nameFilter] = value;
                    const idFilter = "Q_id_L_NE";
                    if(id != null){
                        queryFilter[idFilter] = id;
                    }
                    roleService.list(queryFilter, null, function(data){
                        if(value.length > 1 && data.length >0){
                            callback([new Error('抱歉，角色名称已存在，请重新填写。')]);
                        }else{
                            callback();
                        }
                    }.bind(this));
                },100);
            }
        },

        render: function() {
            const { getFieldProps, getFieldError, isFieldValidating } = this.props.form;
            return(
                <Form horizontal form={this.props.form}>
                    <Row>
                        <FormItem
                            label = "名称："
                            labelCol={{ span: 5 }} wrapperCol={{ span: 10 }}>
                            <Input type="text" placeholder="名称" {...getFieldProps('name', {
                                rules: [
                                    { required: true , max:80, message:'角色名称必须填写，且不能超出80个字符'},
                                    { validator: this.nameValidate },
                                ],
                                validate:[
                                    {rules: [
                                        { validator: this.nameExsits},
                                    ], trigger:"onBlur"}
                                ],
                            })} />
                        </FormItem>
                        <FormItem
                            label = "描述："
                            labelCol={{ span: 5 }} wrapperCol={{ span: 10 }}>
                            <Input type="input" placeholder="描述" {...getFieldProps('desp', {
                                rules: [
                                    { required: true ,max:80, message:'角色描述必须填写'},
                                ],
                            })} />
                        </FormItem>
                        <FormItem
                            label = "状态："
                            labelCol={{ span: 5 }} wrapperCol={{ span: 10 }}>
                            <Lookup groupCode = "STATUS" placeholder="请选择状态" {...getFieldProps('status', {
                                rules: [
                                    { required: true,type:'array', message: '请选择状态' }
                                ],
                            })}>
                            </Lookup>
                        </FormItem>
                    </Row>
                    <Row type = "flex" align = "center">
                        <Input type="hidden" {...getFieldProps('id')} />
                        <Col valign = "center">
                            <Button type="primary" htmlType="submit" onClick={this.handleSubmit}>保存</Button>
                            <Button type="primary" onClick={this.handleReturn}>返回</Button>
                        </Col>
                    </Row>
                </Form>);
        }
    }));

});
