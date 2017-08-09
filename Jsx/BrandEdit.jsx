/*[[
   import "web/libdemo/business/component/selector.jsx"
   import "web/libdemo/business/component/imageUpload.jsx"
]]*/
install("web.libDemo.BookEdit",function($S){
    var logger = Log.getLogger("web.business.BrandEdit");
    const {UI, Service, Resource} = Smart;
    const {Form, Icon, FormItem, Input, Card, Button, message, Upload} = UI;

    const service = Service.New("/goods/brand");
    const {Selector} = web.business.selector;
    const {ImageUpload} = web.business.imageUpload;

    const FormApp=Form.create({
        mapPropsToFields: function(props){
            var data=props.data?props.data:{};
            return _.mapValues(data,function(value){
                return {value:value}
            })
        }
    })(React.createClass({
        getInitialState(){
            return {
                image:'',
            }
        },
        componentWillMount(){

        },
        handleSubmit(){
            const {form} = this.props;
            form.validateFields((errors,values)=>{
                if(!!errors){
                    return;
                }
                let data = form.getFieldsValue();
                if(data && data.id){
                    service.update(data,(result)=>{
                        message.success('修改成功');
                        history.go(-1);
                    });
                }else{
                    service.create(data,(result)=>{
                        message.success('创建成功');
                        history.go(-1);
                    });
                }
            })
        },
        Close(){
            history.go(-1);
        },
        getImage(value){
            const {form} = this.props;
            form.setFieldsValue({image: value});
//			console.error(value);
        },
        render:function(){
            const {getFieldDecorator,getFieldProps}=this.props.form;
            const {data}=this.props;
            const currentUser=Env.getUser().id;

            return(
                <div><Card>
                    <Form>
                        <FormItem key="brandName" label="品牌名称" labelCol={{ span: 2 }} wrapperCol={{ span:12 }}  >
                            {getFieldDecorator('brandName', {
                                rules: [{ required: true, message: '名称必须填写!'}],
                            })(
                                <Input/>
                            )}
                        </FormItem>

                        <FormItem key="brandAlias" label="品牌别名" labelCol={{ span: 2 }} wrapperCol={{ span:12 }}  >
                            {getFieldDecorator('brandAlias')(
                                <Input/>
                            )}
                        </FormItem>

                        <FormItem key="brandStatus" label="状态" labelCol={{ span: 2 }} wrapperCol={{ span:12 }}  >
                            {getFieldDecorator('brandStatus', {
                                rules: [{ required: true, message: '状态必选!', whitespace: true }],
                            })(
                                <Selector allowClear url="services/lookup/init/GroupStatus" text="desp" valueKey="code" placeholder="请选择状态"/>
                            )}
                        </FormItem>

                        <FormItem key="brandLogo">
                            {getFieldDecorator('brandLogo')(
                                <Input type="hidden"/>
                            )}
                        </FormItem>
                        <FormItem label="图片" labelCol={{ span: 2 }} wrapperCol={{ span:12 }} style={{marginTop:'-30px'}} >
                            <ImageUpload getImage={this.getImage} />
                        </FormItem>

                        <FormItem key="id" >
                            {getFieldDecorator('id')(
                                <Input type="hidden"/>
                            )}
                        </FormItem>
                    </Form>
                    <div style={{textAlign:'center',marginTop:'10px'}}>
                        <Button type='primary' onClick={this.handleSubmit} >提交</Button>
                        <Button type='primary' onClick={this.Close} style={{marginLeft:'10px'}}>返回</Button>
                    </div>
                </Card></div>
            );
        }
    }));



    const App = React.createClass({
        getInitialState(){
            return {
                data:{},
            }
        },
        componentWillMount(){
            const id=Resource.getQs('id');
            if(id){
                service.get(id,(data)=>{
                    this.setState({data});
                });
            }
        },
        render: function() {
            return (<FormApp data={this.state.data}/>)
        }
    });

    this.ready = function(){
        return App;
    };
});