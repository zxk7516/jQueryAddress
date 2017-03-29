/**
 * Created by 曾祥康 on 2017/3/29 0029.
 */

;(function($) {
    $(function () {

        function setAreaData() {
            window.hasOwnProperty = window.hasOwnProperty || Object.prototype.hasOwnProperty;
            if (localStorage && localStorage['sinosoft_area_data']) {
                data_str = localStorage.getItem('sinosoft_area_data');
                window.area_data = JSON.parse(data_str);
            } else {
                $.ajax({
                    url: '/js/product/areaData.json',
                    dataType: 'json',
                    success: function (d) {
                        window.area_data = d;
                        localStorage.setItem('sinosoft_area_data', JSON.stringify(d));
                    }
                });
            }
        }
        setAreaData();



        $.fn.extend({
            /**
             * 三级地址
             * @param url  将下级地址的ajax url, 父级地址ID (pid) 作 GET 参数传入该url 即可
             * @param initial_1st 使用本插件初始化一级地址选择器
             */
            area3: function (initial_1st) {

                if(! window.area_data){
                    setAreaData();
                }
                var area_elements = $(this).find('select');

                if(area_elements.length !== 3) {
                    console.error('jquery.area.js_> area3 方法只支持三级地址');
                    return false;
                }

                // 设置 1 级(省)地址
                if(initial_1st){
                    // $(area_data[0]).map(function(d){console.log(this);})
                    var area_0_lenth = window.area_data[0].length;
                    for (var i=0;i<area_0_lenth;i++) {
                        var o = new Option(window.area_data[0][i].area_name, window.area_data[0][i].area_id);
                        $(area_elements[0]).append(o);
                    }
                    var event = document.createEvent('Event');
                    event.initEvent('change', true, true);
                    area_elements[1].dispatchEvent(event);
                }
                // 地址改变事件
                area_elements.change(function () {
                    var id = $(this).val();
                    var level = area_elements.index($(this)); // 发现改变的元素是第几个
                    if (area_elements[level + 1]){
                        $(area_elements[level+1]).find('option').remove();
                    }
                    if (area_elements[level + 2]){
                        $(area_elements[level+2]).find('option').remove();
                    }
                    if(window.area_data[id]){
                        var area_lenth = window.area_data[id].length;
                        for (var i=0;i<area_lenth;i++){
                            var o = new Option(window.area_data[id][i].area_name, window.area_data[id][i].area_id);
                            $(area_elements[level + 1]).append(o);
                        }
                        var event = document.createEvent('Event');
                        event.initEvent('change', true, true);
                        area_elements[level + 1].dispatchEvent(event);
                    }
                });
            }
        });
    });
})(jQuery);