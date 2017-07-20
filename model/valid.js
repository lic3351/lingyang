var rules = {
    name: {
        required: true,
        minlength: 3,
        remote: {
            url: "/u/exists", //后台处理程序
            type: "post", //数据发送方式
            dataType: "json", //接受数据格式   
            data: { //要传递的数据
                name: function() {
                    return $("input[name=name]").val();
                }
            }
        }
    },
    passwd: {
        required: true,
        minlength: 5
    },
    passwd2: {
        required: true,
        minlength: 5,
        equalTo: "#passwd"
    }
}