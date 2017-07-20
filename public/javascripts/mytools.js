//参数 jQuery 选择的要格式化的form 对象


//.eg 类可以忽略自动排版
function formrender(form) {
    //var $inputs=$(form).find("input").slice(0,-2)
    $(form).children().first().css({ 'text-align': 'center', 'margin-bottom':'0px' });
    var $inputs = $(form).find("input").not("[type=submit],[type=reset]").not(".eg *");
    $inputs.attr({ class: "form-control" });
    $(form).find("label").not(".eg *").wrap('<div class="form-group"></div>');
    var $group = $(form).find("div.form-group").not(".eg *");
    $inputs.each(function(index, el) {
        //$group[index].append(el);
        $(el).appendTo($group[index]);
    });
    forlabel(form);
}

function forlabel(form) {
    $(form).find("label").not(".eg *").each(function(index, el) {
        var inp = $(el).next();

        var iname = $(inp).attr("name");
        if ($.trim($(inp).attr("id")) == "") {
            $(inp).attr("id", iname);
        }
        var id = $(el).next().attr('id');
        $(el).attr("for", id);

    });
}

function frender(f) {
    $(f).children().first().css({ 'text-align': 'center', 'margin-bottom': '20px' });
    $(f).find("label").not(".eg *").css({ 'text-align': "right" }).attr({ class: "input-group-addon" });
    $(f).find("hr").css({ 'margin-top': "15px", 'margin-bottom': "1px" });
    forlabel(f);
    //第一阶段
    var $inputs = $(f).find(":input").not("[type=submit],[type=reset],[type=radio],button").not(".eg *");
    $inputs.attr({ class: "form-control" });
    $(f).find("label").not(".eg *").wrap('<div class="input-group"></div>');
    var $group = $(f).find("div.input-group").not(".eg *");
    $inputs.each(function(index, el) {
        //$group[index].append(el);//此语句在IE下 报错
        $(el).appendTo($group[index]);
    });
    var rowl = [];
    var coll = [];
    var flag = true;
    var sum = 0;
    var len;
    $(f).find("div.input-group,hr").not(".eg *").each(function(index, el) {
        if (!$(el).is("hr")) {
            rowl.push(el);
            //获取每列的宽度
            var l = $(el).children('label').first().text();
            if (l.indexOf(',') >= 0) {
                var len2 = l.split(',');
                coll.push(len2[len2.length - 1]);
                $(el).children('label').first().text(len2[0]);
            }
        } else {
            if (rowl.length > 0) {
                if (coll.length > 0)
                    sum = coll.reduce(function(x, y) {
                        return new Number(x) + new Number(y)
                    }, 0);
                if (sum != 12) {
                    flag = false;
                    len = 12 / rowl.length;
                    console.log('rowl.length' + rowl.length);
                } else {
                    flag = true;
                }
                var p = null;
                sum = 0;
                while (rowl.length > 0) {
                    var coll_pop = coll.shift();
                    len = (flag ? coll_pop : len);
                    console.log('len  ' + len);
                    var lenn = len;
                    if (p == null) {
                        var col = rowl.shift();
                        $(col).wrap('<div class="col-md-' + lenn + '"></div>');
                        $(col).parent().wrap('<div class="row"></div>');
                        p = $(col).parent().parent();
                    } else {
                        var col = rowl.shift();
                        $(col).wrap('<div class="col-md-' + lenn + '"></div>');
                        $(p).append($(col).parent());
                    }

                }
            }
        }
    });
}
